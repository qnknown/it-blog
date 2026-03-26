import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article/ArticleCard";
import { Pagination } from "@/components/layout/Pagination";
import { fetchJson } from "@/lib/api";
import type { ArticleListItem, PaginationMeta, Tag } from "@/lib/types";

export const revalidate = 120;

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { data: tags } = await fetchJson<{ data: Tag[] }>("/tags", { next: { revalidate: 120 } });
    const tag = tags.find((t) => t.slug === slug);
    if (!tag) return { title: "Тег" };
    return {
      title: `Тег «${tag.name}» | Code IT`,
      description: `Статті з тегом ${tag.name}`,
    };
  } catch {
    return { title: "Тег" };
  }
}

export default async function TagPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const limit = 12;

  let tagName = slug;
  let articles: ArticleListItem[] = [];
  let meta: PaginationMeta;

  try {
    const tagsRes = await fetchJson<{ data: Tag[] }>("/tags", { next: { revalidate: 120 } });
    const tag = tagsRes.data.find((t) => t.slug === slug);
    if (tag) tagName = tag.name;

    const artRes = await fetchJson<{ data: ArticleListItem[]; meta: PaginationMeta }>(
      `/tags/${encodeURIComponent(slug)}/articles?page=${page}&limit=${limit}`,
      { next: { revalidate: 60 } }
    );
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
        <span className="text-zinc-800 dark:text-zinc-200">Теги</span>
      </nav>

      <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">#{tagName}</h1>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>

      {articles.length === 0 && (
        <p className="py-12 text-center text-zinc-500">Немає статей з цим тегом.</p>
      )}

      <Pagination
        meta={meta}
        buildHref={(p) => (p <= 1 ? `/tags/${slug}` : `/tags/${slug}?page=${p}`)}
      />
    </div>
  );
}
