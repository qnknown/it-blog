create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  slug text not null unique,
  name text not null,
  bio text,
  avatar_url text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid (),
  slug text not null unique,
  name text not null,
  description text,
  created_at timestamptz not null default now()
);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid (),
  slug text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid (),
  slug text not null unique,
  title text not null,
  content text not null default '',
  excerpt text,
  cover_url text,
  category_id uuid references public.categories (id) on delete set null,
  author_id uuid not null references public.users (id) on delete restrict,
  status text not null default 'draft',
  published_at timestamptz,
  views integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now (),
  constraint articles_status_check check (status in ('draft', 'published'))
);

create table if not exists public.article_tags (
  article_id uuid not null references public.articles (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  primary key (article_id, tag_id)
);

create index if not exists idx_articles_status_published_at on public.articles (status, published_at desc nulls last);
create index if not exists idx_articles_category_id on public.articles (category_id);
create index if not exists idx_articles_author_id on public.articles (author_id);
create index if not exists idx_articles_slug on public.articles (slug);

-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at ()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_users_updated_at on public.users;
create trigger trg_users_updated_at
before update on public.users
for each row
execute procedure public.set_updated_at ();

drop trigger if exists trg_articles_updated_at on public.articles;
create trigger trg_articles_updated_at
before update on public.articles
for each row
execute procedure public.set_updated_at ();

-- ---------------------------------------------------------------------------

alter table public.users enable row level security;
alter table public.categories enable row level security;
alter table public.tags enable row level security;
alter table public.articles enable row level security;
alter table public.article_tags enable row level security;

drop policy if exists "categories_select_public" on public.categories;
create policy "categories_select_public" on public.categories
  for select to anon, authenticated
  using (true);

drop policy if exists "tags_select_public" on public.tags;
create policy "tags_select_public" on public.tags
  for select to anon, authenticated
  using (true);

drop policy if exists "users_select_public" on public.users;
create policy "users_select_public" on public.users
  for select to anon, authenticated
  using (true);

drop policy if exists "articles_select_published" on public.articles;
create policy "articles_select_published" on public.articles
  for select to anon, authenticated
  using (status = 'published');

drop policy if exists "article_tags_select_published" on public.article_tags;
create policy "article_tags_select_published" on public.article_tags
  for select to anon, authenticated
  using (
    exists (
      select 1
      from public.articles a
      where a.id = article_tags.article_id
        and a.status = 'published'
    )
  );

-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "images_public_read" on storage.objects;
create policy "images_public_read"
  on storage.objects for select
  to public
  using (bucket_id = 'images');
