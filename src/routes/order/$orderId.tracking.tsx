import { createFileRoute, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, MapPin, Truck, CheckCircle2, Clock, Map as MapIcon } from "lucide-react";
import { format } from "date-fns";

export const Route = createFileRoute("/order/$orderId/tracking")({
  component: OrderTracking,
});

// 1. Reusable Map Placeholder Component
function DeliveryMap({ coordinates, status }: { coordinates: [number, number] | null; status: string }) {
  return (
    <div className="relative w-full h-64 md:h-80 bg-muted/30 rounded-xl border overflow-hidden flex items-center justify-center">
      {/* Background pattern simulating map tiles */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      <div className="z-10 flex flex-col items-center p-6 bg-background/80 backdrop-blur-sm rounded-2xl border shadow-sm text-center">
        <MapIcon className="h-8 w-8 text-primary mb-2" />
        <h3 className="font-semibold text-foreground">Live Tracking Map</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-[250px]">
          Google Maps Integration Pending. <br/>
          (Coordinates: {coordinates ? `${coordinates[0].toFixed(4)}, ${coordinates[1].toFixed(4)}` : 'Fetching...'})
        </p>
        <div className="mt-4 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
          {status}
        </div>
      </div>
    </div>
  );
}

function OrderTracking() {
  const { orderId } = Route.useParams();
  const [order, setOrder] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTrackingData = async () => {
    // Fetch Order details
    const { data: oData, error: oError } = await supabase
      .from("new_orders")
      .select(`
        id, order_number, status, expected_delivery_date, created_at,
        delivery_partners ( name, mobile ),
        addresses ( address, city, state, pincode )
      `)
      .eq("id", orderId)
      .single();

    if (oData) setOrder(oData);

    // Fetch Logs
    const { data: lData } = await supabase
      .from("delivery_logs")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false });

    if (lData) setLogs(lData);
    setLoading(false);
  };

  useEffect(() => {
    fetchTrackingData();

    // Real-time tracking subscription
    const channel = supabase
      .channel(`tracking-${orderId}`)
      .on(
        "postgres_changes", 
        { event: "INSERT", schema: "public", table: "delivery_logs", filter: `order_id=eq.${orderId}` },
        () => fetchTrackingData()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold">Order Not Found</h2>
        <p className="text-muted-foreground mt-2">The tracking link might be invalid or expired.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-8">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tracking: {order.order_number}</h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <Clock className="h-4 w-4" /> Ordered on {format(new Date(order.created_at), "MMM d, yyyy")}
          </p>
        </div>
        <div className="text-left md:text-right">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Current Status</p>
          <div className="text-xl font-bold text-primary capitalize mt-1 flex items-center md:justify-end gap-2">
            {order.status === 'Delivered' ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <Truck className="h-5 w-5" />}
            {order.status}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          
          <DeliveryMap 
            coordinates={[13.0827, 80.2707]} // Placeholder coordinates (Chennai)
            status={order.status} 
          />

          <div className="rounded-xl border bg-card p-6">
            <h3 className="font-semibold text-lg mb-6">Delivery Timeline</h3>
            <div className="space-y-6">
              {logs.length === 0 ? (
                <p className="text-muted-foreground text-sm">No tracking updates yet.</p>
              ) : (
                logs.map((log, index) => (
                  <div key={log.id} className="relative pl-8">
                    {/* Timeline Line */}
                    {index !== logs.length - 1 && (
                      <div className="absolute left-2.5 top-8 bottom-[-24px] w-0.5 bg-border"></div>
                    )}
                    {/* Timeline Dot */}
                    <div className={`absolute left-0 top-1.5 h-5 w-5 rounded-full border-2 bg-background flex items-center justify-center ${index === 0 ? 'border-primary' : 'border-muted-foreground'}`}>
                      <div className={`h-2 w-2 rounded-full ${index === 0 ? 'bg-primary' : 'bg-muted-foreground'}`}></div>
                    </div>
                    
                    <div>
                      <p className={`font-medium capitalize ${index === 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {log.status}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(log.created_at), "MMM d, h:mm a")}
                      </p>
                      {log.note && (
                        <div className="mt-2 text-sm bg-muted/50 p-3 rounded-md text-foreground">
                          {log.note}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="rounded-xl border bg-card p-5 space-y-4 shadow-sm">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Expected Delivery</h3>
            <div className="text-xl font-bold">
              {order.expected_delivery_date ? format(new Date(order.expected_delivery_date), "EEEE, MMM d") : 'To be assigned'}
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5 space-y-4 shadow-sm">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Delivery Partner</h3>
            {order.delivery_partners ? (
              <div>
                <p className="font-medium text-lg">{order.delivery_partners.name}</p>
                <p className="text-sm text-muted-foreground mt-1">Contact: {order.delivery_partners.mobile}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">Partner not yet assigned to this shipment.</p>
            )}
          </div>

          <div className="rounded-xl border bg-card p-5 space-y-4 shadow-sm">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Shipping Address</h3>
            {order.addresses ? (
              <div className="text-sm leading-relaxed">
                <p className="font-medium">{order.addresses.address}</p>
                <p>{order.addresses.city}, {order.addresses.state}</p>
                <p>PIN: {order.addresses.pincode}</p>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">Address hidden.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
