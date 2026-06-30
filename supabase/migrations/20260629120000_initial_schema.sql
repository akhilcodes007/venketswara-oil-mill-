-- Initial Schema for Sri Venkateshwara Oil Mill

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Enum for Order Status
create type order_status as enum (
  'pending', 'confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered', 'cancelled'
);

-- Enum for Payment Status
create type payment_status as enum (
  'pending', 'completed', 'failed', 'refunded'
);

-- Enum for Payment Methods
create type payment_method as enum (
  'upi', 'google_pay', 'phonepe', 'paytm', 'debit_card', 'credit_card', 'net_banking', 'cod'
);

-- Create Profiles Table (extends auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  mobile text unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Categories Table
create table if not exists public.categories (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Products Table
create table if not exists public.products (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text unique not null,
  description text,
  category_id uuid references public.categories on delete set null,
  price numeric not null default 0,
  discount numeric not null default 0,
  gst numeric not null default 0,
  stock integer not null default 0,
  sku text unique,
  images text[] default '{}',
  benefits text[],
  ingredients text[],
  usage_instructions text,
  storage_instructions text,
  weight text,
  is_best_seller boolean default false,
  is_popular boolean default false,
  is_new_arrival boolean default false,
  is_featured boolean default false,
  meta_title text,
  meta_description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Addresses Table
create table if not exists public.addresses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  name text not null,
  mobile text not null,
  address text not null,
  landmark text,
  city text not null,
  state text not null,
  pincode text not null,
  is_default boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Orders Table (replaces existing simplified orders table)
create table if not exists public.new_orders (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete set null,
  order_number text unique not null,
  address_id uuid references public.addresses on delete set null,
  subtotal numeric not null default 0,
  gst_total numeric not null default 0,
  shipping_total numeric not null default 0,
  discount_total numeric not null default 0,
  grand_total numeric not null default 0,
  status order_status default 'pending'::order_status not null,
  coupon_code text,
  expected_delivery_date date,
  delivery_notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Order Items Table
create table if not exists public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.new_orders on delete cascade not null,
  product_id uuid references public.products on delete set null,
  product_name text not null,
  quantity integer not null,
  price numeric not null,
  gst_amount numeric not null default 0,
  total numeric not null
);

-- Create Payments Table
create table if not exists public.payments (
  id uuid default uuid_generate_v4() primary key,
  order_id uuid references public.new_orders on delete cascade not null,
  user_id uuid references public.profiles on delete set null,
  amount numeric not null,
  method payment_method not null,
  status payment_status default 'pending'::payment_status not null,
  razorpay_payment_id text,
  razorpay_order_id text,
  razorpay_signature text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create Wishlist Table
create table if not exists public.wishlist (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  product_id uuid references public.products on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, product_id)
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.addresses enable row level security;
alter table public.new_orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.wishlist enable row level security;

-- Setup RLS Policies

-- Profiles
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Categories (Public read, admin write)
create policy "Categories are viewable by everyone" on public.categories for select using (true);

-- Products (Public read, admin write)
create policy "Products are viewable by everyone" on public.products for select using (true);

-- Addresses
create policy "Users can view own addresses" on public.addresses for select using (auth.uid() = user_id);
create policy "Users can insert own addresses" on public.addresses for insert with check (auth.uid() = user_id);
create policy "Users can update own addresses" on public.addresses for update using (auth.uid() = user_id);
create policy "Users can delete own addresses" on public.addresses for delete using (auth.uid() = user_id);

-- Orders
create policy "Users can view own orders" on public.new_orders for select using (auth.uid() = user_id);
create policy "Users can insert own orders" on public.new_orders for insert with check (auth.uid() = user_id);

-- Order Items
create policy "Users can view own order items" on public.order_items for select using (
  exists (select 1 from public.new_orders where id = order_items.order_id and user_id = auth.uid())
);
create policy "Users can insert own order items" on public.order_items for insert with check (
  exists (select 1 from public.new_orders where id = order_items.order_id and user_id = auth.uid())
);

-- Payments
create policy "Users can view own payments" on public.payments for select using (auth.uid() = user_id);
create policy "Users can insert own payments" on public.payments for insert with check (auth.uid() = user_id);

-- Wishlist
create policy "Users can view own wishlist" on public.wishlist for select using (auth.uid() = user_id);
create policy "Users can insert own wishlist" on public.wishlist for insert with check (auth.uid() = user_id);
create policy "Users can delete own wishlist" on public.wishlist for delete using (auth.uid() = user_id);
