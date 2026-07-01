-- Migration for Phase 4 Module 1: Reviews & Ratings (Upgrading Existing Schema)

-- 1. Upgrade existing reviews table
ALTER TABLE IF EXISTS public.reviews 
  ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  ADD COLUMN IF NOT EXISTS helpful_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS title text;

-- Add unique constraint if missing
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'reviews_product_id_customer_id_key'
    ) THEN
        ALTER TABLE public.reviews ADD CONSTRAINT reviews_product_id_customer_id_key UNIQUE (product_id, customer_id);
    END IF;
END $$;

-- 2. Create Helpful Votes Tracking Table
CREATE TABLE IF NOT EXISTS public.review_helpful_votes (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  review_id uuid REFERENCES public.reviews(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(review_id, customer_id)
);

-- 3. Enable RLS
ALTER TABLE IF EXISTS public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.review_helpful_votes ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for reviews
DROP POLICY IF EXISTS "Public can view approved reviews" ON public.reviews;
CREATE POLICY "Public can view approved reviews" ON public.reviews
FOR SELECT
USING (approved = true OR auth.uid() = customer_id);

DROP POLICY IF EXISTS "Users can insert their own reviews" ON public.reviews;
CREATE POLICY "Users can insert their own reviews" ON public.reviews
FOR INSERT
WITH CHECK (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;
CREATE POLICY "Users can update their own reviews" ON public.reviews
FOR UPDATE
USING (auth.uid() = customer_id)
WITH CHECK (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Users can delete their own reviews" ON public.reviews;
CREATE POLICY "Users can delete their own reviews" ON public.reviews
FOR DELETE
USING (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Admins can manage all reviews" ON public.reviews;
CREATE POLICY "Admins can manage all reviews" ON public.reviews
FOR ALL
USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- 5. RLS Policies for review_helpful_votes
DROP POLICY IF EXISTS "Public can view helpful votes" ON public.review_helpful_votes;
CREATE POLICY "Public can view helpful votes" ON public.review_helpful_votes
FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can insert own helpful vote" ON public.review_helpful_votes;
CREATE POLICY "Users can insert own helpful vote" ON public.review_helpful_votes
FOR INSERT
WITH CHECK (auth.uid() = customer_id);

DROP POLICY IF EXISTS "Users can delete own helpful vote" ON public.review_helpful_votes;
CREATE POLICY "Users can delete own helpful vote" ON public.review_helpful_votes
FOR DELETE
USING (auth.uid() = customer_id);

-- 6. RPC: submit_review
CREATE OR REPLACE FUNCTION public.submit_review(
  p_product_id uuid,
  p_rating integer,
  p_title text,
  p_review text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_customer_id uuid;
  v_is_verified boolean := false;
  v_review_id uuid;
BEGIN
  v_customer_id := auth.uid();
  IF v_customer_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Check for verified purchase (only 'Delivered' orders count)
  SELECT EXISTS (
    SELECT 1 FROM public.new_orders o
    JOIN public.order_items oi ON o.id = oi.order_id
    WHERE o.user_id = v_customer_id
      AND oi.product_id = p_product_id
      AND o.status = 'Delivered'
  ) INTO v_is_verified;

  -- Insert or Update review (Upsert)
  INSERT INTO public.reviews (
    product_id, customer_id, rating, title, review, verified_purchase, approved, updated_at
  )
  VALUES (
    p_product_id, v_customer_id, p_rating, p_title, p_review, v_is_verified, false, timezone('utc'::text, now())
  )
  ON CONFLICT (product_id, customer_id)
  DO UPDATE SET
    rating = EXCLUDED.rating,
    title = EXCLUDED.title,
    review = EXCLUDED.review,
    verified_purchase = EXCLUDED.verified_purchase,
    approved = false, -- resets to pending on edit
    updated_at = timezone('utc'::text, now())
  RETURNING id INTO v_review_id;

  RETURN v_review_id;
END;
$$;

-- 7. RPC: toggle_helpful_vote
CREATE OR REPLACE FUNCTION public.toggle_helpful_vote(p_review_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_customer_id uuid;
  v_exists boolean;
  v_new_count integer;
BEGIN
  v_customer_id := auth.uid();
  IF v_customer_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  SELECT EXISTS(SELECT 1 FROM public.review_helpful_votes WHERE review_id = p_review_id AND customer_id = v_customer_id) INTO v_exists;

  IF v_exists THEN
    -- Remove vote
    DELETE FROM public.review_helpful_votes WHERE review_id = p_review_id AND customer_id = v_customer_id;
    UPDATE public.reviews SET helpful_count = helpful_count - 1 WHERE id = p_review_id RETURNING helpful_count INTO v_new_count;
    RETURN json_build_object('status', 'removed', 'helpful_count', v_new_count);
  ELSE
    -- Add vote
    INSERT INTO public.review_helpful_votes (review_id, customer_id) VALUES (p_review_id, v_customer_id);
    UPDATE public.reviews SET helpful_count = helpful_count + 1 WHERE id = p_review_id RETURNING helpful_count INTO v_new_count;
    RETURN json_build_object('status', 'added', 'helpful_count', v_new_count);
  END IF;
END;
$$;

-- 8. RPC: get_product_reviews_summary
CREATE OR REPLACE FUNCTION public.get_product_reviews_summary(p_product_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total_reviews integer;
  v_avg_rating numeric;
  v_rating_distribution json;
BEGIN
  -- Total approved reviews
  SELECT COUNT(*) INTO v_total_reviews
  FROM public.reviews
  WHERE product_id = p_product_id AND approved = true;

  IF v_total_reviews = 0 THEN
    RETURN json_build_object(
      'totalReviews', 0,
      'averageRating', 0,
      'distribution', json_build_object('1', 0, '2', 0, '3', 0, '4', 0, '5', 0)
    );
  END IF;

  -- Average rating
  SELECT ROUND(AVG(rating)::numeric, 1) INTO v_avg_rating
  FROM public.reviews
  WHERE product_id = p_product_id AND approved = true;

  -- Rating distribution
  SELECT json_object_agg(r.rating, COALESCE(c.count, 0)) INTO v_rating_distribution
  FROM (VALUES (1),(2),(3),(4),(5)) AS r(rating)
  LEFT JOIN (
    SELECT rating, COUNT(*) as count
    FROM public.reviews
    WHERE product_id = p_product_id AND approved = true
    GROUP BY rating
  ) c ON r.rating = c.rating;

  RETURN json_build_object(
    'totalReviews', v_total_reviews,
    'averageRating', v_avg_rating,
    'distribution', v_rating_distribution
  );
END;
$$;
