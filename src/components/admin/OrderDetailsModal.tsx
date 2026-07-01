import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Printer, ExternalLink, MapPin, Package, CreditCard, Truck, Calendar, Copy, Check } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type OrderView = {
  id: string;
  order_number: string;
  created_at: string;
  subtotal: number;
  gst_total: number;
  shipping_total: number;
  discount_total: number;
  grand_total: number;
  order_status: string;
  expected_delivery_date: string | null;
  delivery_notes: string | null;
  customer_name: string;
  customer_mobile: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_pincode: string;
  payment_method: string;
  payment_status: string;
  delivery_partner_id: string | null;
  delivery_partner_name: string | null;
  items: {
    id: string;
    product_name: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  logs: {
    id: string;
    status: string;
    note: string | null;
    updated_by: string;
    created_at: string;
  }[];
};

type Props = {
  order: OrderView | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partners: { id: string; name: string }[];
  onUpdateStatus: (orderId: string, status: string, partnerId?: string) => Promise<void>;
};

const STATUSES = [
  "pending",
  "confirmed",
  "Order Confirmed",
  "Packed",
  "Ready for Dispatch",
  "Assigned to Delivery Partner",
  "Out for Delivery",
  "Delivered",
  "Delivery Failed",
  "Returned",
  "Cancelled"
];

export function OrderDetailsModal({ order, open, onOpenChange, partners, onUpdateStatus }: Props) {
  const [copied, setCopied] = useState(false);
  const [updating, setUpdating] = useState(false);

  if (!order) return null;

  const copyOrderNum = () => {
    navigator.clipboard.writeText(order.order_number);
    setCopied(true);
    toast.success("Order number copied");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    try {
      await onUpdateStatus(order.id, newStatus, order.delivery_partner_id || undefined);
      toast.success("Order status updated");
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const handlePartnerChange = async (partnerId: string) => {
    if (partnerId === "none") partnerId = "";
    setUpdating(true);
    try {
      await onUpdateStatus(order.id, order.order_status, partnerId || undefined);
      toast.success("Delivery partner updated");
    } catch (err: any) {
      toast.error(err.message || "Failed to assign partner");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0 gap-0 overflow-hidden bg-background">
        <DialogHeader className="p-6 border-b border-border bg-card shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl font-serif flex items-center gap-3">
                Order #{order.order_number}
                <button 
                  onClick={copyOrderNum} 
                  className="text-muted-foreground hover:text-foreground transition"
                  title="Copy Order Number"
                >
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Placed on {new Date(order.created_at).toLocaleString('en-IN')}
              </p>
            </div>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                {/* @ts-expect-error - Route doesn't exist yet */}
                <Link to={`/order/${order.id}/tracking`} target="_blank">
                  <Truck className="mr-2 h-4 w-4" /> Live Tracking
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                {/* @ts-expect-error - Route doesn't exist yet */}
                <Link to={`/invoice/${order.id}`} target="_blank">
                  <Printer className="mr-2 h-4 w-4" /> Print Invoice
                </Link>
              </Button>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Column: Details */}
            <div className="md:col-span-2 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-border bg-card/50">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center">
                    <Package className="mr-2 h-4 w-4" /> Customer & Shipping
                  </h3>
                  <p className="font-medium">{order.customer_name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{order.customer_mobile}</p>
                  <div className="mt-3 text-sm flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                    <span>
                      {order.shipping_address}<br/>
                      {order.shipping_city}, {order.shipping_state} {order.shipping_pincode}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-border bg-card/50">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 flex items-center">
                    <CreditCard className="mr-2 h-4 w-4" /> Payment Details
                  </h3>
                  <p className="font-medium uppercase">{order.payment_method}</p>
                  <Badge variant={order.payment_status === 'paid' ? 'default' : 'secondary'} className="mt-2">
                    {order.payment_status}
                  </Badge>
                  {order.expected_delivery_date && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Calendar className="mr-2 h-3 w-3" /> Expected Delivery
                      </p>
                      <p className="text-sm font-medium mt-1">
                        {new Date(order.expected_delivery_date).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Items Table */}
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/50 text-muted-foreground text-xs uppercase">
                    <tr>
                      <th className="px-4 py-3 font-medium">Product</th>
                      <th className="px-4 py-3 font-medium">Price</th>
                      <th className="px-4 py-3 font-medium">Qty</th>
                      <th className="px-4 py-3 font-medium text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {order.items?.map(item => (
                      <tr key={item.id} className="bg-card">
                        <td className="px-4 py-3 font-medium">{item.product_name}</td>
                        <td className="px-4 py-3 text-muted-foreground">₹{item.price}</td>
                        <td className="px-4 py-3">{item.quantity}</td>
                        <td className="px-4 py-3 text-right font-medium">₹{item.total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="bg-card/50 p-4 border-t border-border space-y-2 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{order.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>GST (5%)</span>
                    <span>₹{order.gst_total}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Shipping</span>
                    <span>₹{order.shipping_total}</span>
                  </div>
                  {order.discount_total > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount</span>
                      <span>-₹{order.discount_total}</span>
                    </div>
                  )}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-serif text-lg">
                    <span>Grand Total</span>
                    <span>₹{order.grand_total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Actions & Logs */}
            <div className="space-y-6">
              <div className="p-4 rounded-xl border border-border bg-card shadow-sm">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                  Manage Fulfillment
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium mb-1.5 block">Order Status</label>
                    <Select value={order.order_status} onValueChange={handleStatusChange} disabled={updating}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUSES.map(s => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-medium mb-1.5 block flex items-center justify-between">
                      Delivery Partner
                      {order.delivery_partner_id && (
                        <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded">Assigned</span>
                      )}
                    </label>
                    <Select 
                      value={order.delivery_partner_id || "none"} 
                      onValueChange={handlePartnerChange}
                      disabled={updating}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Assign a partner..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Unassigned</SelectItem>
                        {partners.map(p => (
                          <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border bg-card">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4 flex items-center">
                  <Truck className="mr-2 h-4 w-4" /> Delivery Timeline
                </h3>
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
                  {order.logs?.length ? order.logs.map((log, i) => (
                    <div key={log.id} className="relative flex items-start gap-3">
                      <div className="h-4 w-4 shrink-0 rounded-full border-2 border-background bg-primary z-10 mt-1" />
                      <div>
                        <p className="text-sm font-medium">{log.status}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(log.created_at).toLocaleString('en-IN')} · {log.updated_by}
                        </p>
                        {log.note && <p className="text-xs mt-1 bg-muted p-2 rounded-md">{log.note}</p>}
                      </div>
                    </div>
                  )) : (
                    <p className="text-xs text-muted-foreground text-center py-4 relative z-10">No updates yet.</p>
                  )}
                </div>
              </div>
            </div>

          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
