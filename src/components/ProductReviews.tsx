import { useEffect, useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

type Review = {
  id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

export function ProductReviews({ productId }: { productId: string }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const { data } = await supabase
      .from("reviews")
      .select("id, user_id, rating, comment, created_at")
      .eq("product_id", productId)
      .order("created_at", { ascending: false })
      .limit(20);
    setReviews((data ?? []) as Review[]);
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [productId]);

  const avg = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;

  const myReview = user ? reviews.find((r) => r.user_id === user.id) : null;

  async function submit() {
    if (!user) return;
    if (rating < 1) {
      toast.error("Pick a star rating");
      return;
    }
    setLoading(true);
    const payload = {
      user_id: user.id,
      product_id: productId,
      rating,
      comment: comment.trim() || null,
    };
    const { error } = myReview
      ? await supabase.from("reviews").update(payload).eq("id", myReview.id)
      : await supabase.from("reviews").insert(payload);
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success(myReview ? "Review updated" : "Thanks for the review!");
    setOpen(false);
    setRating(0);
    setComment("");
    load();
  }

  return (
    <div className="mt-3 border-t border-border pt-3">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-xs text-muted-foreground hover:text-foreground"
      >
        <span className="flex items-center gap-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${
                i < Math.round(avg) ? "fill-[var(--gold)] text-[var(--gold)]" : "text-muted-foreground/40"
              }`}
            />
          ))}
          <span className="ml-1">
            {reviews.length ? `${avg.toFixed(1)} (${reviews.length})` : "No reviews yet"}
          </span>
        </span>
        <span className="underline">{open ? "Hide" : "Reviews"}</span>
      </button>

      {open && (
        <div className="mt-3 space-y-3">
          {user ? (
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="text-xs font-medium text-foreground">
                {myReview ? "Edit your review" : "Write a review"}
              </div>
              <div className="mt-2 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    aria-label={`${n} star${n > 1 ? "s" : ""}`}
                  >
                    <Star
                      className={`h-5 w-5 ${
                        n <= (rating || myReview?.rating || 0)
                          ? "fill-[var(--gold)] text-[var(--gold)]"
                          : "text-muted-foreground/40"
                      }`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value.slice(0, 500))}
                placeholder={myReview?.comment ?? "Share your experience…"}
                rows={2}
                className="mt-2 w-full rounded-md border border-input bg-background p-2 text-xs outline-none focus:border-primary"
              />
              <button
                onClick={submit}
                disabled={loading}
                className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
              >
                {loading && <Loader2 className="h-3 w-3 animate-spin" />}
                {myReview ? "Update" : "Submit"}
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="block rounded-lg border border-dashed border-border bg-muted/20 p-3 text-center text-xs text-muted-foreground hover:bg-muted/40"
            >
              Sign in to leave a review
            </Link>
          )}

          <ul className="space-y-2">
            {reviews.slice(0, 4).map((r) => (
              <li key={r.id} className="rounded-lg bg-muted/30 p-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < r.rating ? "fill-[var(--gold)] text-[var(--gold)]" : "text-muted-foreground/40"
                        }`}
                      />
                    ))}
                  </span>
                  <span className="text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </div>
                {r.comment && <p className="mt-1 text-foreground">{r.comment}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}