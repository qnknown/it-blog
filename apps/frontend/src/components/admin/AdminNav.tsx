"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearToken, getToken } from "@/lib/auth-storage";
import { adminFetch } from "@/lib/admin-api";

const NAV_LINKS = [
  { href: "/admin", label: "Огляд" },
  { href: "/admin/articles", label: "Статті" },
  { href: "/admin/categories", label: "Категорії" },
  { href: "/admin/tags", label: "Теги" },
  { href: "/admin/authors", label: "Автори" },
] as const;

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    setAuthed(!!getToken());
  }, [pathname]);

  async function logout() {
    await adminFetch("/auth/logout", { method: "POST" });
    clearToken();
    router.push("/admin/login");
    router.refresh();
  }

  if (pathname === "/admin/login") return null;

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname?.startsWith(href);
  }

  return (
    <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b-2 border-zinc-200/60 pb-5 dark:border-zinc-800/60">
      <nav className="flex flex-wrap items-center gap-2">
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`rounded-full px-4 py-2 text-sm font-bold transition-all duration-200 ${
              isActive(href)
                ? "bg-[var(--accent)] text-white shadow-md shadow-[var(--accent)]/20"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-zinc-200"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Сайт
        </Link>

        {authed && (
          <button
            type="button"
            onClick={() => logout()}
            className="rounded-full bg-red-50 text-red-600 px-4 py-2 text-xs font-bold uppercase tracking-widest hover:bg-red-100 hover:text-red-700 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 transition-colors"
          >
            Вийти
          </button>
        )}
      </div>
    </div>
  );
}
