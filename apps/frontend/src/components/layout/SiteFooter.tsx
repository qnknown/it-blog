import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t-[3px] border-[var(--accent)] bg-zinc-50 py-12 text-sm text-zinc-500 dark:bg-zinc-950 dark:text-zinc-500">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="group flex w-fit items-center gap-2 text-xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50"
          >
            <span className="flex h-5 w-5 items-center justify-center rounded bg-[var(--accent)] text-white shadow-sm shadow-[var(--accent)]/30 transition-transform group-hover:rotate-12 group-hover:scale-110">
              <svg
                className="h-3 w-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </span>
            Code IT
          </Link>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-600 max-w-xs">
            Гайди, інсайти та тренди IT, щоб прокачати навички та залишатися на хвилі технологій.
          </p>
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">© {new Date().getFullYear()} Code IT</p>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-xs font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-600">
            Ресурси
          </span>
          <div className="flex flex-col gap-2 font-semibold">
            <Link href="/rss.xml" className="hover:text-[var(--accent)] transition-colors">
              RSS Feed
            </Link>
            <Link href="/sitemap.xml" className="hover:text-[var(--accent)] transition-colors">
              Site map
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}


