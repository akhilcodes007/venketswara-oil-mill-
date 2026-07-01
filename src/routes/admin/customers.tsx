import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Loader2, Users, IndianRupee, MapPin, Heart, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export const Route = createFileRoute("/admin/customers")({
  component: AdminCustomers,
});

function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 10;

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const fetchCustomers = async (searchTerm = search, pageNum = page) => {
    setLoading(true);
    const offset = (pageNum - 1) * limit;
    
    const { data, error } = await supabase.rpc("get_customers_with_metrics", {
      p_search: searchTerm,
      p_limit: limit,
      p_offset: offset
    });

    if (error) {
      toast.error("Failed to load customers: " + error.message);
    } else {
      setCustomers(data || []);
      setTotalCount(data?.[0]?.total_count || 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCustomers(search, 1);
      setPage(1);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  useEffect(() => {
    fetchCustomers(search, page);
  }, [page]);

  const openCustomerDetails = async (id: string) => {
    setIsDialogOpen(true);
    setDetailsLoading(true);
    
    const { data, error } = await supabase.rpc("get_customer_details", { p_user_id: id });
    
    if (error) {
      toast.error("Failed to load details");
      setIsDialogOpen(false);
    } else {
      setSelectedCustomer(data);
    }
    setDetailsLoading(false);
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground">Manage your customer profiles and view their lifetime value.</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name or mobile..." 
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
              <TableHead>Customer Name</TableHead>
              <TableHead>Mobile</TableHead>
              <TableHead>Total Orders</TableHead>
              <TableHead>Lifetime Value</TableHead>
              <TableHead>Joined Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  No customers found.
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        {customer.full_name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      {customer.full_name || 'Unknown'}
                    </div>
                  </TableCell>
                  <TableCell>{customer.mobile || 'N/A'}</TableCell>
                  <TableCell>{customer.total_orders}</TableCell>
                  <TableCell className="font-semibold text-green-600">₹{customer.lifetime_value}</TableCell>
                  <TableCell>{format(new Date(customer.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => openCustomerDetails(customer.id)}>
                      View Profile
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-end space-x-2 py-4 px-4 border-t">
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1 || loading}>
              Previous
            </Button>
            <div className="text-sm text-muted-foreground">Page {page} of {totalPages}</div>
            <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages || loading}>
              Next
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {detailsLoading || !selectedCustomer ? (
            <div className="h-64 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {selectedCustomer.profile.full_name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  {selectedCustomer.profile.full_name || 'Customer Profile'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div className="space-y-6">
                  {/* Analytics Summary */}
                  <div className="rounded-xl border bg-muted/20 p-5 space-y-4">
                    <h3 className="font-semibold flex items-center gap-2"><IndianRupee className="h-4 w-4 text-green-600"/> Lifetime Value</h3>
                    <div className="text-3xl font-bold text-green-600">₹{selectedCustomer.metrics.lifetime_value}</div>
                    <div className="pt-4 border-t border-border/50 grid grid-cols-2 gap-4">
                       <div>
                         <p className="text-xs text-muted-foreground">Orders</p>
                         <p className="font-semibold">{selectedCustomer.metrics.total_orders}</p>
                       </div>
                       <div>
                         <p className="text-xs text-muted-foreground">Avg. Order</p>
                         <p className="font-semibold">₹{Math.round(selectedCustomer.metrics.average_order_value)}</p>
                       </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="rounded-xl border p-5 space-y-4">
                    <h3 className="font-semibold flex items-center gap-2"><Users className="h-4 w-4"/> Contact Details</h3>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">Mobile:</span> {selectedCustomer.profile.mobile || 'N/A'}</p>
                      <p><span className="text-muted-foreground">Joined:</span> {format(new Date(selectedCustomer.profile.created_at), "MMM d, yyyy")}</p>
                    </div>
                  </div>

                  {/* Saved Addresses */}
                  <div className="rounded-xl border p-5 space-y-4">
                    <h3 className="font-semibold flex items-center gap-2"><MapPin className="h-4 w-4"/> Saved Addresses ({selectedCustomer.addresses.length})</h3>
                    <div className="space-y-3">
                      {selectedCustomer.addresses.map((a: any) => (
                        <div key={a.id} className="text-sm p-3 bg-muted/30 rounded-md">
                          <p className="font-medium">{a.name} <Badge variant="outline" className="ml-1 text-[10px]">{a.is_default ? 'Default' : 'Other'}</Badge></p>
                          <p className="text-muted-foreground mt-1">{a.address}, {a.city}, {a.state} - {a.pincode}</p>
                          <p className="text-muted-foreground mt-1 text-xs">Ph: {a.mobile}</p>
                        </div>
                      ))}
                      {selectedCustomer.addresses.length === 0 && <p className="text-sm text-muted-foreground">No saved addresses.</p>}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                  {/* Order History */}
                  <div className="rounded-xl border p-5 space-y-4">
                    <h3 className="font-semibold flex items-center gap-2"><ShoppingBag className="h-4 w-4"/> Order History</h3>
                    <div className="space-y-4">
                      {selectedCustomer.orders.map((o: any) => (
                        <div key={o.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-3 border-b pb-3">
                            <div>
                              <p className="font-medium">{o.order_number}</p>
                              <p className="text-xs text-muted-foreground">{format(new Date(o.created_at), "PPp")}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">₹{o.grand_total}</p>
                              <Badge variant="outline" className="mt-1 capitalize">{o.status}</Badge>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {o.items.map((i: any) => (
                              <div key={i.id} className="flex justify-between text-sm">
                                <span>{i.quantity}x {i.product_name}</span>
                                <span className="text-muted-foreground">₹{i.total}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      {selectedCustomer.orders.length === 0 && <p className="text-sm text-muted-foreground">No order history.</p>}
                    </div>
                  </div>

                  {/* Wishlist */}
                  <div className="rounded-xl border p-5 space-y-4">
                    <h3 className="font-semibold flex items-center gap-2"><Heart className="h-4 w-4"/> Wishlist ({selectedCustomer.wishlist.length})</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedCustomer.wishlist.map((w: any) => (
                        <div key={w.id} className="flex items-center gap-3 border rounded-lg p-3">
                          {w.product_image && <img src={w.product_image} alt={w.product_name} className="h-10 w-10 object-cover rounded" />}
                          <div>
                            <p className="text-sm font-medium line-clamp-1">{w.product_name}</p>
                            <p className="text-xs text-muted-foreground">₹{w.price}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
