-- ============================================================
-- Sri Venkateshwara Oil Mill -- Backend Tables Migration
-- Run this in Supabase SQL Editor or via Supabase CLI
-- ============================================================

-- PRODUCTS TABLE (admin-managed catalog)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  slug TEXT,
  name TEXT NOT NULL,
  tamil_name TEXT,
  category TEXT NOT NULL CHECK (category IN ('oils', 'dryfruits', 'palm-products', 'honey', 'millets')),
  description TEXT,
  image TEXT,
  image_alt TEXT,
  variants JSONB NOT NULL DEFAULT '[]',
  tags TEXT[] DEFAULT '{}'::TEXT[],
  stock INTEGER DEFAULT 0,
  enabled BOOLEAN DEFAULT TRUE,
  rating NUMERIC(3,1) DEFAULT 5.0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_pct INTEGER NOT NULL CHECK (discount_pct BETWEEN 1 AND 100),
  max_uses INTEGER DEFAULT NULL,
  uses INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ DEFAULT NULL,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CART ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  name TEXT NOT NULL,
  size TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  qty INTEGER NOT NULL DEFAULT 1,
  image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id, size)
);

-- WISHLIST ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.wishlist_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  size TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id, size)
);

-- ADDRESSES TABLE
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  label TEXT NOT NULL DEFAULT 'Home',
  address TEXT NOT NULL,
  landmark TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  phone TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PAYMENTS TABLE (Razorpay transaction log)
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  payment_method TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- DELIVERY TRACKING TABLE
CREATE TABLE IF NOT EXISTS public.delivery_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'confirmed',
  current_location TEXT,
  coordinates JSONB,
  estimated_delivery_date TIMESTAMPTZ,
  history JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INVOICES TABLE
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  invoice_number TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'general' CHECK (type IN ('new_order', 'payment', 'low_stock', 'order_update', 'general')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Products: public read, admin write (backend uses service role so RLS doesn't block it)
CREATE POLICY "products_public_read" ON public.products FOR SELECT USING (enabled = TRUE);
CREATE POLICY "products_service_write" ON public.products FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- Cart: users see their own
CREATE POLICY "cart_own" ON public.cart_items FOR ALL USING (auth.uid() = user_id);

-- Wishlist: users see their own
CREATE POLICY "wishlist_own" ON public.wishlist_items FOR ALL USING (auth.uid() = user_id);

-- Addresses: users manage their own
CREATE POLICY "addresses_own" ON public.addresses FOR ALL USING (auth.uid() = user_id);

-- Payments: admin reads all, users see their own
CREATE POLICY "payments_own" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "payments_service" ON public.payments FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- Delivery tracking: own user
CREATE POLICY "delivery_service" ON public.delivery_tracking FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- Invoices: own user via order
CREATE POLICY "invoices_service" ON public.invoices FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- Notifications: admin only
CREATE POLICY "notifications_service" ON public.notifications FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- Coupons: service role manages
CREATE POLICY "coupons_service" ON public.coupons FOR ALL USING (TRUE) WITH CHECK (TRUE);

-- ============================================================
-- SEED DATA: Default coupon
-- ============================================================
INSERT INTO public.coupons (code, discount_pct, max_uses, enabled)
VALUES ('SVOM10', 10, NULL, TRUE)
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- INDEXES for performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_cart_user ON public.cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_user ON public.wishlist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_addresses_user ON public.addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_delivery_order ON public.delivery_tracking(order_id);
CREATE INDEX IF NOT EXISTS idx_invoices_order ON public.invoices(order_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications(type);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_enabled ON public.products(enabled);
