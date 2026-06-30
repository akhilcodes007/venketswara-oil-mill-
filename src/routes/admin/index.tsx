import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar
} from "recharts";
import { 
  IndianRupee, ShoppingBag, Users, Package, AlertTriangle, CheckCircle2, XCircle, MessageSquare
} from "lucide-react";
import { format } from "date-fns";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [charts, setCharts] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        // Fetch metrics via RPC
        const { data: metricsData } = await supabase.rpc("get_dashboard_metrics");
        if (metricsData) setMetrics(metricsData);

        // Fetch charts via RPC
        const { data: chartsData } = await supabase.rpc("get_dashboard_charts");
        if (chartsData) setCharts(chartsData);

        // Fetch initial notifications
        const { data: notifs } = await supabase
          .from("admin_notifications")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10);
        if (notifs) setNotifications(notifs);

        setLoading(false);
      } catch (err) {
        console.error("Dashboard error:", err);
        setLoading(false);
      }
    }

    loadDashboard();

    // Subscribe to realtime notifications
    const channel = supabase
      .channel("admin-notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "admin_notifications" },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev].slice(0, 10));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading Dashboard...</div>;
  }

  const StatCard = ({ title, value, icon: Icon, subtitle, alert }: any) => (
    <div className={`rounded-xl border bg-card p-6 shadow-sm ${alert ? 'border-destructive/50 bg-destructive/5' : ''}`}>
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="tracking-tight text-sm font-medium text-muted-foreground">{title}</h3>
        <Icon className={`h-4 w-4 ${alert ? 'text-destructive' : 'text-muted-foreground'}`} />
      </div>
      <div className={`text-2xl font-bold ${alert ? 'text-destructive' : ''}`}>{value}</div>
      {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_order': return <ShoppingBag className="h-4 w-4 text-blue-500" />;
      case 'cancelled_order': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'payment_success': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'customer_message': return <MessageSquare className="h-4 w-4 text-purple-500" />;
      case 'low_stock': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">
          Monitor your store's realtime performance and alerts.
        </p>
      </div>
      
      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Total Revenue" 
          value={`₹${metrics?.totalRevenue?.toLocaleString() || 0}`} 
          icon={IndianRupee}
          subtitle={`₹${metrics?.monthlyRevenue?.toLocaleString() || 0} this month`}
        />
        <StatCard 
          title="Total Orders" 
          value={metrics?.totalOrders || 0} 
          icon={ShoppingBag}
          subtitle={`${metrics?.todayOrders || 0} orders today`}
        />
        <StatCard 
          title="Total Customers" 
          value={metrics?.customerCount || 0} 
          icon={Users}
        />
        <StatCard 
          title="Active Products" 
          value={metrics?.productCount || 0} 
          icon={Package}
          subtitle={metrics?.lowStockCount > 0 ? `${metrics.lowStockCount} items low in stock` : 'Stock levels healthy'}
          alert={metrics?.lowStockCount > 0}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        
        {/* Charts Column */}
        <div className="md:col-span-5 space-y-6">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h3 className="font-semibold mb-6">Daily Revenue (Last 7 Days)</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts?.dailySales || []}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dx={-10} tickFormatter={(val) => `₹${val}`} />
                  <RechartsTooltip 
                    formatter={(value: number) => [`₹${value}`, "Revenue"]}
                    contentStyle={{ borderRadius: '8px', border: '1px solid #eee', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} dot={{r: 4, fill: '#2563eb', strokeWidth: 0}} activeDot={{r: 6}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="font-semibold mb-6">Monthly Revenue Trend</h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts?.monthlySales || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} dy={10} />
                    <RechartsTooltip 
                      formatter={(value: number) => [`₹${value}`, "Revenue"]}
                      cursor={{fill: '#f1f5f9'}}
                    />
                    <Bar dataKey="revenue" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="font-semibold mb-6">Top Selling Products</h3>
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={charts?.productPerformance || []} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eee" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 11}} />
                    <RechartsTooltip cursor={{fill: '#f1f5f9'}} />
                    <Bar dataKey="sold" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Column */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-xl border bg-card shadow-sm h-full flex flex-col">
            <div className="p-6 border-b">
              <h3 className="font-semibold">Live Notifications</h3>
            </div>
            <div className="flex-1 overflow-auto p-2">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-muted-foreground">No recent notifications</div>
              ) : (
                <div className="space-y-1">
                  {notifications.map((notif) => (
                    <div key={notif.id} className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${!notif.is_read ? 'bg-muted/50' : 'hover:bg-muted/30'}`}>
                      <div className="mt-0.5 shrink-0">
                        {getNotificationIcon(notif.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 leading-snug">{notif.message}</p>
                        <p className="text-[11px] text-muted-foreground mt-1">
                          {format(new Date(notif.created_at), "MMM d, h:mm a")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
