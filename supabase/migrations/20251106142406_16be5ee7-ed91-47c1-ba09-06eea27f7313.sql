-- Create enum for roles
create type public.app_role as enum ('admin', 'user');

-- Create user_roles table
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamp with time zone default now(),
  unique (user_id, role)
);

-- Enable RLS
alter table public.user_roles enable row level security;

-- Create security definer function to check roles
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role = _role
  )
$$;

-- Function to check if any admin exists
create or replace function public.admin_exists()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.user_roles
    where role = 'admin'
  )
$$;

-- RLS policies for user_roles
create policy "Users can view their own roles"
on public.user_roles
for select
to authenticated
using (auth.uid() = user_id);

create policy "Only admins can insert roles"
on public.user_roles
for insert
to authenticated
with check (public.has_role(auth.uid(), 'admin'));

-- Update products table policies
drop policy if exists "Authenticated users can delete products" on public.products;
drop policy if exists "Authenticated users can insert products" on public.products;
drop policy if exists "Authenticated users can update products" on public.products;

create policy "Only admins can insert products"
on public.products
for insert
to authenticated
with check (public.has_role(auth.uid(), 'admin'));

create policy "Only admins can update products"
on public.products
for update
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "Only admins can delete products"
on public.products
for delete
to authenticated
using (public.has_role(auth.uid(), 'admin'));

-- Update categories table policies
drop policy if exists "Authenticated users can delete categories" on public.categories;
drop policy if exists "Authenticated users can insert categories" on public.categories;
drop policy if exists "Authenticated users can update categories" on public.categories;

create policy "Only admins can insert categories"
on public.categories
for insert
to authenticated
with check (public.has_role(auth.uid(), 'admin'));

create policy "Only admins can update categories"
on public.categories
for update
to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "Only admins can delete categories"
on public.categories
for delete
to authenticated
using (public.has_role(auth.uid(), 'admin'));

-- Update settings table policies
drop policy if exists "Authenticated users can update settings" on public.settings;

create policy "Only admins can update settings"
on public.settings
for update
to authenticated
using (public.has_role(auth.uid(), 'admin'));