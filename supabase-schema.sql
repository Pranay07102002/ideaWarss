-- ============================================================
-- IdeaWatts database schema
-- Run this in the Supabase SQL Editor (Dashboard -> SQL Editor).
-- ============================================================

-- THREADS: discussion topics anyone can open ideas under.
create table if not exists public.threads (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  description text,
  created_by  uuid references auth.users (id) on delete set null,
  created_at  timestamptz not null default now()
);

-- IDEAS: posts inside a thread.
create table if not exists public.ideas (
  id           uuid primary key default gen_random_uuid(),
  thread_id    uuid not null references public.threads (id) on delete cascade,
  content      text not null,
  created_by   uuid references auth.users (id) on delete set null,
  author_email text,
  created_at   timestamptz not null default now()
);

-- VOTES: one upvote per user per idea.
create table if not exists public.votes (
  idea_id    uuid not null references public.ideas (id) on delete cascade,
  user_id    uuid not null references auth.users (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (idea_id, user_id)
);

create index if not exists ideas_thread_id_idx on public.ideas (thread_id);
create index if not exists votes_idea_id_idx on public.votes (idea_id);

-- ============================================================
-- Row Level Security
-- Reading is public (so shared thread links work for anyone),
-- writing requires an authenticated user.
-- ============================================================

alter table public.threads enable row level security;
alter table public.ideas   enable row level security;
alter table public.votes   enable row level security;

-- THREADS
drop policy if exists "threads readable by all" on public.threads;
create policy "threads readable by all"
  on public.threads for select using (true);

drop policy if exists "threads insertable by authenticated" on public.threads;
create policy "threads insertable by authenticated"
  on public.threads for insert to authenticated
  with check (auth.uid() = created_by);

-- IDEAS
drop policy if exists "ideas readable by all" on public.ideas;
create policy "ideas readable by all"
  on public.ideas for select using (true);

drop policy if exists "ideas insertable by authenticated" on public.ideas;
create policy "ideas insertable by authenticated"
  on public.ideas for insert to authenticated
  with check (auth.uid() = created_by);

-- VOTES
drop policy if exists "votes readable by all" on public.votes;
create policy "votes readable by all"
  on public.votes for select using (true);

drop policy if exists "votes insertable by owner" on public.votes;
create policy "votes insertable by owner"
  on public.votes for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "votes deletable by owner" on public.votes;
create policy "votes deletable by owner"
  on public.votes for delete to authenticated
  using (auth.uid() = user_id);

-- ============================================================
-- Optional: enable realtime so leaderboards update live.
-- (Safe to run more than once.)
-- ============================================================
alter publication supabase_realtime add table public.ideas;
alter publication supabase_realtime add table public.votes;
