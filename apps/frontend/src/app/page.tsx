import type { Metadata } from "next";
import { ArticleCard } from "@/components/article/ArticleCard";
import { CategoryFilter } from "@/components/home/CategoryFilter";
import { Pagination } from "@/components/layout/Pagination";
import { fetchJson } from "@/lib/api";
import type { ArticleListItem, Category, PaginationMeta } from "@/lib/types";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "IT Blog — новини про інформаційні технології",
  description:
    "Новинний блог про JavaScript, backend, DevOps, ШІ, кібербезпеку та інструменти розробки.",
  openGraph: {
    title: "IT Blog",
    description: "Новини та статті про IT",
    type: "website",
  },
};

type SearchParams = Promise<{ page?: string; category?: string }>;

export default async function HomePage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const limit = 12;
  const category = sp.category;

  const [catRes, articlesRes] = await Promise.all([
    fetchJson<{ data: Category[] }>("/categories", { next: { revalidate: 120 } }),
    fetchJson<{ data: ArticleListItem[]; meta: PaginationMeta }>(
      `/articles?page=${page}&limit=${limit}${category ? `&category=${encodeURIComponent(category)}` : ""}`,
      { next: { revalidate: 60 } }
    ),
  ]);

  const categories = catRes.data;
  const { data: articles, meta } = articlesRes;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <header className="mb-12 border-b-2 border-zinc-200/60 pb-10 dark:border-zinc-800/60">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-3xl">
            <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--accent-light)] px-3 py-1 text-xs font-bold uppercase tracking-widest text-[var(--accent)] dark:bg-[var(--accent)]/10">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)]"></span>
              CodeIT Blog
            </span>
            <h1 className="text-5xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl md:text-7xl">
              Останні публікації.
            </h1>
            <p className="mt-4 max-w-2xl text-lg font-medium text-zinc-500 dark:text-zinc-400">
              Будуємо майбутнє рядок за рядком
            </p>
          </div>
          <div className="shrink-0 text-right hidden sm:block">
            <span className="text-sm font-bold uppercase tracking-wide text-zinc-400 dark:text-zinc-600">
              {meta.total} {meta.total === 1 ? "стаття" : "статей"}
            </span>
          </div>
        </div>
      </header>

      <CategoryFilter categories={categories} activeSlug={category} />


      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>

      {articles.length === 0 && (
        <p className="py-12 text-center text-zinc-500">Статей поки немає або фільтр нічого не знайшов.</p>
      )}

      <Pagination
        meta={meta}
        buildHref={(p) => {
          const params = new URLSearchParams();
          if (category) params.set("category", category);
          if (p > 1) params.set("page", String(p));
          const s = params.toString();
          return s ? `/?${s}` : "/";
        }}
      />
    </div>
  );
}
