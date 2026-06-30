import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Printer, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/invoice/$orderId")({
  component: InvoicePage,
});

function InvoicePage() {
  const { orderId } = Route.useParams();
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const { data: o, error: errO } = await supabase
          .from("new_orders")
          .select("*, addresses(*)")
          .eq("id", orderId)
          .single();

        if (errO) throw errO;
        setOrder(o);

        const { data: i } = await supabase
          .from("order_items")
          .select("*")
          .eq("order_id", orderId);
        setItems(i || []);

        const { data: p } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", o.user_id)
          .single();
        setProfile(p);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [orderId]);

  if (loading) {
    return <div className="p-20 text-center">Loading invoice...</div>;
  }

  if (!order) {
    return <div className="p-20 text-center text-destructive">Order not found.</div>;
  }

  const invoiceUrl = `${window.location.origin}/invoice/${orderId}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(invoiceUrl)}`;

  return (
    <div className="min-h-screen bg-muted/20 pb-20">
      <div className="print:hidden mx-auto max-w-4xl px-4 py-8 flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link to="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders</Link>
        </Button>
        <Button onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" /> Print Invoice
        </Button>
      </div>

      <div className="mx-auto max-w-4xl bg-white p-8 shadow-sm print:shadow-none print:p-0">
        <div className="flex items-start justify-between border-b border-gray-200 pb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-gray-900">Sri Venkateshwara Oil Mill</h1>
            <p className="mt-2 text-sm text-gray-500">Premium Cold Pressed Oils</p>
            <p className="text-sm text-gray-500">123 Market Street, City, State - 123456</p>
            <p className="text-sm text-gray-500">GSTIN: 29XXXXXXXXXXXX</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-900">TAX INVOICE</h2>
            <p className="mt-2 text-sm text-gray-500">
              Invoice #: <span className="font-medium text-gray-900">{order.invoice_number || "Pending"}</span>
            </p>
            <p className="text-sm text-gray-500">
              Order #: <span className="font-medium text-gray-900">{order.order_number || order.id.slice(0, 8)}</span>
            </p>
            <p className="text-sm text-gray-500">
              Date: <span className="font-medium text-gray-900">{new Date(order.created_at).toLocaleDateString()}</span>
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Bill To:</h3>
            <p className="mt-2 text-sm text-gray-900">{order.addresses?.name || profile?.full_name}</p>
            <p className="text-sm text-gray-500">{order.addresses?.address}</p>
            <p className="text-sm text-gray-500">{order.addresses?.city}, {order.addresses?.state} - {order.addresses?.pincode}</p>
            <p className="text-sm text-gray-500">Phone: {order.addresses?.mobile}</p>
          </div>
          <div>
             <img src={qrCodeUrl} alt="Scan to view online" className="h-24 w-24 object-contain" />
             <p className="mt-1 text-center text-[10px] text-gray-400">Scan to verify</p>
          </div>
        </div>

        <div className="mt-8">
          <table className="w-full text-left text-sm text-gray-900">
            <thead className="border-b border-gray-200 text-gray-500">
              <tr>
                <th className="pb-3 font-semibold">Item Description</th>
                <th className="pb-3 font-semibold text-center">Qty</th>
                <th className="pb-3 font-semibold text-right">Price</th>
                <th className="pb-3 font-semibold text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item) => (
                <tr key={item.id}>
                  <td className="py-4">{item.product_name}</td>
                  <td className="py-4 text-center">{item.quantity}</td>
                  <td className="py-4 text-right">₹{item.price}</td>
                  <td className="py-4 text-right">₹{item.total}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t border-gray-200">
              <tr>
                <td colSpan={3} className="pt-4 text-right font-medium text-gray-500">Subtotal</td>
                <td className="pt-4 text-right text-gray-900">₹{order.subtotal}</td>
              </tr>
              {order.discount_total > 0 && (
                <tr>
                  <td colSpan={3} className="pt-2 text-right font-medium text-gray-500">Discount</td>
                  <td className="pt-2 text-right text-red-600">-₹{order.discount_total}</td>
                </tr>
              )}
              <tr>
                <td colSpan={3} className="pt-2 text-right font-medium text-gray-500">GST (5%)</td>
                <td className="pt-2 text-right text-gray-900">₹{order.gst_total}</td>
              </tr>
              <tr>
                <td colSpan={3} className="pt-2 text-right font-medium text-gray-500">Shipping</td>
                <td className="pt-2 text-right text-gray-900">₹{order.shipping_total === 0 ? "Free" : order.shipping_total}</td>
              </tr>
              <tr>
                <td colSpan={3} className="pt-4 text-right text-lg font-bold text-gray-900">Grand Total</td>
                <td className="pt-4 text-right text-lg font-bold text-gray-900">₹{order.grand_total}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8 text-center text-xs text-gray-500">
          <p>Thank you for choosing Sri Venkateshwara Oil Mill!</p>
          <p>This is a computer-generated document. No signature is required.</p>
        </div>
      </div>
    </div>
  );
}
