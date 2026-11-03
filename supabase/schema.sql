set client_min_messages = warning;
-- =====================================================================
-- Tanzania Perfusionist: Supabase schema
-- Run once in the Supabase SQL editor (or `supabase db push`).
--
-- Roles
--   General Visitor   : no account; reads published content only
--   member            : Registered Member; submits legacy stories & discussions
--   contributor       : submits every content type (always as pending_review)
--   editor            : reviews, edits, publishes, deletes any content
--   super_admin       : everything an editor can do + manages user roles
--
-- Approval workflow
--   Anything inserted or edited by a non-editor is forced to status
--   'pending_review' by a trigger, so it cannot go live without an editor.
-- =====================================================================

create extension if not exists "pgcrypto";

do $$ begin
  create type public.user_role as enum ('member', 'contributor', 'editor', 'super_admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.content_status as enum ('draft', 'pending_review', 'published', 'rejected', 'archived');
exception when duplicate_object then null; end $$;

-- ---------------------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  full_name text,
  role public.user_role not null default 'member',
  title text,
  institution text,
  show_institution boolean not null default false,  -- consent to publish workplace
  training text,
  interests text[] not null default '{}',
  bio text,
  avatar_url text,
  open_to_collaboration boolean not null default false,
  is_public boolean not null default false,          -- consent to appear in the directory
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Role helpers (security definer so policies can call them without recursion)
create or replace function public.role_rank(r public.user_role) returns int
language sql immutable as $$
  select case r when 'member' then 1 when 'contributor' then 2 when 'editor' then 3 when 'super_admin' then 4 end
$$;

create or replace function public.my_rank() returns int
language sql stable security definer set search_path = public as $$
  select coalesce((select public.role_rank(role) from public.profiles where id = auth.uid()), 0)
$$;

create or replace function public.is_editor() returns boolean
language sql stable as $$ select public.my_rank() >= 3 $$;

create or replace function public.is_super_admin() returns boolean
language sql stable as $$ select public.my_rank() >= 4 $$;

-- Only super admins may change roles; users may edit the rest of their own profile.
create or replace function public.protect_profile_role() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  -- auth.uid() is null for the SQL editor / service role, used to bootstrap the first admin.
  if new.role is distinct from old.role and auth.uid() is not null and not public.is_super_admin() then
    raise exception 'Only a Super Administrator can change roles';
  end if;
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists profiles_protect_role on public.profiles;
create trigger profiles_protect_role before update on public.profiles
  for each row execute function public.protect_profile_role();

alter table public.profiles enable row level security;
drop policy if exists "profiles: read own or editor" on public.profiles;
create policy "profiles: read own or editor" on public.profiles for select
  using (id = auth.uid() or public.is_editor());
drop policy if exists "profiles: update own or super admin" on public.profiles;
create policy "profiles: update own or super admin" on public.profiles for update
  using (id = auth.uid() or public.is_super_admin());

-- Public directory: only members who opted in, only consented fields.
create or replace view public.public_profiles as
  select id, full_name, title,
         case when show_institution then institution end as institution,
         show_institution, training, interests, bio, avatar_url, open_to_collaboration
  from public.profiles
  where is_public;
grant select on public.public_profiles to anon, authenticated;

-- Approval workflow: non-editors can never publish. Runs on every content table.
create or replace function public.content_workflow() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  new.updated_at := now();
  if tg_op = 'INSERT' then
    new.created_by := auth.uid();
    new.created_at := now();
  else
    new.created_by := old.created_by;  -- authorship cannot be reassigned
  end if;

  if auth.uid() is not null and not public.is_editor() then
    new.status := 'pending_review';
    new.reviewed_by := null;
    new.review_note := case when tg_op = 'UPDATE' then old.review_note else null end;
  elsif new.status = 'published' and (tg_op = 'INSERT' or old.status is distinct from 'published') then
    new.reviewed_by := auth.uid();
    new.published_on := now();
  end if;
  return new;
end $$;

-- ---------------------------------------------------------------------
-- Content tables (all share: status, consent, review_note, created_by, timestamps)
-- ---------------------------------------------------------------------
create table if not exists public.news_articles (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  summary text not null,
  body text not null default '',
  category text not null,
  author text not null,
  published_at date not null default current_date,
  image_url text,
  tags text[] not null default '{}'
);

create table if not exists public.publications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  authors text not null,
  journal text not null,
  year int not null,
  doi text,
  url text,
  summary text not null,
  key_findings text[] not null default '{}',
  category text not null,
  publication_type text not null,
  content_kind text not null check (content_kind in ('original', 'educational')),
  open_access boolean not null default false,
  constraint publication_has_source check (content_kind = 'educational' or doi is not null or url is not null)
);

create table if not exists public.case_reports (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  age_group text not null,
  procedure text not null,
  sections jsonb not null default '{}',
  "references" text[] not null default '{}',
  author text not null,
  published_at date not null default current_date,
  tags text[] not null default '{}',
  is_template boolean not null default false
);

create table if not exists public.timeline_milestones (
  id uuid primary key default gen_random_uuid(),
  year int not null,
  year_label text,
  title text not null,
  description text not null,
  era text not null,
  region text not null check (region in ('Global', 'Africa', 'Tanzania')),
  people text,
  "references" jsonb not null default '[]',
  image_url text,
  verified boolean not null default false,
  is_placeholder boolean not null default false
);

create table if not exists public.legacy_stories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  role text,
  kind text not null,
  excerpt text not null,
  body text,
  image_url text,
  consent_confirmed boolean not null default false
);

create table if not exists public.media_items (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  kind text not null check (kind in ('video', 'photo', 'infographic')),
  category text not null,
  topic text not null,
  year int,  -- null when unknown; never guess a date
  url text,
  thumbnail_url text,
  credit text
);

alter table public.media_items alter column year drop not null;

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  kind text not null,
  starts_on date not null,
  ends_on date,
  location text not null,
  description text not null,
  url text
);

create table if not exists public.opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  organisation text not null,
  kind text not null,
  location text not null,
  deadline date,
  description text not null,
  url text
);

create table if not exists public.discussions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  body text not null,
  author_name text
);

create table if not exists public.discussion_replies (
  id uuid primary key default gen_random_uuid(),
  discussion_id uuid not null references public.discussions(id) on delete cascade,
  body text not null,
  author_name text
);

-- Shared columns, workflow trigger and policies for every content table.
-- min_rank = the lowest role allowed to submit into that table.
do $$
declare
  t record;
begin
  for t in
    select * from (values
      ('news_articles', 2), ('publications', 2), ('case_reports', 2), ('timeline_milestones', 2),
      ('legacy_stories', 1), ('media_items', 2), ('events', 2), ('opportunities', 2),
      ('discussions', 1), ('discussion_replies', 1)
    ) as v(name, min_rank)
  loop
    execute format($f$
      alter table public.%1$I
        add column if not exists status public.content_status not null default 'draft',
        add column if not exists consent jsonb not null default '{}',
        add column if not exists review_note text,
        add column if not exists created_by uuid references auth.users(id) default auth.uid(),
        add column if not exists reviewed_by uuid references auth.users(id),
        add column if not exists published_on timestamptz,
        add column if not exists created_at timestamptz not null default now(),
        add column if not exists updated_at timestamptz not null default now();
      create index if not exists %1$s_status_idx on public.%1$I (status);
      alter table public.%1$I enable row level security;

      drop trigger if exists %1$s_workflow on public.%1$I;
      create trigger %1$s_workflow before insert or update on public.%1$I
        for each row execute function public.content_workflow();

      drop policy if exists "read published, own, or editor" on public.%1$I;
      create policy "read published, own, or editor" on public.%1$I for select
        using (status = 'published' or created_by = auth.uid() or public.is_editor());

      drop policy if exists "submit with role" on public.%1$I;
      create policy "submit with role" on public.%1$I for insert to authenticated
        with check (public.my_rank() >= %2$s);

      drop policy if exists "edit own unpublished, or editor" on public.%1$I;
      create policy "edit own unpublished, or editor" on public.%1$I for update to authenticated
        using (public.is_editor() or (created_by = auth.uid() and status in ('draft', 'pending_review', 'rejected')));

      drop policy if exists "editor delete" on public.%1$I;
      create policy "editor delete" on public.%1$I for delete to authenticated
        using (public.is_editor());
    $f$, t.name, t.min_rank);
  end loop;
end $$;

-- Only editors may mark history milestones as verified.
create or replace function public.protect_verified() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.is_editor() then
    new.verified := case when tg_op = 'UPDATE' then old.verified else false end;
  end if;
  return new;
end $$;
drop trigger if exists timeline_protect_verified on public.timeline_milestones;
create trigger timeline_protect_verified before insert or update on public.timeline_milestones
  for each row execute function public.protect_verified();

-- Fill in the author's display name on discussions.
create or replace function public.set_author_name() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    select full_name into new.author_name from public.profiles where id = auth.uid();
  end if;
  return new;
end $$;
drop trigger if exists discussions_author on public.discussions;
create trigger discussions_author before insert on public.discussions
  for each row execute function public.set_author_name();
drop trigger if exists replies_author on public.discussion_replies;
create trigger replies_author before insert on public.discussion_replies
  for each row execute function public.set_author_name();

-- ---------------------------------------------------------------------
-- Newsletter, contact form, anonymous analytics
-- ---------------------------------------------------------------------
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  created_at timestamptz not null default now()
);
alter table public.newsletter_subscribers enable row level security;
drop policy if exists "anyone subscribes" on public.newsletter_subscribers;
create policy "anyone subscribes" on public.newsletter_subscribers for insert to anon, authenticated with check (true);
drop policy if exists "editors read subscribers" on public.newsletter_subscribers;
create policy "editors read subscribers" on public.newsletter_subscribers for select using (public.is_editor());
drop policy if exists "editors remove subscribers" on public.newsletter_subscribers;
create policy "editors remove subscribers" on public.newsletter_subscribers for delete using (public.is_editor());

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null check (length(name) <= 200),
  email text not null check (length(email) <= 320),
  topic text,
  message text not null check (length(message) <= 10000),
  handled boolean not null default false,
  created_at timestamptz not null default now()
);
alter table public.contact_messages enable row level security;
drop policy if exists "anyone sends" on public.contact_messages;
create policy "anyone sends" on public.contact_messages for insert to anon, authenticated with check (handled = false);
drop policy if exists "editors read messages" on public.contact_messages;
create policy "editors read messages" on public.contact_messages for select using (public.is_editor());
drop policy if exists "editors update messages" on public.contact_messages;
create policy "editors update messages" on public.contact_messages for update using (public.is_editor());

create table if not exists public.page_views (
  id bigint generated always as identity primary key,
  path text not null check (length(path) <= 300),
  created_at timestamptz not null default now()
);
create index if not exists page_views_created_idx on public.page_views (created_at);
alter table public.page_views enable row level security;
drop policy if exists "anyone records a view" on public.page_views;
create policy "anyone records a view" on public.page_views for insert to anon, authenticated with check (true);
drop policy if exists "editors read views" on public.page_views;
create policy "editors read views" on public.page_views for select using (public.is_editor());

-- security_invoker: the views obey page_views RLS, so only editors see stats.
create or replace view public.page_view_stats with (security_invoker = true) as
  select path, count(*)::int as views from public.page_views
  where created_at > now() - interval '30 days'
  group by path order by views desc limit 50;
create or replace view public.page_view_daily with (security_invoker = true) as
  select to_char(date_trunc('day', created_at), 'YYYY-MM-DD') as day, count(*)::int as views from public.page_views
  where created_at > now() - interval '30 days'
  group by 1 order by 1;

-- ---------------------------------------------------------------------
-- Storage: public "media" bucket. Signed-in users upload into their own
-- folder (<user id>/...); editors can remove anything.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 20971520, array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'])
on conflict (id) do nothing;

drop policy if exists "media: public read" on storage.objects;
create policy "media: public read" on storage.objects for select using (bucket_id = 'media');
drop policy if exists "media: upload own folder" on storage.objects;
create policy "media: upload own folder" on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists "media: editors or owner delete" on storage.objects;
create policy "media: editors or owner delete" on storage.objects for delete to authenticated
  using (bucket_id = 'media' and (public.is_editor() or owner = auth.uid()));
