import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Package, Truck, CheckCircle2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/order/$orderId/tracking")({
  component: OrderTrackingPage,
});

function OrderTrackingPage() {
  const { orderId } = Route.useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      const { data, error } = await supabase
        .from("new_orders")
        .select("*")
        .eq("id", orderId)
        .single();
        
      if (data) setOrder(data);
      setLoading(false);
    }
    loadOrder();

    // Subscribe to realtime updates for this order
    const channel = supabase
      .channel(`order-tracking-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "new_orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          setOrder(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId]);

  if (loading) {
    return <div className="p-20 text-center">Loading tracking details...</div>;
  }

  if (!order) {
    return <div className="p-20 text-center text-destructive">Order not found.</div>;
  }

  const steps = [
    { id: "confirmed", label: "Order Confirmed", icon: CheckCircle2 },
    { id: "packed", label: "Packed", icon: Package },
    { id: "shipped", label: "Shipped", icon: Truck },
    { id: "out_for_delivery", label: "Out for Delivery", icon: MapPin },
    { id: "delivered", label: "Delivered", icon: CheckCircle2 },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === order.status);
  
  // Calculate a mock expected delivery date (3 days from created_at)
  const expectedDate = new Date(order.created_at);
  expectedDate.setDate(expectedDate.getDate() + 3);

  return (
    <div className="min-h-screen bg-muted/20 py-10 px-4">
      <div className="mx-auto max-w-3xl">
        <Button variant="outline" asChild className="mb-6">
          <Link to="/dashboard"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Link>
        </Button>
        
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm border border-gray-100">
          <div className="border-b border-gray-100 bg-gray-50/50 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-serif text-2xl font-bold text-gray-900">Track Order</h1>
                <p className="mt-1 text-sm text-gray-500">Order #{order.order_number || order.id.slice(0, 8)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Expected Delivery</p>
                <p className="text-sm text-gray-500">{expectedDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="relative">
              <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-100" />
              
              <div className="space-y-8">
                {steps.map((step, index) => {
                  const isCompleted = currentStepIndex >= index;
                  const isCurrent = currentStepIndex === index;
                  const Icon = step.icon;

                  return (
                    <div key={step.id} className="relative flex items-center gap-6">
                      <div className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 bg-white transition-colors duration-300 ${
                        isCompleted ? "border-primary text-primary" : "border-gray-200 text-gray-300"
                      } ${isCurrent ? "ring-4 ring-primary/10" : ""}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className={`font-medium ${isCompleted ? "text-gray-900" : "text-gray-400"}`}>
                          {step.label}
                        </h3>
                        {isCurrent && (
                          <p className="text-sm text-primary">This is the current status of your order.</p>
                        )}
                        {!isCompleted && !isCurrent && (
                          <p className="text-sm text-gray-400">Pending</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-100 bg-gray-50/50 p-6 flex gap-4">
             <Button variant="default" asChild className="w-full">
                <Link to={`/invoice/${order.id}`}>View Invoice</Link>
             </Button>
             <Button variant="outline" asChild className="w-full">
                <Link to="/contact">Get Support</Link>
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
