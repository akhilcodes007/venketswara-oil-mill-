-- Migration for Admin Dashboard (Module 1)

-- 1. Create admin_notifications table
CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  type text NOT NULL CHECK (type IN ('new_order', 'cancelled_order', 'payment_success', 'customer_message', 'low_stock')),
  message text NOT NULL,
  reference_id uuid, -- could be order_id, product_id, etc.
  is_read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Only admins can read/update admin_notifications
CREATE POLICY "Admin notifications are viewable by admins" ON public.admin_notifications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin notifications are updatable by admins" ON public.admin_notifications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Function to get dashboard metrics
CREATE OR REPLACE FUNCTION public.get_dashboard_metrics()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total_revenue numeric;
  v_monthly_revenue numeric;
  v_total_orders integer;
  v_today_orders integer;
  v_customer_count integer;
  v_product_count integer;
  v_pending_deliveries integer;
  v_low_stock_count integer;
BEGIN
  -- Revenue (Only count completed payments or COD confirmed orders)
  SELECT COALESCE(SUM(grand_total), 0) INTO v_total_revenue 
  FROM public.new_orders 
  WHERE status != 'cancelled' AND status != 'pending';

  SELECT COALESCE(SUM(grand_total), 0) INTO v_monthly_revenue 
  FROM public.new_orders 
  WHERE status != 'cancelled' AND status != 'pending' 
  AND created_at >= date_trunc('month', CURRENT_DATE);

  -- Orders
  SELECT COUNT(*) INTO v_total_orders FROM public.new_orders;
  
  SELECT COUNT(*) INTO v_today_orders 
  FROM public.new_orders 
  WHERE created_at >= CURRENT_DATE;

  -- Customers
  SELECT COUNT(*) INTO v_customer_count FROM public.profiles;

  -- Products
  SELECT COUNT(*) INTO v_product_count FROM public.products;
  
  SELECT COUNT(*) INTO v_low_stock_count 
  FROM public.products 
  WHERE stock <= 5; -- threshold for low stock

  -- Pending Deliveries (status confirmed, packed, shipped, out_for_delivery)
  SELECT COUNT(*) INTO v_pending_deliveries 
  FROM public.new_orders 
  WHERE status IN ('confirmed', 'packed', 'shipped', 'out_for_delivery');

  RETURN json_build_object(
    'totalRevenue', v_total_revenue,
    'monthlyRevenue', v_monthly_revenue,
    'totalOrders', v_total_orders,
    'todayOrders', v_today_orders,
    'customerCount', v_customer_count,
    'productCount', v_product_count,
    'pendingDeliveries', v_pending_deliveries,
    'lowStockCount', v_low_stock_count
  );
END;
$$;

-- Function to get chart data
CREATE OR REPLACE FUNCTION public.get_dashboard_charts()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_daily_sales json;
  v_monthly_sales json;
  v_product_performance json;
BEGIN
  -- Daily Sales (last 7 days)
  SELECT json_agg(row_to_json(d)) INTO v_daily_sales
  FROM (
    SELECT to_char(date_trunc('day', created_at), 'Mon DD') as date, COALESCE(SUM(grand_total), 0) as revenue
    FROM public.new_orders
    WHERE created_at >= CURRENT_DATE - INTERVAL '6 days'
    AND status != 'cancelled'
    GROUP BY date_trunc('day', created_at)
    ORDER BY date_trunc('day', created_at) ASC
  ) d;

  -- Monthly Sales (last 6 months)
  SELECT json_agg(row_to_json(m)) INTO v_monthly_sales
  FROM (
    SELECT to_char(date_trunc('month', created_at), 'Mon YYYY') as month, COALESCE(SUM(grand_total), 0) as revenue
    FROM public.new_orders
    WHERE created_at >= date_trunc('month', CURRENT_DATE) - INTERVAL '5 months'
    AND status != 'cancelled'
    GROUP BY date_trunc('month', created_at)
    ORDER BY date_trunc('month', created_at) ASC
  ) m;

  -- Product Performance (Top 5 selling products)
  SELECT json_agg(row_to_json(p)) INTO v_product_performance
  FROM (
    SELECT product_name as name, SUM(quantity) as sold, SUM(total) as revenue
    FROM public.order_items
    GROUP BY product_name
    ORDER BY sold DESC
    LIMIT 5
  ) p;

  RETURN json_build_object(
    'dailySales', COALESCE(v_daily_sales, '[]'::json),
    'monthlySales', COALESCE(v_monthly_sales, '[]'::json),
    'productPerformance', COALESCE(v_product_performance, '[]'::json)
  );
END;
$$;
