import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LogIn, Trash2, Loader2 } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useShop } from "@/lib/store";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — SRI VENKETESWARA OIL MILL" },
      { name: "description", content: "Review your cart and complete your order." },
    ],
  }),
  component: Checkout,
});

const PAYMENT_METHODS = [
  "UPI / Google Pay",
  "PhonePe",
  "Paytm",
  "Debit / Credit Card",
  "Net Banking",
  "Cash on Delivery",
] as const;

const checkoutSchema = z.object({
  name: z.string().min(2, "Name is required"),
  mobile: z.string().min(10, "Valid mobile number is required"),
  address: z.string().min(5, "Delivery address is required"),
  landmark: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  pincode: z.string().min(6, "Valid pincode is required"),
  payment: z.string().min(1, "Payment method is required"),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

function loadRazorpayScript() {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function Checkout() {
  const { cart, updateQty, removeFromCart, clearCart } = useShop();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [coupon, setCoupon] = useState("");
  const [discountPct, setDiscountPct] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: "",
      mobile: "",
      address: "",
      landmark: "",
      city: "",
      state: "",
      pincode: "",
      payment: PAYMENT_METHODS[0],
    },
  });

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = Math.round((subtotal * discountPct) / 100);
  const taxable = subtotal - discount;
  const gst = Math.round(taxable * 0.05);
  const shipping = taxable === 0 ? 0 : taxable > 999 ? 0 : 60;
  const total = taxable + gst + shipping;

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === "SVOM10") {
      setDiscountPct(10);
      toast.success("Coupon applied — 10% off");
    } else {
      setDiscountPct(0);
      toast.error("Invalid coupon code");
    }
  };

  const getPaymentMethodEnum = (m: string) => {
    if (m === "Cash on Delivery") return "cod";
    if (m === "UPI / Google Pay") return "upi";
    if (m === "PhonePe") return "phonepe";
    if (m === "Paytm") return "paytm";
    if (m === "Net Banking") return "net_banking";
    return "credit_card";
  };

  const onSubmit = async (values: CheckoutFormValues) => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    if (!user) {
      toast.error("Please sign in to place your order");
      navigate({ to: "/auth" });
      return;
    }
    
    setSubmitting(true);
    
    console.log("Trace - Checkout State (onSubmit):");
    console.log("cart items being sent to RPC:", cart.map(c => ({ id: c.id, name: c.name })));

    try {
      let addressId = selectedAddressId;
      if (!addressId) {
        const { data, error } = await supabase.from('addresses').insert({
          user_id: user.id,
          name: values.name,
          mobile: values.mobile,
          address: values.address,
          landmark: values.landmark || null,
          city: values.city,
          state: values.state,
          pincode: values.pincode
        }).select('id').single();
        
        if (error) throw error;
        addressId = data.id;
      }

      const orderDetails = {
        address_id: addressId,
        subtotal,
        gst,
        shipping,
        discount,
        total,
        coupon: discountPct > 0 ? coupon.trim().toUpperCase() : null,
        payment_method: getPaymentMethodEnum(values.payment),
        items: cart,
      };

      if (values.payment === "Cash on Delivery") {
        // Direct commit for COD
        const { data, error } = await supabase.rpc("commit_order_transaction", {
          p_user_id: user.id,
          p_order_details: orderDetails
        });
        if (error) throw error;
        clearCart();
        toast.success("Order placed successfully");
        navigate({ to: `/invoice/${data}` });
      } else {
        // Razorpay flow
        const res = await loadRazorpayScript();
        if (!res) {
          throw new Error("Razorpay SDK failed to load. Are you online?");
        }

        const { data: session } = await supabase.auth.getSession();
        
        const { data: rzpOrderData, error: rzpOrderError } = await supabase.functions.invoke('create-razorpay-order', {
          body: { amount: total }
        });
        
        if (rzpOrderError || rzpOrderData?.error) {
          throw new Error(rzpOrderError?.message || rzpOrderData?.error || "Failed to create order");
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_xxxx",
          amount: rzpOrderData.amount,
          currency: rzpOrderData.currency,
          name: "SRI VENKETESWARA OIL MILL",
          description: "Premium Cold Pressed Oils",
          order_id: rzpOrderData.id,
          handler: async function (response: any) {
            try {
              const { data: verifyData, error: verifyReqError } = await supabase.functions.invoke('verify-payment', {
                body: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderDetails,
                }
              });
              
              if (verifyReqError || verifyData?.error) {
                throw new Error(verifyReqError?.message || verifyData?.error || "Payment verification failed");
              }

              clearCart();
              toast.success("Payment successful! Order placed.");
              navigate({ to: `/invoice/${verifyData.orderId}` });
            } catch (err: any) {
              toast.error(err.message || "Payment verification failed");
            }
          },
          prefill: {
            name: values.name,
            email: user.email,
            contact: values.mobile,
          },
          theme: {
            color: "#b0891d",
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on("payment.failed", function (response: any) {
          toast.error(response.error.description || "Payment failed");
        });
        rzp.open();
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (user) {
      supabase.from("addresses").select("*").eq("user_id", user.id).then(({ data }) => {
        if (data && data.length > 0) {
          setSavedAddresses(data);
        }
      });
    }
  }, [user]);

  useEffect(() => {
    if (!savedAddresses.length || !selectedAddressId) return;
    const selected = savedAddresses.find((item) => item.id === selectedAddressId);
    if (!selected) return;
    form.reset({
      ...form.getValues(),
      name: selected.name,
      mobile: selected.mobile,
      address: selected.address,
      landmark: selected.landmark || "",
      city: selected.city,
      state: selected.state,
      pincode: selected.pincode,
    });
  }, [savedAddresses, selectedAddressId, form]);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
        <h1 className="font-serif text-3xl md:text-4xl text-foreground">Checkout</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Review your cart, share delivery details and complete your order.
        </p>

        {!authLoading && !user && cart.length > 0 ? (
          <div className="mt-12 rounded-2xl border border-border bg-card p-10 text-center">
            <LogIn className="mx-auto h-10 w-10 text-primary" />
            <h2 className="mt-3 font-serif text-xl text-foreground">Sign in to checkout</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your cart is saved. Sign in with a one-time email code to place the order.
            </p>
            <Button asChild className="mt-5" size="lg">
              <Link to="/auth">Sign in with email</Link>
            </Button>
          </div>
        ) : cart.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-border bg-card p-10 text-center">
            <p className="text-muted-foreground">Your cart is empty.</p>
            <Button asChild className="mt-4">
              <Link to="/shop">Browse products</Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
            <div className="space-y-8">
              {/* Cart items */}
              <section className="rounded-2xl border border-border bg-card p-6">
                <h2 className="font-serif text-xl text-foreground">Your cart</h2>
                <ul className="mt-4 divide-y divide-border">
                  {cart.map((item) => (
                    <li key={item.id + item.size} className="flex gap-4 py-4">
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[var(--cream)]">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="h-full w-full object-contain p-2" />
                        ) : (
                          <span className="text-xs text-muted-foreground">No image</span>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="font-medium text-foreground">{item.name}</div>
                            <div className="text-xs text-muted-foreground">{item.size}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id, item.size)}
                            className="text-muted-foreground hover:text-destructive"
                            aria-label="Remove"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-border">
                            <button type="button" onClick={() => updateQty(item.id, item.size, item.qty - 1)} className="h-8 w-8">−</button>
                            <span className="w-6 text-center text-sm">{item.qty}</span>
                            <button type="button" onClick={() => updateQty(item.id, item.size, item.qty + 1)} className="h-8 w-8">+</button>
                          </div>
                          <div className="font-medium text-foreground">₹{item.price * item.qty}</div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex gap-2">
                  <Input
                    placeholder="Coupon code (try SVOM10)"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                  />
                  <Button type="button" variant="outline" onClick={applyCoupon}>Apply</Button>
                </div>
              </section>

              {/* Delivery */}
              <section className="rounded-2xl border border-border bg-card p-6">
                <h2 className="font-serif text-xl text-foreground">Delivery details</h2>
                <div className="mt-4 space-y-4">
                {savedAddresses.length > 0 && (
                  <div className="rounded-3xl border border-border bg-background/80 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">Saved delivery addresses</p>
                        <p className="text-xs text-muted-foreground">Choose one to autofill the form.</p>
                      </div>
                      <Button asChild variant="outline">
                        <Link to="/addresses">Manage</Link>
                      </Button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {savedAddresses.map((address) => (
                        <button
                          key={address.id}
                          type="button"
                          onClick={() => setSelectedAddressId(address.id)}
                          className={`rounded-2xl border px-4 py-3 text-left transition ${
                            selectedAddressId === address.id
                              ? "border-primary bg-primary/5"
                              : "border-border bg-card hover:border-primary/40"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">{address.name}</span>
                            {address.is_default && (
                              <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-primary">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="mt-2 text-sm text-foreground leading-6">
                            {address.address}
                            {address.landmark ? ` · ${address.landmark}` : ""}
                            <br />
                            {address.city}, {address.state} · {address.pincode}
                            <br />
                            {address.mobile}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Label>Full Name *</Label>
                  <Input {...form.register("name")} className="mt-1" />
                  {form.formState.errors.name && <p className="mt-1 text-xs text-destructive">{form.formState.errors.name.message}</p>}
                </div>
                <div>
                  <Label>Mobile Number *</Label>
                  <Input {...form.register("mobile")} className="mt-1" />
                  {form.formState.errors.mobile && <p className="mt-1 text-xs text-destructive">{form.formState.errors.mobile.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <Label>Delivery Address *</Label>
                  <Input {...form.register("address")} className="mt-1" />
                  {form.formState.errors.address && <p className="mt-1 text-xs text-destructive">{form.formState.errors.address.message}</p>}
                </div>
                <div>
                  <Label>Landmark</Label>
                  <Input {...form.register("landmark")} className="mt-1" />
                </div>
                <div>
                  <Label>City *</Label>
                  <Input {...form.register("city")} className="mt-1" />
                  {form.formState.errors.city && <p className="mt-1 text-xs text-destructive">{form.formState.errors.city.message}</p>}
                </div>
                <div>
                  <Label>State *</Label>
                  <Input {...form.register("state")} className="mt-1" />
                  {form.formState.errors.state && <p className="mt-1 text-xs text-destructive">{form.formState.errors.state.message}</p>}
                </div>
                <div>
                  <Label>Pincode *</Label>
                  <Input {...form.register("pincode")} className="mt-1" />
                  {form.formState.errors.pincode && <p className="mt-1 text-xs text-destructive">{form.formState.errors.pincode.message}</p>}
                </div>
              </div>
              </section>

              {/* Payment */}
              <section className="rounded-2xl border border-border bg-card p-6">
                <h2 className="font-serif text-xl text-foreground">Payment method</h2>
                <Controller
                  control={form.control}
                  name="payment"
                  render={({ field }) => (
                    <RadioGroup 
                      value={field.value} 
                      onValueChange={field.onChange} 
                      className="mt-4 grid gap-3 md:grid-cols-2"
                    >
                      {PAYMENT_METHODS.map((m) => (
                        <label
                          key={m}
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                            field.value === m ? "border-primary bg-primary/5" : "border-border"
                          }`}
                        >
                          <RadioGroupItem value={m} id={m} />
                          <span className="text-sm text-foreground">{m}</span>
                        </label>
                      ))}
                    </RadioGroup>
                  )}
                />
              </section>
            </div>

            {/* Summary */}
            <aside className="h-fit space-y-4 rounded-2xl border border-border bg-card p-6 lg:sticky lg:top-24">
              <h2 className="font-serif text-xl text-foreground">Order Summary</h2>
              <Row label="Subtotal" value={`₹${subtotal}`} />
              {discount > 0 && <Row label={`Discount (${discountPct}%)`} value={`− ₹${discount}`} />}
              <Row label="GST (5%)" value={`₹${gst}`} />
              <Row label="Shipping" value={shipping === 0 ? "Free" : `₹${shipping}`} />
              <div className="h-px bg-border" />
              <Row label="Total" value={`₹${total}`} bold />
              <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                {submitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing…</>
                ) : (
                  "Place Order"
                )}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Secure checkout · Invoice generated automatically
              </p>
            </aside>
          </form>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex items-center justify-between text-sm ${bold ? "text-base font-semibold text-foreground" : "text-muted-foreground"}`}>
      <span>{label}</span>
      <span className={bold ? "font-serif text-xl text-foreground" : "text-foreground"}>{value}</span>
    </div>
  );
}
