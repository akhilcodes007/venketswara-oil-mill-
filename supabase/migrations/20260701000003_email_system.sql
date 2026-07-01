-- Migration for Phase 5 Module 1: Email Notification System

-- 1. Enum
DO $$ BEGIN
    CREATE TYPE email_status AS ENUM ('pending', 'processing', 'sent', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Table
CREATE TABLE IF NOT EXISTS public.email_logs (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    recipient text NOT NULL,
    subject text NOT NULL,
    template text NOT NULL,
    payload jsonb DEFAULT '{}'::jsonb,
    status email_status DEFAULT 'pending',
    error_message text,
    attempts integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    sent_at timestamp with time zone,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. RLS
ALTER TABLE IF EXISTS public.email_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can manage email logs" ON public.email_logs;
CREATE POLICY "Admins can manage email logs" ON public.email_logs
FOR ALL
USING (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
)
WITH CHECK (
  EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin')
);

-- 4. RPC
CREATE OR REPLACE FUNCTION public.queue_email(
  p_recipient text,
  p_subject text,
  p_template text,
  p_payload jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_id uuid;
BEGIN
  INSERT INTO public.email_logs (recipient, subject, template, payload)
  VALUES (p_recipient, p_subject, p_template, p_payload)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;
