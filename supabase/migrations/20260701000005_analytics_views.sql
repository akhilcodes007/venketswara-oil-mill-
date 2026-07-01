-- Phase 5 Module 2: Analytics RPCs
-- These RPCs execute heavy aggregations natively in Postgres for extreme UI performance.

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS tablefunc;

-- Helper to safely calculate percentage change
CREATE OR REPLACE FUNCTION public.calc_perc_change(current_val numeric, prev_val numeric)
RETURNS numeric LANGUAGE sql IMMUTABLE AS $$
  SELECT CASE WHEN prev_val = 0 THEN 0 ELSE round(((current_val - prev_val) / prev_val * 100)::numeric, 2) END;
$$;

-- 1. Dashboard KPIs (With Previous Period)
CREATE OR REPLACE FUNCTION public.get_dashboard_kpis(p_start timestamp, p_end timestamp)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_prev_start timestamp := p_start - (p_end - p_start);
  v_prev_end timestamp := p_start;
  v_current jsonb;
  v_previous jsonb;
BEGIN
  -- Current Period
  SELECT jsonb_build_object(
    'revenue', coalesce(sum(grand_total), 0),
    'orders', count(id),
    'customers', count(distinct user_id),
    'delivered', count(id) FILTER (WHERE status = 'delivered'),
    'pending', count(id) FILTER (WHERE status = 'pending'),
    'cancelled', count(id) FILTER (WHERE status = 'cancelled'),
    'aov', case when count(id) > 0 then coalesce(sum(grand_total)/count(id), 0) else 0 end
  ) INTO v_current FROM public.new_orders WHERE created_at >= p_start AND created_at <= p_end AND status != 'cancelled';
  
  -- Previous Period
  SELECT jsonb_build_object(
    'revenue', coalesce(sum(grand_total), 0),
    'orders', count(id),
    'customers', count(distinct user_id),
    'aov', case when count(id) > 0 then coalesce(sum(grand_total)/count(id), 0) else 0 end
  ) INTO v_previous FROM public.new_orders WHERE created_at >= v_prev_start AND created_at < v_prev_end AND status != 'cancelled';

  RETURN jsonb_build_object(
    'current', v_current,
    'previous', v_previous,
    'global', jsonb_build_object(
      'total_products', (SELECT count(id) FROM public.products),
      'total_categories', (SELECT count(id) FROM public.categories),
      'total_reviews', (SELECT count(id) FROM public.reviews),
      'average_rating', (SELECT coalesce(avg(rating), 0) FROM public.reviews WHERE approved=true),
      'active_delivery_partners', (SELECT count(id) FROM public.delivery_partners WHERE is_active=true),
      'today_revenue', (SELECT coalesce(sum(grand_total), 0) FROM public.new_orders WHERE created_at >= current_date AND status != 'cancelled'),
      'monthly_revenue', (SELECT coalesce(sum(grand_total), 0) FROM public.new_orders WHERE date_trunc('month', created_at) = date_trunc('month', current_date) AND status != 'cancelled')
    )
  );
END;
$$;

-- 2. Sales Analytics
CREATE OR REPLACE FUNCTION public.get_sales_analytics(p_start timestamp, p_end timestamp, p_grouping text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_res jsonb;
BEGIN
  WITH grouped AS (
    SELECT 
      date_trunc(p_grouping, created_at) as period,
      sum(grand_total) as revenue,
      count(id) as orders
    FROM public.new_orders
    WHERE created_at >= p_start AND created_at <= p_end AND status != 'cancelled'
    GROUP BY 1 ORDER BY 1
  )
  SELECT jsonb_agg(jsonb_build_object(
    'period', period,
    'revenue', coalesce(revenue, 0),
    'orders', coalesce(orders, 0)
  )) INTO v_res FROM grouped;
  
  RETURN coalesce(v_res, '[]'::jsonb);
END;
$$;

-- 3. Product Analytics
CREATE OR REPLACE FUNCTION public.get_product_analytics(p_start timestamp, p_end timestamp)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_top_selling jsonb;
  v_least_selling jsonb;
  v_highest_revenue jsonb;
BEGIN
  -- Top Selling (Quantity)
  SELECT jsonb_agg(row_to_json(t)) INTO v_top_selling FROM (
    SELECT p.name, sum(oi.quantity) as qty FROM public.order_items oi JOIN public.new_orders o ON o.id=oi.order_id JOIN public.products p ON p.id=oi.product_id WHERE o.created_at >= p_start AND o.created_at <= p_end AND o.status != 'cancelled' GROUP BY p.id, p.name ORDER BY qty DESC LIMIT 5
  ) t;
  
  -- Least Selling
  SELECT jsonb_agg(row_to_json(t)) INTO v_least_selling FROM (
    SELECT p.name, coalesce(sum(oi.quantity), 0) as qty FROM public.products p LEFT JOIN public.order_items oi ON p.id=oi.product_id LEFT JOIN public.new_orders o ON o.id=oi.order_id AND o.created_at >= p_start AND o.created_at <= p_end AND o.status != 'cancelled' GROUP BY p.id, p.name ORDER BY qty ASC LIMIT 5
  ) t;
  
  -- Highest Revenue
  SELECT jsonb_agg(row_to_json(t)) INTO v_highest_revenue FROM (
    SELECT p.name, sum(oi.total) as revenue FROM public.order_items oi JOIN public.new_orders o ON o.id=oi.order_id JOIN public.products p ON p.id=oi.product_id WHERE o.created_at >= p_start AND o.created_at <= p_end AND o.status != 'cancelled' GROUP BY p.id, p.name ORDER BY revenue DESC LIMIT 5
  ) t;

  RETURN jsonb_build_object(
    'top_selling', coalesce(v_top_selling, '[]'::jsonb),
    'least_selling', coalesce(v_least_selling, '[]'::jsonb),
    'highest_revenue', coalesce(v_highest_revenue, '[]'::jsonb),
    'most_wishlisted', (SELECT coalesce(jsonb_agg(row_to_json(w)), '[]'::jsonb) FROM (SELECT p.name, count(w.id) as count FROM public.wishlist w JOIN public.products p ON p.id=w.product_id GROUP BY p.id, p.name ORDER BY count DESC LIMIT 5) w),
    'highest_rated', (SELECT coalesce(jsonb_agg(row_to_json(r)), '[]'::jsonb) FROM (SELECT p.name, round(avg(r.rating)::numeric, 1) as avg_rating, count(r.id) as count FROM public.reviews r JOIN public.products p ON p.id=r.product_id WHERE r.approved=true GROUP BY p.id, p.name HAVING count(r.id) > 1 ORDER BY avg_rating DESC, count DESC LIMIT 5) r)
  );
END;
$$;

-- 4. Category Analytics
CREATE OR REPLACE FUNCTION public.get_category_analytics(p_start timestamp, p_end timestamp)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_res jsonb;
BEGIN
  WITH cat_stats AS (
    SELECT c.name, sum(oi.quantity) as qty, sum(oi.total) as revenue
    FROM public.order_items oi 
    JOIN public.new_orders o ON o.id=oi.order_id
    JOIN public.products p ON p.id=oi.product_id
    JOIN public.categories c ON c.id=p.category_id
    WHERE o.created_at >= p_start AND o.created_at <= p_end AND o.status != 'cancelled'
    GROUP BY c.id, c.name
  )
  SELECT jsonb_agg(row_to_json(t)) INTO v_res FROM (SELECT * FROM cat_stats ORDER BY revenue DESC) t;
  RETURN coalesce(v_res, '[]'::jsonb);
END;
$$;

-- 5. GST Analytics
CREATE OR REPLACE FUNCTION public.get_gst_analytics(p_start timestamp, p_end timestamp)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_total numeric;
  v_monthly jsonb;
BEGIN
  SELECT coalesce(sum(gst_total), 0) INTO v_total FROM public.new_orders WHERE created_at >= p_start AND created_at <= p_end AND status != 'cancelled';
  
  WITH monthly AS (
    SELECT date_trunc('month', created_at) as month, sum(gst_total) as gst
    FROM public.new_orders WHERE created_at >= p_start AND created_at <= p_end AND status != 'cancelled'
    GROUP BY 1 ORDER BY 1
  )
  SELECT jsonb_agg(row_to_json(m)) INTO v_monthly FROM monthly m;
  
  RETURN jsonb_build_object('total_gst', v_total, 'monthly', coalesce(v_monthly, '[]'::jsonb));
END;
$$;

-- 6. Inventory Analytics
CREATE OR REPLACE FUNCTION public.get_inventory_analytics()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN jsonb_build_object(
    'total_stock_value', (SELECT coalesce(sum(stock * price), 0) FROM public.products),
    'total_items_stock', (SELECT coalesce(sum(stock), 0) FROM public.products),
    'low_stock', (SELECT coalesce(jsonb_agg(row_to_json(p)), '[]'::jsonb) FROM (SELECT id, name, stock FROM public.products WHERE stock > 0 AND stock <= 10 ORDER BY stock ASC) p),
    'out_of_stock', (SELECT coalesce(jsonb_agg(row_to_json(p)), '[]'::jsonb) FROM (SELECT id, name, stock FROM public.products WHERE stock = 0) p)
  );
END;
$$;

-- 7. Customer Analytics
CREATE OR REPLACE FUNCTION public.get_customer_analytics(p_start timestamp, p_end timestamp)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_new int;
  v_returning int;
  v_top_spenders jsonb;
BEGIN
  -- New vs Returning logic (simplified for date range):
  SELECT count(*) INTO v_new FROM public.profiles WHERE created_at >= p_start AND created_at <= p_end;
  SELECT count(distinct user_id) INTO v_returning FROM public.new_orders WHERE created_at >= p_start AND created_at <= p_end AND user_id IN (SELECT user_id FROM public.new_orders GROUP BY user_id HAVING count(*) > 1);
  
  SELECT jsonb_agg(row_to_json(t)) INTO v_top_spenders FROM (
    SELECT p.full_name as name, sum(o.grand_total) as spent, count(o.id) as orders
    FROM public.new_orders o JOIN public.profiles p ON p.id=o.user_id
    WHERE o.created_at >= p_start AND o.created_at <= p_end AND o.status != 'cancelled'
    GROUP BY p.id, p.full_name ORDER BY spent DESC LIMIT 10
  ) t;

  RETURN jsonb_build_object(
    'new_customers', v_new,
    'returning_customers', v_returning,
    'top_spenders', coalesce(v_top_spenders, '[]'::jsonb),
    'repeat_purchase_rate', CASE WHEN (v_new + v_returning) > 0 THEN round((v_returning::numeric / (v_new + v_returning)::numeric)*100, 2) ELSE 0 END
  );
END;
$$;

-- 8. Order Analytics
CREATE OR REPLACE FUNCTION public.get_order_analytics(p_start timestamp, p_end timestamp)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_status_dist jsonb;
BEGIN
  SELECT jsonb_agg(row_to_json(t)) INTO v_status_dist FROM (
    SELECT status, count(id) as count FROM public.new_orders WHERE created_at >= p_start AND created_at <= p_end GROUP BY status
  ) t;
  
  RETURN jsonb_build_object(
    'status_distribution', coalesce(v_status_dist, '[]'::jsonb)
  );
END;
$$;

-- 9. Delivery Analytics
CREATE OR REPLACE FUNCTION public.get_delivery_analytics(p_start timestamp, p_end timestamp)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_partners jsonb;
BEGIN
  SELECT jsonb_agg(row_to_json(t)) INTO v_partners FROM (
    SELECT 
      dp.name, 
      count(o.id) as total_assigned,
      count(o.id) FILTER (WHERE o.status = 'delivered') as total_delivered
    FROM public.delivery_logs dl
    JOIN public.delivery_partners dp ON dp.id=dl.partner_id
    JOIN public.new_orders o ON o.id=dl.order_id
    WHERE dl.created_at >= p_start AND dl.created_at <= p_end
    GROUP BY dp.id, dp.name
  ) t;
  
  RETURN jsonb_build_object(
    'partner_performance', coalesce(v_partners, '[]'::jsonb)
  );
END;
$$;

-- 10. Review Analytics
CREATE OR REPLACE FUNCTION public.get_review_analytics(p_start timestamp, p_end timestamp)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_dist jsonb;
BEGIN
  SELECT jsonb_agg(row_to_json(t)) INTO v_dist FROM (
    SELECT rating, count(*) as count FROM public.reviews WHERE created_at >= p_start AND created_at <= p_end GROUP BY rating ORDER BY rating DESC
  ) t;
  
  RETURN jsonb_build_object(
    'average_rating', (SELECT coalesce(round(avg(rating)::numeric, 1), 0) FROM public.reviews WHERE created_at >= p_start AND created_at <= p_end AND approved=true),
    'total_reviews', (SELECT count(*) FROM public.reviews WHERE created_at >= p_start AND created_at <= p_end),
    'pending_reviews', (SELECT count(*) FROM public.reviews WHERE created_at >= p_start AND created_at <= p_end AND (approved=false OR approved IS NULL)),
    'approved_reviews', (SELECT count(*) FROM public.reviews WHERE created_at >= p_start AND created_at <= p_end AND approved=true),
    'distribution', coalesce(v_dist, '[]'::jsonb)
  );
END;
$$;
