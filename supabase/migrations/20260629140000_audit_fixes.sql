-- Audit Fixes Migration

-- 1. Create user_roles table for role-based access control
create table if not exists public.user_roles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles on delete cascade not null,
  role text not null check (role in ('admin', 'customer')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, role)
);

alter table public.user_roles enable row level security;
create policy "Users can view their own roles" on public.user_roles for select using (auth.uid() = user_id);

-- 2. Enable Realtime for new_orders table
do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime' and tablename = 'new_orders'
  ) then
    execute 'alter publication supabase_realtime add table new_orders';
  end if;
end
$$;
