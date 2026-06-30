-- Migration for Inventory Management (Module 2)

-- 1. Add visibility toggles
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- 2. Supabase Storage for Product Images
-- Note: Requires pg_superuser or running in Supabase Dashboard.
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Storage RLS Policies
-- Public read access
CREATE POLICY "Public Read Access" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

-- Admin write access (Requires user_roles table from previous module)
CREATE POLICY "Admin Upload Access" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images' AND 
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin Update Access" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'product-images' AND 
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "Admin Delete Access" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-images' AND 
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
