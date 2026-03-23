import { AdminNav } from "@/components/admin/AdminNav";
import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { fetchJson } from "@/lib/api";
import type { Category, Tag } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function NewArticlePage() {
  const [cats, tagList] = await Promise.all([
    fetchJson<{ data: Category[] }>("/categories", { cache: "no-store" }),
    fetchJson<{ data: Tag[] }>("/tags", { cache: "no-store" }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <AdminNav />
      <h1 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-zinc-50">Нова стаття</h1>
      <ArticleEditor categories={cats.data} tags={tagList.data} mode="create" />
    </div>
  );
}
