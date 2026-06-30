-- Phase 2 RPC for Committing Orders Securely
create or replace function commit_order_transaction(
  p_user_id uuid,
  p_order_details json,
  p_razorpay_order_id text default null,
  p_razorpay_payment_id text default null,
  p_razorpay_signature text default null
)
returns uuid
language plpgsql
security definer
as $$
declare
  v_order_id uuid;
  v_item json;
  v_stock int;
  v_payment_status payment_status;
begin
  v_payment_status := case when p_razorpay_payment_id is not null then 'completed'::payment_status else 'pending'::payment_status end;

  -- 1. Insert into new_orders
  insert into public.new_orders (
    user_id,
    address_id,
    subtotal,
    gst_total,
    shipping_total,
    discount_total,
    grand_total,
    status,
    coupon_code,
    razorpay_order_id
  ) values (
    p_user_id,
    (p_order_details->>'address_id')::uuid,
    (p_order_details->>'subtotal')::numeric,
    (p_order_details->>'gst')::numeric,
    (p_order_details->>'shipping')::numeric,
    (p_order_details->>'discount')::numeric,
    (p_order_details->>'total')::numeric,
    'confirmed',
    p_order_details->>'coupon',
    p_razorpay_order_id
  ) returning id into v_order_id;

  -- 2. Insert items and update stock
  for v_item in select * from json_array_elements(p_order_details->'items')
  loop
    -- Check stock
    select stock into v_stock from public.products where id = (v_item->>'id')::uuid;
    if v_stock < (v_item->>'qty')::int then
      raise exception 'Out of stock for product %', v_item->>'name';
    end if;

    -- Deduct stock
    update public.products 
    set stock = stock - (v_item->>'qty')::int 
    where id = (v_item->>'id')::uuid;

    -- Insert order item
    insert into public.order_items (
      order_id,
      product_id,
      product_name,
      quantity,
      price,
      gst_amount,
      total
    ) values (
      v_order_id,
      (v_item->>'id')::uuid,
      v_item->>'name',
      (v_item->>'qty')::int,
      (v_item->>'price')::numeric,
      ((v_item->>'price')::numeric * (v_item->>'qty')::int) * 0.05,
      (v_item->>'price')::numeric * (v_item->>'qty')::int
    );
  end loop;

  -- 3. Insert payment
  insert into public.payments (
    order_id,
    user_id,
    amount,
    method,
    status,
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature
  ) values (
    v_order_id,
    p_user_id,
    (p_order_details->>'total')::numeric,
    (p_order_details->>'payment_method')::payment_method,
    v_payment_status,
    p_razorpay_payment_id,
    p_razorpay_order_id,
    p_razorpay_signature
  );

  -- 4. Clear cart
  delete from public.cart_items where user_id = p_user_id;

  return v_order_id;
end;
$$;
