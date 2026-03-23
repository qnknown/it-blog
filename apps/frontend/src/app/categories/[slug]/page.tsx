import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/article/ArticleCard";
import { Pagination } from "@/components/layout/Pagination";
import { fetchJson } from "@/lib/api";
import type { ArticleListItem, Category, PaginationMeta } from "@/lib/types";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { data: cats } = await fetchJson<{ data: Category[] }>("/categories", { next: { revalidate: 120 } });
    const cat = cats.find((c) => c.slug === slug);
    if (!cat) return { title: "Категорія" };
    return {
      title: `${cat.name} | IT Blog`,
      description: cat.description || `Статті в категорії «${cat.name}»`,
    };
  } catch {
    return { title: "Категорія" };
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const limit = 12;

  let category: Category | null = null;
  let articles: ArticleListItem[] = [];
  let meta: PaginationMeta;

  try {
    const catsRes = await fetchJson<{ data: Category[] }>("/categories", { next: { revalidate: 120 } });
    category = catsRes.data.find((c) => c.slug === slug) || null;
    if (!category) notFound();

    const artRes = await fetchJson<{ data: ArticleListItem[]; meta: PaginationMeta }>(
      `/categories/${encodeURIComponent(slug)}/articles?page=${page}&limit=${limit}`,
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
        <span className="text-zinc-800 dark:text-zinc-200">Категорії</span>
      </nav>

      <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">{category!.name}</h1>
      {category!.description && (
        <p className="mt-3 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">{category!.description}</p>
      )}

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>

      {articles.length === 0 && (
        <p className="py-12 text-center text-zinc-500">У цій категорії ще немає публікацій.</p>
      )}

      <Pagination
        meta={meta}
        buildHref={(p) => (p <= 1 ? `/categories/${slug}` : `/categories/${slug}?page=${p}`)}
      />
    </div>
  );
}
