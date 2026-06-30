import { serve } from "std/http/server.ts";
import { createClient } from "supabase-js";
import { hmac } from "crypto/hmac.ts";

const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // We use the SERVICE_ROLE key here because we need to bypass RLS to insert orders securely in a transaction-like way
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          persistSession: false,
        },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    ).auth.getUser();

    if (!user || userError) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderDetails, // cart items, address, total etc. passed from client
    } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return new Response(JSON.stringify({ error: "Missing Razorpay payment details" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Verify Signature
    const bodyText = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = hmac("sha256", RAZORPAY_KEY_SECRET, bodyText, "utf8", "hex");

    if (expectedSignature !== razorpay_signature) {
      return new Response(JSON.stringify({ error: "Invalid payment signature" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Now securely insert order data
    // Deno doesn't have native SQL transaction blocks easily via supabase-js without an RPC. 
    // We will do an RPC call to a Postgres function to handle the transaction.
    
    const { data: result, error: rpcError } = await supabase.rpc("commit_order_transaction", {
      p_user_id: user.id,
      p_razorpay_order_id: razorpay_order_id,
      p_razorpay_payment_id: razorpay_payment_id,
      p_razorpay_signature: razorpay_signature,
      p_order_details: orderDetails,
    });

    if (rpcError) {
      throw new Error(rpcError.message);
    }

    return new Response(JSON.stringify({ success: true, orderId: result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
