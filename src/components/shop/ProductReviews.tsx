import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, CheckCircle, ThumbsUp, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { WriteReviewModal } from "./WriteReviewModal";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

interface ProductReviewsProps {
  productId: string;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [summary, setSummary] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const limit = 5;

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    fetchSummary();
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [productId, sortBy, page]);

  const fetchSummary = async () => {
    const { data, error } = await supabase.rpc("get_product_reviews_summary", { p_product_id: productId });
    if (!error && data) {
      setSummary(data);
    }
  };

  const fetchReviews = async () => {
    setLoading(true);
    let query = supabase
      .from("reviews")
      .select("*, profiles!reviews_customer_id_fkey(full_name)")
      .eq("product_id", productId)
      .eq("approved", true);

    switch (sortBy) {
      case "newest":
        query = query.order("created_at", { ascending: false });
        break;
      case "highest":
        query = query.order("rating", { ascending: false }).order("created_at", { ascending: false });
        break;
      case "lowest":
        query = query.order("rating", { ascending: true }).order("created_at", { ascending: false });
        break;
      case "helpful":
        query = query.order("helpful_count", { ascending: false }).order("created_at", { ascending: false });
        break;
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error } = await query;
    if (!error) {
      setReviews(data || []);
    }
    setLoading(false);
  };

  const handleHelpfulVote = async (reviewId: string) => {
    if (!session) {
      toast.error("Please login to vote");
      return;
    }
    
    const { data, error } = await supabase.rpc("toggle_helpful_vote", { p_review_id: reviewId });
    if (error) {
      toast.error(error.message);
    } else {
      const result = data as any;
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, helpful_count: result.helpful_count } : r));
    }
  };

  const deleteOwnReview = async (reviewId: string) => {
    if (!confirm("Delete your review?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", reviewId);
    if (!error) {
      toast.success("Review deleted");
      fetchSummary();
      fetchReviews();
    } else {
      toast.error(error.message);
    }
  };

  if (!summary) return <div className="py-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  const totalReviews = summary.totalReviews || 0;
  const avgRating = summary.averageRating || 0;
  const distribution = summary.distribution || { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };
  const totalPages = Math.ceil(totalReviews / limit);

  return (
    <div className="py-12 max-w-5xl mx-auto px-4 lg:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-border pb-4">
        <h2 className="text-3xl font-serif font-bold text-foreground">Customer Reviews</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">Sort by:</span>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px] bg-card">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="highest">Highest Rating</SelectItem>
              <SelectItem value="lowest">Lowest Rating</SelectItem>
              <SelectItem value="helpful">Most Helpful</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-10 rounded-2xl bg-[var(--cream)] border border-border p-6 md:p-8 shadow-sm">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left: Summary Stats */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-3">
            <span className="text-6xl font-bold font-serif text-foreground">{avgRating.toFixed(1)}</span>
            <div className="flex text-[var(--gold)]">
              {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} className={`h-6 w-6 ${star <= Math.round(avgRating) ? 'fill-current' : 'text-gray-300'}`} />
              ))}
            </div>
            <p className="text-muted-foreground font-medium">Based on {totalReviews} reviews</p>
          </div>
          
          {/* Right: Distribution */}
          <div className="space-y-2.5">
            {[5, 4, 3, 2, 1].map(star => {
              const count = distribution[star.toString()] || 0;
              const percent = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-3 text-sm">
                  <span className="w-12 font-medium text-foreground">{star} stars</span>
                  <div className="flex-1 h-2.5 bg-white/50 border border-border/50 rounded-full overflow-hidden relative">
                    <div className="absolute top-0 left-0 h-full bg-[var(--gold)] rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                  </div>
                  <span className="w-8 text-right text-muted-foreground">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/50 flex justify-center md:justify-start">
          <Button 
            size="lg"
            className="md:w-auto px-8"
            onClick={() => {
              if (!session) toast.error("Please login to write a review");
              else setIsModalOpen(true);
            }}
          >
            Write a Review
          </Button>
        </div>
      </div>

      {/* Reviews List */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="reviews" className="border-b-0">
          <AccordionTrigger className="text-xl font-serif hover:no-underline py-0 mb-4 px-2">
            View All Reviews ({totalReviews})
          </AccordionTrigger>
          <AccordionContent className="px-2">
            <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b">
            <span className="font-medium">{totalReviews} Reviews</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="highest">Highest Rating</SelectItem>
                <SelectItem value="lowest">Lowest Rating</SelectItem>
                <SelectItem value="helpful">Most Helpful</SelectItem>
              </SelectContent>
            </Select>
          </div>

        {loading ? (
           <div className="py-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground bg-[var(--cream)] rounded-2xl border border-border">
            <h3 className="font-serif text-xl mb-2 text-foreground">No reviews yet</h3>
            <p>Be the first to share your experience with this product!</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-card rounded-2xl border border-border p-6 shadow-[var(--shadow-elegant)] transition hover:shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex text-[var(--gold)] mb-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} className={`h-4 w-4 ${star <= review.rating ? 'fill-current' : 'text-gray-300'}`} />
                      ))}
                    </div>
                    <h4 className="font-serif font-bold text-lg text-foreground">{review.title}</h4>
                  </div>
                  <span className="text-sm text-muted-foreground whitespace-nowrap bg-muted/50 px-3 py-1 rounded-full">
                    {format(new Date(review.created_at), "MMM d, yyyy")}
                  </span>
                </div>
                
                <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap mb-6">{review.review}</p>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border/50">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="font-medium text-foreground">{review.profiles?.full_name || 'Anonymous'}</span>
                    {review.verified_purchase && (
                      <span className="flex items-center text-[oklch(0.6_0.15_150)] bg-[oklch(0.95_0.05_150)] px-2 py-0.5 rounded-full text-xs font-medium border border-[oklch(0.9_0.1_150)]">
                        <CheckCircle className="h-3 w-3 mr-1.5" /> Verified Purchase
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 rounded-full text-xs"
                      onClick={() => handleHelpfulVote(review.id)}
                    >
                      <ThumbsUp className={`h-3.5 w-3.5 mr-2 ${review.helpful_count > 0 ? 'text-primary' : 'text-muted-foreground'}`} /> 
                      Helpful ({review.helpful_count})
                    </Button>

                    {session?.user?.id === review.customer_id && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 rounded-full text-xs px-3"
                        onClick={() => deleteOwnReview(review.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 pt-8 pb-4">
            <Button variant="outline" className="rounded-full" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
              Previous
            </Button>
            <span className="text-sm font-medium text-muted-foreground mx-2">Page {page} of {totalPages}</span>
            <Button variant="outline" className="rounded-full" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              Next
            </Button>
          </div>
        )}
      </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <WriteReviewModal 
        productId={productId} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          fetchSummary();
          fetchReviews();
        }}
      />
    </div>
  );
}
