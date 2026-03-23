import Image from "next/image";
import Link from "next/link";
import type { ArticleListItem } from "@/lib/types";

function formatDate(iso?: string | null) {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("uk-UA", {
      dateStyle: "medium",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function AuthorAvatar({ name }: { name: string }) {
  const initial = name.trim()[0]?.toUpperCase() ?? "?";
  return (
    <span
      aria-hidden
      className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/20 text-[10px] font-semibold text-[var(--accent)] dark:bg-[var(--accent)]/20 dark:text-[var(--accent)]"
    >
      {initial}
    </span>
  );
}

function CoverPlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-zinc-100 dark:bg-zinc-800">
      <svg
        className="h-10 w-10 text-zinc-300 dark:text-zinc-600"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    </div>
  );
}

export function ArticleCard({ article }: { article: ArticleListItem }) {
  const cat = article.categories;
  const author = article.author;

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-900/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[var(--accent)]/10 hover:ring-[var(--accent)]/20 dark:bg-zinc-900/80 dark:ring-zinc-100/10 dark:hover:shadow-[var(--accent)]/20 dark:hover:ring-[var(--accent)]/30">
      <Link href={`/articles/${article.slug}`} className="relative aspect-[16/9] w-full overflow-hidden">
        {article.cover_url ? (
          <Image
            src={article.cover_url}
            alt=""
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.05]"
            sizes="(max-width:768px) 100vw, 33vw"
          />
        ) : (
          <CoverPlaceholder />
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        {cat && (
          <Link
            href={`/categories/${cat.slug}`}
            className="inline-flex w-fit items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-[var(--accent)] hover:opacity-80 transition-opacity"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            {cat.name}
          </Link>
        )}

        <h2 className="text-xl font-black leading-tight text-zinc-900 group-hover:text-[var(--accent)] transition-colors dark:text-zinc-50">
          <Link href={`/articles/${article.slug}`}>
            {article.title}
          </Link>
        </h2>

        {article.excerpt && (
          <p className="line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">{article.excerpt}</p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-xs text-zinc-400 dark:text-zinc-500">
          {author && (
            <Link
              href={`/authors/${author.slug}`}
              className="flex items-center gap-1.5 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
            >
              <AuthorAvatar name={author.name} />
              <span>{author.name}</span>
            </Link>
          )}
          <span>{formatDate(article.published_at)}</span>
          <span className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12C3.5 5 8 2 12 2s8.5 3 11 10c-2.5 7-6.5 10-11 10S3.5 19 1 12z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {article.views ?? 0}
          </span>
        </div>
      </div>
    </article>
  );
}

