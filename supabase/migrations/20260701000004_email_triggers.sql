-- Phase 5 Module 1: Email Triggers
-- This migration connects the application events to the email queue.

-- 1. Profiles (Welcome Email & Admin New Customer)
CREATE OR REPLACE FUNCTION public.handle_new_profile_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_email text;
BEGIN
    -- Fetch email from auth.users securely
    SELECT email INTO v_email FROM auth.users WHERE id = NEW.id;
    
    IF v_email IS NOT NULL THEN
        -- Welcome Customer
        PERFORM public.queue_email(
            v_email,
            'Welcome to Sri Venkateshwara Oil Mill',
            'welcome',
            jsonb_build_object('name', NEW.full_name, 'store_url', 'https://srivenkateshwaraoilmill.com')
        );
        -- Admin New Customer Alert
        PERFORM public.queue_email(
            'admin@svom.com',
            'New Customer Registered',
            'admin_new_customer',
            jsonb_build_object('customer_name', NEW.full_name, 'customer_email', v_email)
        );
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
CREATE TRIGGER on_profile_created
AFTER INSERT ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_new_profile_email();


-- 2. Orders (Order Confirmations & Status Updates)
CREATE OR REPLACE FUNCTION public.handle_order_emails()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_email text;
    v_name text;
BEGIN
    -- Get customer email and name
    SELECT u.email, p.full_name INTO v_email, v_name
    FROM auth.users u
    JOIN public.profiles p ON p.id = u.id
    WHERE u.id = NEW.user_id;

    IF TG_OP = 'INSERT' THEN
        IF v_email IS NOT NULL THEN
            PERFORM public.queue_email(
                v_email,
                'Order Confirmed - #' || NEW.order_number,
                'order_confirmation',
                jsonb_build_object('order_number', NEW.order_number, 'total_amount', NEW.grand_total, 'name', v_name)
            );
        END IF;
        
        PERFORM public.queue_email(
            'admin@svom.com',
            'New Order Received - #' || NEW.order_number,
            'admin_new_order',
            jsonb_build_object('order_number', NEW.order_number, 'total_amount', NEW.grand_total, 'customer_name', v_name)
        );
        
    ELSIF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
        IF v_email IS NOT NULL THEN
            IF NEW.status = 'shipped' THEN
                PERFORM public.queue_email(
                    v_email,
                    'Your order has been shipped - #' || NEW.order_number,
                    'order_shipped',
                    jsonb_build_object('order_number', NEW.order_number, 'name', v_name)
                );
            ELSIF NEW.status = 'out_for_delivery' THEN
                PERFORM public.queue_email(
                    v_email,
                    'Your order is out for delivery - #' || NEW.order_number,
                    'out_for_delivery',
                    jsonb_build_object('order_number', NEW.order_number, 'name', v_name)
                );
            ELSIF NEW.status = 'delivered' THEN
                PERFORM public.queue_email(
                    v_email,
                    'Your order has been delivered - #' || NEW.order_number,
                    'order_delivered',
                    jsonb_build_object('order_number', NEW.order_number, 'name', v_name)
                );
                
                -- Queue Review Reminder
                PERFORM public.queue_email(
                    v_email,
                    'How did we do? Review your recent purchase',
                    'review_reminder',
                    jsonb_build_object('order_number', NEW.order_number, 'name', v_name)
                );
            ELSIF NEW.status = 'cancelled' THEN
                PERFORM public.queue_email(
                    v_email,
                    'Order Cancelled - #' || NEW.order_number,
                    'order_cancelled',
                    jsonb_build_object('order_number', NEW.order_number, 'name', v_name)
                );
            END IF;
        END IF;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_order_status_change ON public.new_orders;
CREATE TRIGGER on_order_status_change
AFTER INSERT OR UPDATE ON public.new_orders
FOR EACH ROW EXECUTE FUNCTION public.handle_order_emails();


-- 3. Reviews (Admin New Review Alert)
CREATE OR REPLACE FUNCTION public.handle_new_review_email()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_product_name text;
BEGIN
    -- Wait, if it's an insert, check if it's pending (approved=false)
    IF TG_OP = 'INSERT' AND (NEW.approved IS NULL OR NEW.approved = false) THEN
        SELECT name INTO v_product_name FROM public.products WHERE id = NEW.product_id;
        
        PERFORM public.queue_email(
            'admin@svom.com',
            'New Review Pending Approval',
            'admin_new_review',
            jsonb_build_object('product_name', COALESCE(v_product_name, 'Unknown Product'), 'rating', NEW.rating)
        );
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_review_created ON public.reviews;
CREATE TRIGGER on_review_created
AFTER INSERT ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.handle_new_review_email();
