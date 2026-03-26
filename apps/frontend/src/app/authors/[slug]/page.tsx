import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article/ArticleCard";
import { Pagination } from "@/components/layout/Pagination";
import { fetchJson } from "@/lib/api";
import type { ArticleListItem, Author, PaginationMeta } from "@/lib/types";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { data: author } = await fetchJson<{ data: Author }>(`/authors/${encodeURIComponent(slug)}`, {
      next: { revalidate: 3600 },
    });
    return {
      title: `${author.name} | Code IT`,
      description: author.bio || `Статті автора ${author.name}`,
    };
  } catch {
    return { title: "Автор" };
  }
}

export default async function AuthorPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const limit = 12;

  let author: Author;
  let articles: ArticleListItem[] = [];
  let meta: PaginationMeta;

  try {
    const [aRes, artRes] = await Promise.all([
      fetchJson<{ data: Author }>(`/authors/${encodeURIComponent(slug)}`, { next: { revalidate: 3600 } }),
      fetchJson<{ data: ArticleListItem[]; meta: PaginationMeta }>(
        `/authors/${encodeURIComponent(slug)}/articles?page=${page}&limit=${limit}`,
        { next: { revalidate: 120 } }
      ),
    ]);
    author = aRes.data;
    articles = artRes.data;
    meta = artRes.meta;
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav className="mb-6 text-sm text-zinc-500">
        <Link href="/" className="hover:text-[var(--accent)]">
          Головна
        </Link>
        {" / "}
        <span className="text-zinc-800 dark:text-zinc-200">Автори</span>
      </nav>

      <header className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          {author.avatar_url ? (
            <Image src={author.avatar_url} alt="" fill className="object-cover" sizes="128px" />
          ) : (
            <div className="flex h-full items-center justify-center text-4xl text-zinc-400">
              {author.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">{author.name}</h1>
          {author.bio && <p className="mt-3 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">{author.bio}</p>}
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-500 dark:text-zinc-400">
            <span>Опубліковано: {author.published_articles ?? meta.total}</span>
            {author.profile_url && (
              <a
                href={author.profile_url}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-cyan-600 hover:underline"
              >
                Профіль автора (LinkedIn / GitHub)
              </a>
            )}
          </div>
        </div>
      </header>

      <h2 className="mt-12 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Статті автора</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>

      {articles.length === 0 && <p className="py-8 text-zinc-500">Ще немає опублікованих статей.</p>}

      <Pagination
        meta={meta}
        buildHref={(p) => (p <= 1 ? `/authors/${slug}` : `/authors/${slug}?page=${p}`)}
      />
    </div>
  );
}
