import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { Resend } from "https://esm.sh/resend@3.2.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// --- HTML Templates ---
const baseLayout = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #fcf9f2; margin: 0; padding: 0; color: #333333; }
    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 40px; margin-bottom: 40px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background-color: #3f513f; padding: 30px 20px; text-align: center; }
    .header h1 { color: #f2e3c6; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 1px; }
    .content { padding: 40px 30px; line-height: 1.6; }
    .footer { background-color: #f7f7f7; padding: 20px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #eeeeee; }
    .btn { display: inline-block; background-color: #3f513f; color: #f2e3c6; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 20px; }
    .highlight { color: #3f513f; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>SRI VENKATESHWARA OIL MILL</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>Sri Venkateshwara Oil Mill<br>123 Tradition Lane, Heritage City</p>
      <p>Follow us on <a href="#" style="color: #3f513f;">Instagram</a> | <a href="#" style="color: #3f513f;">Facebook</a></p>
    </div>
  </div>
</body>
</html>
`;

const templates: Record<string, (payload: any) => string> = {
  // CUSTOMER TEMPLATES
  "welcome": (p) => `
    <h2>Welcome to the Family, ${p.name || 'Customer'}!</h2>
    <p>We are delighted to have you. Experience the pure taste of tradition with our cold-pressed oils, premium dry fruits, and more.</p>
    <a href="${p.store_url || '#'}" class="btn">Start Shopping</a>
  `,
  "email_verification": (p) => `
    <h2>Verify Your Email</h2>
    <p>Please click the button below to verify your email address and activate your account.</p>
    <a href="${p.verification_url}" class="btn">Verify Email</a>
  `,
  "password_reset": (p) => `
    <h2>Password Reset Request</h2>
    <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
    <a href="${p.reset_url}" class="btn">Reset Password</a>
  `,
  "order_confirmation": (p) => `
    <h2>Order Confirmed!</h2>
    <p>Hi ${p.name || 'Customer'},</p>
    <p>Thank you for your order <span class="highlight">#${p.order_number}</span>. We're getting it ready for you.</p>
    <p><strong>Total:</strong> ₹${p.total_amount}</p>
    <a href="${p.order_url || '#'}" class="btn">View Order Details</a>
  `,
  "payment_success": (p) => `
    <h2>Payment Successful</h2>
    <p>Your payment of ₹${p.amount} for Order #${p.order_number} has been received successfully.</p>
  `,
  "order_shipped": (p) => `
    <h2>Your Order is on the way!</h2>
    <p>Good news! Your order #${p.order_number} has been shipped via ${p.carrier || 'our delivery partner'}.</p>
    <p><strong>Tracking Number:</strong> ${p.tracking_number || 'N/A'}</p>
    <a href="${p.tracking_url || '#'}" class="btn">Track Order</a>
  `,
  "out_for_delivery": (p) => `
    <h2>Out for Delivery</h2>
    <p>Your order #${p.order_number} is out for delivery and will reach you today.</p>
  `,
  "order_delivered": (p) => `
    <h2>Order Delivered</h2>
    <p>Your order #${p.order_number} has been delivered successfully. We hope you enjoy our products!</p>
  `,
  "order_cancelled": (p) => `
    <h2>Order Cancelled</h2>
    <p>Your order #${p.order_number} has been cancelled as requested.</p>
  `,
  "review_reminder": (p) => `
    <h2>How did we do?</h2>
    <p>Hi ${p.name || 'Customer'},</p>
    <p>We hope you are enjoying your recent purchase. We'd love to hear your thoughts!</p>
    <a href="${p.review_url || '#'}" class="btn">Leave a Review</a>
  `,
  
  // ADMIN TEMPLATES
  "admin_new_order": (p) => `
    <h2>New Order Received</h2>
    <p><strong>Order #:</strong> ${p.order_number}</p>
    <p><strong>Amount:</strong> ₹${p.total_amount}</p>
    <p><strong>Customer:</strong> ${p.customer_name}</p>
  `,
  "admin_new_customer": (p) => `
    <h2>New Customer Registration</h2>
    <p>A new customer has joined the platform.</p>
    <p><strong>Name:</strong> ${p.customer_name}</p>
    <p><strong>Email:</strong> ${p.customer_email}</p>
  `,
  "admin_low_stock": (p) => `
    <h2>Low Stock Alert</h2>
    <p>The following product is running low on inventory:</p>
    <p><strong>Product:</strong> ${p.product_name}</p>
    <p><strong>Remaining Stock:</strong> <span style="color:red; font-weight:bold;">${p.stock}</span></p>
  `,
  "admin_new_ticket": (p) => `
    <h2>New Support Ticket</h2>
    <p><strong>Subject:</strong> ${p.subject}</p>
    <p><strong>From:</strong> ${p.customer_email}</p>
    <p>${p.message}</p>
  `,
  "admin_new_review": (p) => `
    <h2>New Review Pending Approval</h2>
    <p>A new review has been submitted for <strong>${p.product_name}</strong> and is awaiting moderation.</p>
    <p><strong>Rating:</strong> ${p.rating} Stars</p>
  `
};

serve(async (req) => {
  try {
    const { record } = await req.json();

    // If no record, this might be a manual invocation testing the function
    if (!record || !record.id) {
       return new Response(JSON.stringify({ error: "No record found" }), { status: 400 });
    }

    const emailId = record.id;
    const { recipient, subject, template, payload, attempts } = record;

    if (attempts >= 5) {
      return new Response(JSON.stringify({ message: "Max attempts reached" }), { status: 200 });
    }

    // Mark as processing
    await supabase.from("email_logs").update({ status: "processing" }).eq("id", emailId);

    const renderHtml = templates[template];
    if (!renderHtml) {
      throw new Error(`Template '${template}' not found`);
    }

    const htmlContent = baseLayout(renderHtml(payload || {}));

    // Send via Resend
    const res = await resend.emails.send({
      from: "Sri Venkateshwara Oil Mill <noreply@svom.com>", // Replace with verified domain
      to: [recipient],
      subject: subject,
      html: htmlContent,
    });

    if (res.error) {
      throw new Error(res.error.message);
    }

    // Mark as sent
    await supabase.from("email_logs").update({ 
      status: "sent", 
      sent_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      attempts: attempts + 1
    }).eq("id", emailId);

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error: any) {
    console.error("Error processing email:", error);
    
    // Attempt to update the record with failure state
    try {
      const { record } = await req.json().catch(() => ({ record: null }));
      if (record && record.id) {
        await supabase.from("email_logs").update({ 
          status: "failed", 
          error_message: error.message,
          updated_at: new Date().toISOString(),
          attempts: (record.attempts || 0) + 1
        }).eq("id", record.id);
      }
    } catch (e) {
      // Ignore inner error
    }

    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
