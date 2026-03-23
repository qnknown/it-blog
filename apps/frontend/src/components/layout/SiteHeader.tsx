import Link from "next/link";
import { fetchJson } from "@/lib/api";
import type { Category } from "@/lib/types";
import { NavMenu } from "./NavMenu";
import { ThemeToggle } from "./ThemeToggle";

async function loadCategories(): Promise<Category[]> {
  try {
    const res = await fetchJson<{ data: Category[] }>("/categories", {
      next: { revalidate: 120 },
    });
    return res.data;
  } catch {
    return [];
  }
}

export async function SiteHeader() {
  const categories = await loadCategories();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/90 backdrop-blur-md dark:border-zinc-800/70 dark:bg-zinc-950/90">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5">
        <Link
          href="/"
          className="group flex items-center gap-2 text-2xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[var(--accent)] text-white shadow-sm shadow-[var(--accent)]/30 transition-transform group-hover:rotate-12 group-hover:scale-110">
            <svg
              className="h-3.5 w-3.5"
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

        <div className="flex items-center gap-4">
          <NavMenu categories={categories} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

