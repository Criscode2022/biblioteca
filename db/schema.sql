-- ===========================================================================
-- Biblioteca Cloud — database schema for Neon
--
-- Run this in the Neon SQL editor. It is idempotent (safe to re-run).
-- Requires: Neon Auth enabled (provides auth.user_id()) and the Data API.
-- ===========================================================================

-- pgvector powers the AI semantic search / RAG features.
create extension if not exists vector;

-- ---------------------------------------------------------------------------
-- books: the user's catalog (accessed by the SPA through the Neon Data API)
-- ---------------------------------------------------------------------------
create table if not exists public.books (
  id         uuid primary key default gen_random_uuid(),
  owner_id   text not null default (auth.user_id()),
  titulo     text not null,
  autor      text not null,
  year       integer not null,
  editorial  text not null,
  imagen     text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists books_owner_idx on public.books (owner_id);

alter table public.books enable row level security;

drop policy if exists "Books are private to their owner" on public.books;
create policy "Books are private to their owner"
  on public.books
  for all
  to authenticated
  using (owner_id = (auth.user_id()))
  with check (owner_id = (auth.user_id()));

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.books to authenticated;

-- ---------------------------------------------------------------------------
-- book_analyses: AI analysis + embedding per book (written by the serverless
-- functions using a direct connection; ownership enforced in queries)
-- ---------------------------------------------------------------------------
create table if not exists public.book_analyses (
  id         uuid primary key default gen_random_uuid(),
  book_id    uuid not null references public.books (id) on delete cascade,
  owner_id   text not null,
  language   text not null default 'es',
  analysis   jsonb not null,
  -- text-embedding-3-small produces 1536-dimension vectors
  embedding  vector(1536),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (book_id)
);

create index if not exists book_analyses_owner_idx
  on public.book_analyses (owner_id);

-- HNSW index for fast cosine-distance nearest-neighbour search.
create index if not exists book_analyses_embedding_idx
  on public.book_analyses
  using hnsw (embedding vector_cosine_ops);

-- Defense in depth: RLS also on analyses (the functions use a direct
-- connection that bypasses RLS, but the Data API cannot leak them either).
alter table public.book_analyses enable row level security;

drop policy if exists "Analyses are private to their owner" on public.book_analyses;
create policy "Analyses are private to their owner"
  on public.book_analyses
  for all
  to authenticated
  using (owner_id = (auth.user_id()))
  with check (owner_id = (auth.user_id()));

grant select on public.book_analyses to authenticated;
