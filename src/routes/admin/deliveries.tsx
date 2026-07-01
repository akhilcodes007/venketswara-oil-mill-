import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Search, Loader2, Truck, PackageCheck, AlertCircle, Clock, MapPin, ClipboardList, Send } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export const Route = createFileRoute("/admin/deliveries")({
  component: AdminDeliveries,
});

const STATUS_OPTIONS = [
  'Order Confirmed',
  'Packed',
  'Ready for Dispatch',
  'Assigned to Delivery Partner',
  'Out for Delivery',
  'Delivered',
  'Delivery Failed',
  'Returned',
  'Cancelled'
];

function AdminDeliveries() {
  const [metrics, setMetrics] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  
  const [newStatus, setNewStatus] = useState("");
  const [newPartner, setNewPartner] = useState("");
  const [newNote, setNewNote] = useState("");
  const [updating, setUpdating] = useState(false);

  const fetchDashboard = async () => {
    setLoading(true);
    // Fetch Metrics
    const { data: mData } = await supabase.rpc("get_delivery_metrics");
    if (mData) setMetrics(mData);

    // Fetch Partners
    const { data: pData } = await supabase.from("delivery_partners").select("*").eq("is_active", true);
    if (pData) setPartners(pData);

    // Fetch Orders needing delivery attention
    const { data: oData, error } = await supabase
      .from("new_orders")
      .select(`
        id, order_number, status, grand_total, created_at, expected_delivery_date,
        delivery_partners ( id, name, mobile ),
        profiles ( full_name, mobile ),
        addresses ( address, city, state, pincode )
      `)
      .neq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(50);
      
    if (oData) {
      setOrders(oData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboard();
    
    // Listen for realtime log updates
    const channel = supabase
      .channel("delivery-logs-admin")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "delivery_logs" }, () => {
        fetchDashboard(); // Refresh on new log
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const openUpdateDialog = (order: any) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setNewPartner(order.delivery_partners?.id || "unassigned");
    setNewNote("");
    setIsDialogOpen(true);
  };

  const handleUpdateDelivery = async () => {
    if (!selectedOrder) return;
    setUpdating(true);
    
    const partnerId = newPartner === "unassigned" ? null : newPartner;
    
    const { error } = await supabase.rpc("update_delivery_status", {
      p_order_id: selectedOrder.id,
      p_status: newStatus,
      p_note: newNote || null,
      p_partner_id: partnerId
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Delivery status updated successfully!");
      setIsDialogOpen(false);
      fetchDashboard();
    }
    setUpdating(false);
  };

  const StatCard = ({ title, value, icon: Icon, alert }: any) => (
    <div className={`rounded-xl border bg-card p-5 shadow-sm ${alert ? 'border-amber-500/50 bg-amber-500/5' : ''}`}>
      <div className="flex flex-row items-center justify-between pb-2">
        <h3 className="tracking-tight text-sm font-medium text-muted-foreground">{title}</h3>
        <Icon className={`h-4 w-4 ${alert ? 'text-amber-500' : 'text-muted-foreground'}`} />
      </div>
      <div className={`text-2xl font-bold ${alert ? 'text-amber-600' : ''}`}>{value || 0}</div>
    </div>
  );

  const filteredOrders = orders.filter(o => 
    o.order_number?.toLowerCase().includes(search.toLowerCase()) || 
    o.profiles?.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Delivery Management</h1>
        <p className="text-muted-foreground">Monitor dispatch, assign partners, and track shipments.</p>
      </div>
      
      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatCard title="Active Deliveries" value={metrics?.activeDeliveries} icon={Truck} />
        <StatCard title="Pending Assignment" value={metrics?.pendingAssignments} icon={Clock} alert={metrics?.pendingAssignments > 0} />
        <StatCard title="Delivered Today" value={metrics?.deliveredToday} icon={PackageCheck} />
        <StatCard title="Total Deliveries" value={metrics?.totalDeliveries} icon={ClipboardList} />
        <StatCard title="Failed Deliveries" value={metrics?.failedDeliveries} icon={AlertCircle} />
        <StatCard title="Returned Orders" value={metrics?.returnedOrders} icon={AlertCircle} />
      </div>

      <div className="flex items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by Order # or Customer..." 
            className="pl-9" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Info</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Partner</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expected Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="h-24 text-center"><Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" /></TableCell></TableRow>
            ) : filteredOrders.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="h-24 text-center text-muted-foreground">No deliveries found.</TableCell></TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <div className="font-medium">{order.order_number}</div>
                    <div className="text-xs text-muted-foreground">{format(new Date(order.created_at), "MMM d, h:mm a")}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm font-medium">{order.profiles?.full_name || 'N/A'}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[150px]">{order.addresses?.[0]?.city || 'N/A'}</div>
                  </TableCell>
                  <TableCell>
                    {order.delivery_partners ? (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">{order.delivery_partners.name}</Badge>
                    ) : (
                      <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">{order.status}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {order.expected_delivery_date ? format(new Date(order.expected_delivery_date), "MMM d, yyyy") : '--'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => openUpdateDialog(order)}>
                      Manage
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Delivery Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Assign Delivery Partner</label>
              <Select value={newPartner} onValueChange={setNewPartner}>
                <SelectTrigger><SelectValue placeholder="Select partner" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">-- Unassigned --</SelectItem>
                  {partners.map(p => <SelectItem key={p.id} value={p.id}>{p.name} ({p.vehicle_number})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Internal Note / Update Message</label>
              <Textarea 
                placeholder="E.g., Package handed over to driver..." 
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateDelivery} disabled={updating} className="gap-2">
              {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Update
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
