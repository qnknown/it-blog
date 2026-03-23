import Link from "next/link";
import type { PaginationMeta } from "@/lib/types";

type Props = {
  meta: PaginationMeta;
  /** pathname without query, e.g. /categories/js */
  buildHref: (page: number) => string;
};

export function Pagination({ meta, buildHref }: Props) {
  if (meta.totalPages <= 1) return null;

  const { page, totalPages } = meta;
  const prev = page > 1 ? page - 1 : null;
  const next = page < totalPages ? page + 1 : null;

  return (
    <nav className="mt-10 flex items-center justify-center gap-4 text-sm" aria-label="Пагінація">
      {prev ? (
        <Link
          href={buildHref(prev)}
          className="rounded-md border border-zinc-300 px-3 py-2 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          ← Попередня
        </Link>
      ) : (
        <span className="opacity-40">← Попередня</span>
      )}
      <span className="text-zinc-600 dark:text-zinc-400">
        Сторінка {page} з {totalPages}
      </span>
      {next ? (
        <Link
          href={buildHref(next)}
          className="rounded-md border border-zinc-300 px-3 py-2 hover:bg-zinc-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
        >
          Наступна →
        </Link>
      ) : (
        <span className="opacity-40">Наступна →</span>
      )}
    </nav>
  );
}
