-- Migration for Customer Management (Module 3)

-- 1. RPC for paginated and searchable customers with metrics
CREATE OR REPLACE FUNCTION public.get_customers_with_metrics(
  p_search text DEFAULT '',
  p_limit int DEFAULT 10,
  p_offset int DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  full_name text,
  mobile text,
  created_at timestamp with time zone,
  total_orders bigint,
  lifetime_value numeric,
  last_order_date timestamp with time zone,
  total_count bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_search_pattern text;
BEGIN
  -- Security check: only admins
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  v_search_pattern := '%' || p_search || '%';

  RETURN QUERY
  WITH filtered_profiles AS (
    SELECT p.id, p.full_name, p.mobile, p.created_at
    FROM public.profiles p
    WHERE 
      (p_search = '' OR 
       p.full_name ILIKE v_search_pattern OR 
       p.mobile ILIKE v_search_pattern)
  ),
  total_filtered AS (
    SELECT COUNT(*) as count FROM filtered_profiles
  )
  SELECT 
    fp.id,
    fp.full_name,
    fp.mobile,
    fp.created_at,
    COUNT(o.id) as total_orders,
    COALESCE(SUM(o.grand_total) FILTER (WHERE o.status != 'cancelled' AND o.status != 'pending'), 0) as lifetime_value,
    MAX(o.created_at) as last_order_date,
    (SELECT count FROM total_filtered) as total_count
  FROM filtered_profiles fp
  LEFT JOIN public.new_orders o ON o.user_id = fp.id
  GROUP BY fp.id, fp.full_name, fp.mobile, fp.created_at
  ORDER BY fp.created_at DESC
  LIMIT p_limit
  OFFSET p_offset;
END;
$$;

-- 2. RPC for full customer details
CREATE OR REPLACE FUNCTION public.get_customer_details(p_user_id uuid)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_profile json;
  v_addresses json;
  v_orders json;
  v_wishlist json;
  v_metrics json;
BEGIN
  -- Security check: only admins
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  -- Profile
  SELECT row_to_json(p) INTO v_profile
  FROM public.profiles p
  WHERE p.id = p_user_id;

  IF v_profile IS NULL THEN
    RETURN NULL;
  END IF;

  -- Addresses
  SELECT json_agg(row_to_json(a)) INTO v_addresses
  FROM public.addresses a
  WHERE a.user_id = p_user_id;

  -- Orders (including items and payments)
  SELECT json_agg(
    json_build_object(
      'id', o.id,
      'order_number', o.order_number,
      'status', o.status,
      'grand_total', o.grand_total,
      'created_at', o.created_at,
      'items', (
        SELECT json_agg(row_to_json(oi))
        FROM public.order_items oi
        WHERE oi.order_id = o.id
      ),
      'payments', (
        SELECT json_agg(row_to_json(py))
        FROM public.payments py
        WHERE py.order_id = o.id
      )
    )
  ) INTO v_orders
  FROM public.new_orders o
  WHERE o.user_id = p_user_id
  ORDER BY o.created_at DESC;

  -- Wishlist
  SELECT json_agg(
    json_build_object(
      'id', w.id,
      'product_id', w.product_id,
      'product_name', pr.name,
      'product_image', pr.images[1],
      'price', pr.price,
      'added_at', w.created_at
    )
  ) INTO v_wishlist
  FROM public.wishlist w
  JOIN public.products pr ON w.product_id = pr.id
  WHERE w.user_id = p_user_id;

  -- Metrics
  SELECT json_build_object(
    'total_orders', COUNT(o.id),
    'lifetime_value', COALESCE(SUM(o.grand_total) FILTER (WHERE o.status != 'cancelled' AND o.status != 'pending'), 0),
    'average_order_value', COALESCE(AVG(o.grand_total) FILTER (WHERE o.status != 'cancelled' AND o.status != 'pending'), 0)
  ) INTO v_metrics
  FROM public.new_orders o
  WHERE o.user_id = p_user_id;

  RETURN json_build_object(
    'profile', v_profile,
    'addresses', COALESCE(v_addresses, '[]'::json),
    'orders', COALESCE(v_orders, '[]'::json),
    'wishlist', COALESCE(v_wishlist, '[]'::json),
    'metrics', v_metrics
  );
END;
$$;
