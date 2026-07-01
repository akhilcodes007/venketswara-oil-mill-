import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Search, Loader2, Star, CheckCircle, XCircle, Trash2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export const Route = createFileRoute("/admin/reviews")({
  component: AdminReviews,
});

function AdminReviews() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<any | null>(null);

  const fetchReviews = async () => {
    setLoading(true);
    let query = supabase
      .from("reviews")
      .select("*, products(name), profiles!reviews_customer_id_fkey(full_name)")
      .order("created_at", { ascending: false });

    if (statusFilter !== "all") {
      query = query.eq("approved", statusFilter === "approved");
    }

    const { data, error } = await query;
    if (error) {
      toast.error("Failed to load reviews");
    } else {
      setReviews(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, [statusFilter]);

  const updateStatus = async (id: string, newApproved: boolean) => {
    const { error } = await supabase
      .from("reviews")
      .update({ approved: newApproved, updated_at: new Date().toISOString() })
      .eq("id", id);
      
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(newApproved ? "Review Approved" : "Review Rejected/Pending");
      fetchReviews();
      if (selectedReview?.id === id) {
        setSelectedReview({ ...selectedReview, approved: newApproved });
      }
    }
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this review?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Review deleted");
      setIsViewOpen(false);
      fetchReviews();
    }
  };

  const filtered = reviews.filter(r => 
    r.title?.toLowerCase().includes(search.toLowerCase()) || 
    r.products?.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.profiles?.full_name?.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (approved: boolean) => {
    if (approved) return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-none">Approved</Badge>;
    return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-none">Pending</Badge>;
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map(star => (
          <Star key={star} className={`h-3 w-3 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reviews Moderation</h1>
          <p className="text-muted-foreground">Manage and moderate customer reviews across all products.</p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search reviews..." 
            className="pl-9" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button variant={statusFilter === 'all' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('all')}>All</Button>
          <Button variant={statusFilter === 'pending' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('pending')}>Pending</Button>
          <Button variant={statusFilter === 'approved' ? 'default' : 'outline'} size="sm" onClick={() => setStatusFilter('approved')}>Approved</Button>
        </div>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Review</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                  No reviews found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((review) => (
                <TableRow key={review.id} className={!review.approved ? 'bg-amber-50/30' : ''}>
                  <TableCell className="font-medium max-w-[150px] truncate" title={review.products?.name}>
                    {review.products?.name}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {review.profiles?.full_name || 'Unknown'}
                      {review.verified_purchase && (
                        <span title="Verified Purchase" className="flex items-center">
                          <CheckCircle className="h-3 w-3 text-blue-500" />
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {renderStars(review.rating)}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    <span className="font-semibold text-sm mr-2">{review.title}</span>
                    <span className="text-xs text-muted-foreground">{review.review}</span>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(review.approved)}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {format(new Date(review.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => { setSelectedReview(review); setIsViewOpen(true); }}>
                      View & Moderate
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
            <DialogDescription>
              Review submitted on {selectedReview && format(new Date(selectedReview.created_at), "PPP")}
            </DialogDescription>
          </DialogHeader>
          
          {selectedReview && (
            <div className="space-y-6 mt-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{selectedReview.products?.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="text-sm font-medium">{selectedReview.profiles?.full_name}</div>
                    {selectedReview.verified_purchase && (
                      <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50 text-[10px]">
                        Verified Purchase
                      </Badge>
                    )}
                  </div>
                </div>
                <div>{getStatusBadge(selectedReview.approved)}</div>
              </div>

              <div className="rounded-xl border bg-muted/20 p-5">
                <div className="flex items-center gap-2 mb-3">
                  {renderStars(selectedReview.rating)}
                  <span className="font-semibold text-sm">{selectedReview.rating}.0</span>
                </div>
                <h4 className="font-bold mb-2">{selectedReview.title}</h4>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedReview.review}</p>
                
                <div className="mt-4 pt-4 border-t flex items-center justify-between text-xs text-muted-foreground">
                  <span>Helpful votes: {selectedReview.helpful_count}</span>
                  {selectedReview.updated_at !== selectedReview.created_at && (
                    <span>Edited on {format(new Date(selectedReview.updated_at), "MMM d")}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4">
                <Button variant="outline" className="text-destructive border-destructive/30 hover:bg-destructive/10" onClick={() => deleteReview(selectedReview.id)}>
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
                
                <div className="flex gap-2">
                  {selectedReview.approved && (
                    <Button variant="outline" className="border-red-200 hover:bg-red-50 text-red-600" onClick={() => updateStatus(selectedReview.id, false)}>
                      <XCircle className="h-4 w-4 mr-2" /> Revoke Approval
                    </Button>
                  )}
                  {!selectedReview.approved && (
                    <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => updateStatus(selectedReview.id, true)}>
                      <CheckCircle className="h-4 w-4 mr-2" /> Approve
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
