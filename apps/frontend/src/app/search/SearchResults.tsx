"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArticleCard } from "@/components/article/ArticleCard";
import { Pagination } from "@/components/layout/Pagination";
import { getApiUrl } from "@/lib/env";
import type { ArticleListItem, PaginationMeta } from "@/lib/types";

export function SearchResults() {
  const sp = useSearchParams();
  const q = (sp.get("q") || "").trim();
  const page = Math.max(1, parseInt(sp.get("page") || "1", 10) || 1);

  const [items, setItems] = useState<ArticleListItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!q) {
      setItems([]);
      setMeta(null);
      setError(null);
      return;
    }
    const ac = new AbortController();
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({ q, page: String(page), limit: "10" });
    fetch(`${getApiUrl()}/search?${params}`, { signal: ac.signal })
      .then(async (res) => {
        const json = (await res.json()) as {
          data?: ArticleListItem[];
          meta?: PaginationMeta;
          error?: { message: string };
        };
        if (!res.ok) throw new Error(json.error?.message || "Помилка пошуку");
        setItems(json.data || []);
        setMeta(json.meta || null);
      })
      .catch((e: Error) => {
        if (e.name === "AbortError") return;
        setError(e.message);
      })
      .finally(() => setLoading(false));
    return () => ac.abort();
  }, [q, page]);

  return (
    <div>
      <form
        action="/search"
        method="get"
        className="mb-8 flex flex-col gap-3 sm:flex-row"
      >
        <input type="hidden" name="page" value="1" />
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder="Пошук за заголовком або текстом..."
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-3 text-zinc-900 shadow-sm focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />
        <button
          type="submit"
          className="rounded-lg btn btn-primary px-6 py-3"
        >
          Шукати
        </button>
      </form>

      {!q && <p className="text-zinc-600 dark:text-zinc-400">Введіть запит і натисніть «Шукати».</p>}

      {loading && q && <p className="text-sm text-zinc-500">Завантаження…</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && q && !error && items.length === 0 && (
        <p className="text-zinc-600 dark:text-zinc-400">Нічого не знайдено за запитом «{q}».</p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>

      {meta && meta.totalPages > 1 && (
        <Pagination
          meta={meta}
          buildHref={(p) => {
            const params = new URLSearchParams({ q, page: String(p), limit: "10" });
            return `/search?${params.toString()}`;
          }}
        />
      )}
    </div>
  );
}
