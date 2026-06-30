-- Phase 2: Cart Items & Order/Invoice Numbers

-- Create Cart Items Table
create table if not exists public.cart_items (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  product_id uuid references public.products on delete cascade not null,
  size text not null default 'default',
  quantity integer not null default 1,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, product_id, size)
);

alter table public.cart_items enable row level security;

create policy "Users can view own cart items" on public.cart_items for select using (auth.uid() = user_id);
create policy "Users can insert own cart items" on public.cart_items for insert with check (auth.uid() = user_id);
create policy "Users can update own cart items" on public.cart_items for update using (auth.uid() = user_id);
create policy "Users can delete own cart items" on public.cart_items for delete using (auth.uid() = user_id);

-- Sequence for custom Order and Invoice numbers
create sequence if not exists order_seq start 1;
create sequence if not exists invoice_seq start 1;

-- Alter new_orders to include invoice_number and razorpay_order_id
alter table public.new_orders add column if not exists invoice_number text unique;
alter table public.new_orders add column if not exists razorpay_order_id text unique;

-- Function to auto-generate Order Number (e.g. ORD-2026-000001)
create or replace function generate_order_number()
returns trigger language plpgsql as $$
begin
  if NEW.order_number is null then
    NEW.order_number := 'ORD-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('order_seq')::text, 6, '0');
  end if;
  return NEW;
end;
$$;

drop trigger if exists set_order_number on public.new_orders;
create trigger set_order_number
before insert on public.new_orders
for each row execute function generate_order_number();

-- Function to auto-generate Invoice Number when order is paid
create or replace function generate_invoice_number()
returns trigger language plpgsql as $$
begin
  if NEW.status != 'pending' and NEW.invoice_number is null then
    NEW.invoice_number := 'SVOM-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('invoice_seq')::text, 6, '0');
  end if;
  return NEW;
end;
$$;

drop trigger if exists set_invoice_number on public.new_orders;
create trigger set_invoice_number
before insert or update on public.new_orders
for each row execute function generate_invoice_number();
