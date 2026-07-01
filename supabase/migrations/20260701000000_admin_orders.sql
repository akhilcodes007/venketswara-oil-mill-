-- Module 5: Orders Management View & Analytics

-- 1. Ensure status column can accept the new extended statuses requested previously
ALTER TABLE public.new_orders ALTER COLUMN status TYPE text USING status::text;

-- 2. Create the highly optimized, Security Invoker View for Admin Data Table
CREATE OR REPLACE VIEW public.admin_orders_view WITH (security_invoker = true) AS
SELECT 
  o.id,
  o.order_number,
  o.created_at,
  o.subtotal,
  o.gst_total,
  o.shipping_total,
  o.discount_total,
  o.grand_total,
  o.status AS order_status,
  o.expected_delivery_date,
  o.delivery_notes,
  p.full_name AS customer_name,
  p.mobile AS customer_mobile,
  a.address AS shipping_address,
  a.city AS shipping_city,
  a.state AS shipping_state,
  a.pincode AS shipping_pincode,
  pay.method AS payment_method,
  pay.status AS payment_status,
  pay.razorpay_order_id,
  dp.id AS delivery_partner_id,
  dp.name AS delivery_partner_name,
  (
    SELECT json_agg(json_build_object(
      'id', oi.id,
      'product_name', oi.product_name,
      'quantity', oi.quantity,
      'price', oi.price,
      'total', oi.total
    ))
    FROM public.order_items oi
    WHERE oi.order_id = o.id
  ) AS items,
  (
    SELECT json_agg(json_build_object(
      'id', dl.id,
      'status', dl.status,
      'note', dl.note,
      'updated_by', dl.updated_by,
      'created_at', dl.created_at
    ) ORDER BY dl.created_at DESC)
    FROM public.delivery_logs dl
    WHERE dl.order_id = o.id
  ) AS logs
FROM public.new_orders o
LEFT JOIN public.profiles p ON o.user_id = p.id
LEFT JOIN public.addresses a ON o.address_id = a.id
LEFT JOIN public.payments pay ON o.id = pay.order_id
LEFT JOIN public.delivery_partners dp ON o.delivery_partner_id = dp.id
WHERE EXISTS (
  SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
);

-- 3. Create Dashboard Metrics RPC v2
CREATE OR REPLACE FUNCTION public.get_orders_dashboard_metrics_v2()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total_orders integer;
  v_pending_orders integer;
  v_processing_orders integer;
  v_delivered_orders integer;
  v_cancelled_orders integer;
  v_total_revenue numeric;
  v_today_revenue numeric;
  v_avg_order_value numeric;
BEGIN
  -- Security check: only admins
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  SELECT COUNT(*) INTO v_total_orders FROM public.new_orders;
  
  SELECT COUNT(*) INTO v_pending_orders FROM public.new_orders WHERE status = 'pending';
  
  SELECT COUNT(*) INTO v_processing_orders FROM public.new_orders 
  WHERE status IN ('confirmed', 'Order Confirmed', 'Packed', 'Ready for Dispatch', 'Assigned to Delivery Partner', 'Out for Delivery');
  
  SELECT COUNT(*) INTO v_delivered_orders FROM public.new_orders WHERE status = 'Delivered';
  
  SELECT COUNT(*) INTO v_cancelled_orders FROM public.new_orders WHERE status IN ('cancelled', 'Cancelled', 'Returned', 'Delivery Failed');

  -- Revenue (exclude incomplete/failed)
  SELECT COALESCE(SUM(grand_total), 0) INTO v_total_revenue 
  FROM public.new_orders WHERE status NOT IN ('pending', 'cancelled', 'Cancelled', 'Delivery Failed', 'Returned');

  SELECT COALESCE(SUM(grand_total), 0) INTO v_today_revenue 
  FROM public.new_orders 
  WHERE status NOT IN ('pending', 'cancelled', 'Cancelled', 'Delivery Failed', 'Returned')
  AND created_at >= CURRENT_DATE;

  IF (v_total_orders - v_cancelled_orders - v_pending_orders) > 0 THEN
    v_avg_order_value := ROUND(v_total_revenue / (v_total_orders - v_cancelled_orders - v_pending_orders), 2);
  ELSE
    v_avg_order_value := 0;
  END IF;

  RETURN json_build_object(
    'totalOrders', v_total_orders,
    'pendingOrders', v_pending_orders,
    'processingOrders', v_processing_orders,
    'deliveredOrders', v_delivered_orders,
    'cancelledOrders', v_cancelled_orders,
    'totalRevenue', v_total_revenue,
    'todayRevenue', v_today_revenue,
    'avgOrderValue', v_avg_order_value
  );
END;
$$;
