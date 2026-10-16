create or replace function public.valid_recipe_lines(
  lines text[],
  max_count integer,
  max_chars integer
)
returns boolean
language sql
immutable
set search_path = ''
as $$
  select coalesce(
    cardinality(lines) between 1 and max_count
    and array_position(lines, null) is null
    and not exists (
      select 1
      from unnest(lines) as item(value)
      where char_length(value) not between 1 and max_chars
        or value <> btrim(value)
    ),
    false
  );
$$;

create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  category text not null check (category in ('Espresso', 'Iced', 'Cold', 'Tea', 'Treats')),
  description text not null check (char_length(description) between 1 and 280),
  prep_minutes integer not null check (prep_minutes between 1 and 1440),
  ingredients text[] not null check (public.valid_recipe_lines(ingredients, 30, 160)),
  instructions text[] not null check (public.valid_recipe_lines(instructions, 20, 500)),
  created_at timestamptz not null default now()
);

alter table public.recipes
  add column if not exists status text not null default 'pending',
  add column if not exists reviewed_at timestamptz,
  add column if not exists reviewed_by uuid references auth.users (id) on delete set null;

alter table public.recipes
  drop constraint if exists recipes_status_check;

alter table public.recipes
  add constraint recipes_status_check check (status in ('pending', 'approved', 'rejected'));

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table if not exists private.recipe_admin_allowlist (
  email text primary key check (email = lower(email))
);
revoke all on table private.recipe_admin_allowlist from public, anon, authenticated;

delete from private.recipe_admin_allowlist
where email not in (
  'wackyvillarina@gmail.com',
  'taniel@gmail.com',
  'jaylord@gmail.com'
);

insert into private.recipe_admin_allowlist (email)
values
  ('wackyvillarina@gmail.com'),
  ('taniel@gmail.com'),
  ('jaylord@gmail.com')
on conflict (email) do nothing;

create or replace function public.is_recipe_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from auth.users as account
    join private.recipe_admin_allowlist as allowed
      on lower(account.email) = allowed.email
    where account.id = (select auth.uid())
      and account.email_confirmed_at is not null
  );
$$;

revoke all on function public.is_recipe_admin() from public, anon, authenticated;
grant execute on function public.is_recipe_admin() to anon, authenticated;

alter table public.recipes enable row level security;

drop policy if exists "Anyone can read recipes" on public.recipes;
drop policy if exists "Read approved recipes and owned submissions" on public.recipes;
create policy "Read approved recipes and owned submissions"
  on public.recipes for select
  using (
    status = 'approved'
    or user_id = (select auth.uid())
    or (select public.is_recipe_admin())
  );

drop policy if exists "Signed-in users can add their own recipes" on public.recipes;
create policy "Signed-in users can add their own recipes"
  on public.recipes for insert
  to authenticated
  with check (
    user_id = (select auth.uid())
    and status = 'pending'
    and reviewed_at is null
    and reviewed_by is null
  );

drop policy if exists "Users can update their own recipes" on public.recipes;
drop policy if exists "Users can delete their own recipes" on public.recipes;
drop policy if exists "Only admins can review recipes" on public.recipes;

revoke insert, update, delete on public.recipes from public, anon, authenticated;
grant select on public.recipes to anon, authenticated;
grant insert on public.recipes to authenticated;

create or replace function public.review_recipe(p_recipe_id uuid, p_approve boolean)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_recipe_admin() then
    raise exception 'Only designated admins can review recipes.'
      using errcode = '42501';
  end if;

  update public.recipes
  set status = case when p_approve then 'approved' else 'rejected' end,
      reviewed_at = now(),
      reviewed_by = (select auth.uid())
  where id = p_recipe_id
    and status = 'pending';

  return found;
end;
$$;

revoke all on function public.review_recipe(uuid, boolean) from public, anon, authenticated;
grant execute on function public.review_recipe(uuid, boolean) to authenticated;
