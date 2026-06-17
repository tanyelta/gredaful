create extension if not exists "pgcrypto";

create table if not exists public.couples (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  invite_code text unique,
  created_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  couple_id uuid references public.couples(id) on delete set null,
  display_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.daily_entries (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  entry_date date not null,
  highlight text not null check (char_length(highlight) <= 1200),
  blessing text not null check (char_length(blessing) <= 1200),
  is_favorite boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, entry_date)
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_touch_updated_at on public.profiles;
create trigger profiles_touch_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

drop trigger if exists daily_entries_touch_updated_at on public.daily_entries;
create trigger daily_entries_touch_updated_at
before update on public.daily_entries
for each row execute function public.touch_updated_at();

alter table public.couples enable row level security;
alter table public.profiles enable row level security;
alter table public.daily_entries enable row level security;

create or replace function public.is_couple_member(target_couple_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
    and profiles.couple_id = target_couple_id
  );
$$;

drop policy if exists "Couples are visible to members" on public.couples;
create policy "Couples are visible to members"
on public.couples for select
to authenticated
using (public.is_couple_member(couples.id));

drop policy if exists "Profiles are visible to couple members" on public.profiles;
create policy "Profiles are visible to couple members"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.is_couple_member(profiles.couple_id));

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
on public.profiles for insert
to authenticated
with check (id = auth.uid());

drop policy if exists "Entries are visible to couple members" on public.daily_entries;
create policy "Entries are visible to couple members"
on public.daily_entries for select
to authenticated
using (public.is_couple_member(daily_entries.couple_id));

drop policy if exists "Users can insert own entries" on public.daily_entries;
create policy "Users can insert own entries"
on public.daily_entries for insert
to authenticated
with check (
  user_id = auth.uid()
  and public.is_couple_member(daily_entries.couple_id)
);

drop policy if exists "Users can update own entries" on public.daily_entries;
create policy "Users can update own entries"
on public.daily_entries for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Users can delete own entries" on public.daily_entries;
create policy "Users can delete own entries"
on public.daily_entries for delete
to authenticated
using (user_id = auth.uid());

create or replace function public.create_couple_for_current_user(
  couple_name text,
  profile_name text,
  code text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  new_couple_id uuid;
begin
  if current_user_id is null then
    raise exception 'Not authenticated';
  end if;

  insert into public.couples (name, invite_code)
  values (couple_name, nullif(lower(trim(code)), ''))
  returning id into new_couple_id;

  insert into public.profiles (id, couple_id, display_name)
  values (current_user_id, new_couple_id, profile_name)
  on conflict (id) do update
    set couple_id = excluded.couple_id,
        display_name = excluded.display_name;

  return new_couple_id;
end;
$$;

create or replace function public.join_couple_by_code(
  code text,
  profile_name text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  target_couple_id uuid;
begin
  if current_user_id is null then
    raise exception 'Not authenticated';
  end if;

  select id into target_couple_id
  from public.couples
  where invite_code = lower(trim(code));

  if target_couple_id is null then
    raise exception 'Invalid invite code';
  end if;

  insert into public.profiles (id, couple_id, display_name)
  values (current_user_id, target_couple_id, profile_name)
  on conflict (id) do update
    set couple_id = excluded.couple_id,
        display_name = excluded.display_name;

  return target_couple_id;
end;
$$;

grant execute on function public.create_couple_for_current_user(text, text, text) to authenticated;
grant execute on function public.join_couple_by_code(text, text) to authenticated;
grant execute on function public.is_couple_member(uuid) to authenticated;
