import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Star, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface WriteReviewModalProps {
  productId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function WriteReviewModal({ productId, isOpen, onClose, onSuccess }: WriteReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  useEffect(() => {
    if (isOpen) {
      loadExistingReview();
    } else {
      // Reset form on close
      setRating(0);
      setHoverRating(0);
      setTitle("");
      setReviewText("");
    }
  }, [isOpen, productId]);

  const loadExistingReview = async () => {
    setInitialLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setInitialLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("product_id", productId)
      .eq("customer_id", session.user.id)
      .maybeSingle();

    if (data) {
      setRating(data.rating);
      setTitle(data.title || "");
      setReviewText(data.review || "");
    }
    setInitialLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }
    if (!title.trim() || !reviewText.trim()) {
      toast.error("Please provide both a title and description.");
      return;
    }

    setLoading(true);
    
    // Call the RPC which handles upsert and verified purchase logic
    const { data, error } = await supabase.rpc("submit_review", {
      p_product_id: productId,
      p_rating: rating,
      p_title: title,
      p_review: reviewText
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Review submitted! It will appear once approved.");
      onSuccess();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
          <DialogDescription>
            Share your experience with this product. Honest reviews help other customers!
          </DialogDescription>
        </DialogHeader>

        {initialLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 pt-4">
            <div className="flex flex-col items-center gap-2">
              <span className="text-sm font-medium">Your Rating</span>
              <div className="flex gap-1 cursor-pointer">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-8 w-8 transition-colors ${
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Review Title</label>
                <Input 
                  placeholder="Summarize your experience..." 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Review Details</label>
                <Textarea 
                  placeholder="What did you like or dislike? How did you use this product?" 
                  className="min-h-[120px]"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  maxLength={1000}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading || rating === 0}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Review
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
