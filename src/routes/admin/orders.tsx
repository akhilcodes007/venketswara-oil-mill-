import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Package,
  Clock,
  CheckCircle,
  XCircle,
  IndianRupee,
  Search,
  Eye,
  Loader2,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrderDetailsModal, type OrderView } from "@/components/admin/OrderDetailsModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, subDays, startOfDay, endOfDay } from "date-fns";

export const Route = createFileRoute("/admin/orders")({
  component: AdminOrders,
});

function AdminOrders() {
  const [metrics, setMetrics] = useState<any>(null);
  const [orders, setOrders] = useState<OrderView[]>([]);
  const [loading, setLoading] = useState(true);
  const [partners, setPartners] = useState<{ id: string; name: string }[]>([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 15;

  const [selectedOrder, setSelectedOrder] = useState<OrderView | null>(null);

  const fetchMetrics = async () => {
    const { data, error } = await supabase.rpc("get_orders_dashboard_metrics_v2");
    if (!error && data) {
      setMetrics(data);
    }
  };

  const fetchPartners = async () => {
    const { data } = await supabase.from("delivery_partners").select("id, name").eq("is_active", true);
    if (data) setPartners(data);
  };

  const fetchOrders = async (resetPage = false) => {
    if (resetPage) {
      setPage(0);
      setLoading(true);
    }
    
    let query = supabase
      .from("admin_orders_view")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (search.trim()) {
      query = query.or(`order_number.ilike.%${search}%,customer_name.ilike.%${search}%`);
    }
    if (statusFilter !== "all") {
      query = query.eq("order_status", statusFilter);
    }
    if (dateRange !== "all") {
      const now = new Date();
      if (dateRange === "today") {
        query = query.gte("created_at", startOfDay(now).toISOString());
      } else if (dateRange === "7d") {
        query = query.gte("created_at", subDays(now, 7).toISOString());
      } else if (dateRange === "30d") {
        query = query.gte("created_at", subDays(now, 30).toISOString());
      }
    }

    const from = (resetPage ? 0 : page) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;
    if (error) {
      toast.error("Failed to load orders");
      console.error(error);
    } else {
      if (resetPage) {
        setOrders(data as OrderView[]);
      } else {
        setOrders(prev => [...prev, ...(data as OrderView[])]);
      }
      setHasMore(count !== null && (from + (data?.length || 0)) < count);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMetrics();
    fetchPartners();
    fetchOrders(true);

    const sub = supabase
      .channel("admin-orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "new_orders" }, () => {
        toast.info("Orders updated. Refreshing data...");
        fetchMetrics();
        fetchOrders(true);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(sub);
    };
  }, []);

  useEffect(() => {
    // Only re-fetch if not initial load
    if (loading) return; 
    const timer = setTimeout(() => {
      fetchOrders(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [search, statusFilter, dateRange]);

  const loadMore = () => {
    setPage(p => p + 1);
  };

  useEffect(() => {
    if (page > 0) fetchOrders(false);
  }, [page]);

  const handleUpdateStatus = async (orderId: string, status: string, partnerId?: string) => {
    const { error } = await supabase.rpc("update_delivery_status", {
      p_order_id: orderId,
      p_status: status,
      p_partner_id: partnerId || null
    });
    if (error) throw error;
    
    // Optimistic update of modal and list
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, order_status: status, delivery_partner_id: partnerId || o.delivery_partner_id } : o));
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, order_status: status, delivery_partner_id: partnerId || prev.delivery_partner_id } : null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Orders Management</h1>
        <p className="text-muted-foreground">Manage customer orders and fulfillment in real-time.</p>
      </div>

      {/* KPI Dashboard */}
      {metrics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card 
            title="Total Revenue" 
            value={`₹${metrics.totalRevenue.toLocaleString()}`} 
            subtitle={`Today: ₹${metrics.todayRevenue.toLocaleString()}`}
            icon={<IndianRupee className="h-4 w-4 text-emerald-500" />} 
          />
          <Card 
            title="Pending Orders" 
            value={metrics.pendingOrders} 
            subtitle="Awaiting processing"
            icon={<Clock className="h-4 w-4 text-orange-500" />} 
          />
          <Card 
            title="Processing & Shipped" 
            value={metrics.processingOrders} 
            subtitle="Active fulfillments"
            icon={<Package className="h-4 w-4 text-blue-500" />} 
          />
          <Card 
            title="Delivered Orders" 
            value={metrics.deliveredOrders} 
            subtitle={`Total Orders: ${metrics.totalOrders}`}
            icon={<CheckCircle className="h-4 w-4 text-green-500" />} 
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search order # or customer..."
              className="pl-9"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="Order Confirmed">Confirmed</SelectItem>
              <SelectItem value="Packed">Packed</SelectItem>
              <SelectItem value="Out for Delivery">Out for Delivery</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Order Number</th>
                <th className="px-4 py-3 font-medium">Customer</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Payment</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium text-right">Total</th>
                <th className="px-4 py-3 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">#{o.order_number}</td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{o.customer_name}</div>
                    <div className="text-xs text-muted-foreground">{o.customer_mobile}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {format(new Date(o.created_at), "MMM d, yyyy")}
                  </td>
                  <td className="px-4 py-3">
                    <div className="uppercase text-xs font-semibold">{o.payment_method}</div>
                    <Badge variant={o.payment_status === "paid" ? "default" : "secondary"} className="text-[10px]">
                      {o.payment_status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={
                      o.order_status === 'Delivered' ? 'border-green-500 text-green-500' :
                      o.order_status === 'Cancelled' ? 'border-red-500 text-red-500' :
                      o.order_status === 'pending' ? 'border-orange-500 text-orange-500' :
                      'border-blue-500 text-blue-500'
                    }>
                      {o.order_status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-serif font-medium text-right">
                    ₹{o.grand_total}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(o)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
              {loading && page === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </td>
                </tr>
              )}
              {!loading && orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-muted-foreground">
                    No orders found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {hasMore && !loading && (
          <div className="p-4 border-t border-border text-center">
            <Button variant="outline" onClick={loadMore}>Load More Orders</Button>
          </div>
        )}
      </div>

      <OrderDetailsModal 
        open={!!selectedOrder} 
        onOpenChange={(op) => !op && setSelectedOrder(null)}
        order={selectedOrder}
        partners={partners}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}

function Card({ title, value, subtitle, icon }: any) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon}
      </div>
      <div className="mt-4">
        <div className="text-3xl font-serif font-bold text-foreground">{value}</div>
        <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}
