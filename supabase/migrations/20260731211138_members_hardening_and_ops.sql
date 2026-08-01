-- Hardens the `members` table's public write surface, adds reject support,
-- and adds a lightweight keepalive RPC to stop the free-tier project from
-- auto-pausing on inactivity.
--
-- Run this in the Supabase SQL editor (or `supabase db push` if you have the
-- CLI linked to the project).

-- ---------------------------------------------------------------------------
-- 1. Lock down public INSERT on `members`.
--
-- The previous policy only checked `status = 'pending'`, which let anyone
-- calling the REST API directly (the anon key is public in the JS bundle)
-- insert arbitrary values for every other column -- including
-- `is_in_council = true` or an arbitrary `role`. Join requests now go
-- through the `submit_join_request` RPC below instead, so direct public
-- INSERT is no longer needed.
-- ---------------------------------------------------------------------------
drop policy if exists "Public submit join request" on public.members;

-- ---------------------------------------------------------------------------
-- 2. submit_join_request RPC
--
-- SECURITY DEFINER: runs with the privileges of the function owner, bypassing
-- RLS, but only ever inserts the fixed set of columns below with
-- status/is_in_council hardcoded -- callers cannot influence either.
-- `search_path` is pinned to prevent search-path hijacking in SECURITY
-- DEFINER functions.
-- ---------------------------------------------------------------------------
create or replace function public.submit_join_request(
  p_name text,
  p_email text,
  p_major text,
  p_double_major text default null,
  p_phone_number text default null,
  p_role text default null,
  p_u_code text default null,
  p_project text default null,
  p_photo text default null,
  p_skills text[] default '{}',
  p_contributions text[] default '{}',
  p_goals text[] default '{}'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if p_name is null or btrim(p_name) = '' then
    raise exception 'name is required';
  end if;
  if p_email is null or p_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'a valid email is required';
  end if;
  if p_major is null or btrim(p_major) = '' then
    raise exception 'major is required';
  end if;

  insert into public.members (
    name, email, major, double_major, phone_number, role, u_code,
    project, photo, skills, contributions, goals,
    status, is_in_council, join_date
  ) values (
    btrim(p_name), btrim(p_email), btrim(p_major), nullif(btrim(p_double_major), ''),
    nullif(btrim(p_phone_number), ''), nullif(btrim(p_role), ''), nullif(btrim(p_u_code), ''),
    nullif(btrim(p_project), ''), p_photo, coalesce(p_skills, '{}'), coalesce(p_contributions, '{}'),
    coalesce(p_goals, '{}'),
    'pending', false, now()
  )
  returning id into v_id;

  return v_id;
end;
$$;

grant execute on function public.submit_join_request(
  text, text, text, text, text, text, text, text, text, text[], text[], text[]
) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3. Reject/delete pending requests.
--
-- There was previously no DELETE policy at all, so admins could approve a
-- pending request but never clear out spam/unwanted ones.
-- ---------------------------------------------------------------------------
drop policy if exists "Admin delete members" on public.members;
create policy "Admin delete members"
  on public.members
  for delete
  to authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- 4. Keepalive ping RPC.
--
-- Free-tier Supabase projects auto-pause after ~7 days with no API traffic.
-- This is a trivial, read-only, no-privilege function that a scheduled job
-- can call purely to generate traffic. It touches no table and is granted to
-- `anon` so the keepalive job can use the public anon key.
-- ---------------------------------------------------------------------------
create or replace function public.ping()
returns timestamptz
language sql
stable
as $$
  select now();
$$;

grant execute on function public.ping() to anon, authenticated;
