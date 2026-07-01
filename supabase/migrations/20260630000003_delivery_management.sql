-- Migration for Delivery Management (Module 4)

-- 1. Create delivery_partners table
CREATE TABLE IF NOT EXISTS public.delivery_partners (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name text NOT NULL,
  mobile text NOT NULL,
  vehicle_type text,
  vehicle_number text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on delivery_partners
ALTER TABLE public.delivery_partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage delivery partners" ON public.delivery_partners
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- 2. Alter new_orders to support delivery assignment
ALTER TABLE public.new_orders 
  ADD COLUMN IF NOT EXISTS delivery_partner_id uuid REFERENCES public.delivery_partners(id),
  ADD COLUMN IF NOT EXISTS expected_delivery_date timestamp with time zone;

-- 3. Create delivery_logs table for audit trail
CREATE TABLE IF NOT EXISTS public.delivery_logs (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id uuid NOT NULL REFERENCES public.new_orders(id) ON DELETE CASCADE,
  status text NOT NULL,
  note text,
  updated_by text NOT NULL, -- Name or ID of the admin/system
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on delivery_logs
ALTER TABLE public.delivery_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view their own delivery logs" ON public.delivery_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.new_orders 
      WHERE new_orders.id = delivery_logs.order_id 
      AND new_orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage delivery logs" ON public.delivery_logs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Enable Supabase Realtime for delivery_logs
ALTER PUBLICATION supabase_realtime ADD TABLE public.delivery_logs;

-- 4. RPC for Dashboard Analytics
CREATE OR REPLACE FUNCTION public.get_delivery_metrics()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total_deliveries integer;
  v_active_deliveries integer;
  v_delivered_today integer;
  v_pending_assignments integer;
  v_failed_deliveries integer;
  v_returned_orders integer;
BEGIN
  -- Security check: only admins
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  -- Total Deliveries (Orders not cancelled/pending)
  SELECT COUNT(*) INTO v_total_deliveries FROM public.new_orders WHERE status NOT IN ('pending', 'cancelled');
  
  -- Active Deliveries (Out for delivery, Shipped, etc.)
  SELECT COUNT(*) INTO v_active_deliveries FROM public.new_orders WHERE status IN ('Packed', 'Ready for Dispatch', 'Assigned to Delivery Partner', 'Out for Delivery');

  -- Delivered Today
  SELECT COUNT(*) INTO v_delivered_today FROM public.new_orders 
  WHERE status = 'Delivered' AND updated_at >= CURRENT_DATE;

  -- Pending Assignments (Confirmed but no partner)
  SELECT COUNT(*) INTO v_pending_assignments FROM public.new_orders 
  WHERE status IN ('Order Confirmed', 'Packed') AND delivery_partner_id IS NULL;

  -- Failed Deliveries
  SELECT COUNT(*) INTO v_failed_deliveries FROM public.new_orders WHERE status = 'Delivery Failed';

  -- Returned Orders
  SELECT COUNT(*) INTO v_returned_orders FROM public.new_orders WHERE status = 'Returned';

  RETURN json_build_object(
    'totalDeliveries', v_total_deliveries,
    'activeDeliveries', v_active_deliveries,
    'deliveredToday', v_delivered_today,
    'pendingAssignments', v_pending_assignments,
    'failedDeliveries', v_failed_deliveries,
    'returnedOrders', v_returned_orders
  );
END;
$$;

-- 5. RPC to update status and safely insert log
CREATE OR REPLACE FUNCTION public.update_delivery_status(
  p_order_id uuid,
  p_status text,
  p_note text DEFAULT NULL,
  p_partner_id uuid DEFAULT NULL,
  p_expected_date timestamp with time zone DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_admin_name text;
BEGIN
  -- Security check: only admins
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'Access denied';
  END IF;

  -- Get admin name (Optional, fallback to System)
  SELECT full_name INTO v_admin_name FROM public.profiles WHERE id = auth.uid();
  IF v_admin_name IS NULL THEN v_admin_name := 'Admin System'; END IF;

  -- Update order
  UPDATE public.new_orders 
  SET 
    status = p_status,
    delivery_partner_id = COALESCE(p_partner_id, delivery_partner_id),
    expected_delivery_date = COALESCE(p_expected_date, expected_delivery_date),
    updated_at = timezone('utc'::text, now())
  WHERE id = p_order_id;

  -- Insert Log
  INSERT INTO public.delivery_logs (order_id, status, note, updated_by)
  VALUES (p_order_id, p_status, p_note, v_admin_name);

END;
$$;
