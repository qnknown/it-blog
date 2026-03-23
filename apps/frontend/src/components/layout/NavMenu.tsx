"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import type { Category } from "@/lib/types";

interface NavMenuProps {
  categories: Category[];
}

export function NavMenu({ categories }: NavMenuProps) {
  const [catOpen, setCatOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function handleLinkClick() {
    setMobileOpen(false);
    setCatOpen(false);
  }

  return (
    <>
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
        <Link href="/" onClick={handleLinkClick} className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
          Головна
        </Link>
        <Link href="/search" onClick={handleLinkClick} className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
          Пошук
        </Link>

        {categories.length > 0 && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setCatOpen((v) => !v)}
              aria-expanded={catOpen}
              className="flex items-center gap-1 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              Категорії
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${catOpen ? "rotate-180" : ""}`}
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 4l4 4 4-4" />
              </svg>
            </button>

            {catOpen && (
              <div className="animate-fade-in-down absolute right-0 top-full mt-2 z-50 min-w-[220px] rounded-xl border border-zinc-200/80 bg-white/95 backdrop-blur-sm shadow-xl ring-1 ring-black/5 dark:border-zinc-700/60 dark:bg-zinc-900/95">
                <div className="p-2 grid grid-cols-1 gap-0.5">
                  {categories.map((c) => (
                    <Link
                      key={c.id}
                      href={`/categories/${c.slug}`}
                      onClick={handleLinkClick}
                      className="px-3 py-2 rounded-lg text-sm text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-100 transition-colors"
                    >
                      {c.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <Link
          href="/admin"
          onClick={handleLinkClick}
          className="btn btn-primary ml-2 py-1.5 px-4 text-[13px] hover:shadow-lg hover:-translate-y-0.5"
        >
          Увійти
          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
        </Link>
      </nav>

      <button
        className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-lg text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-colors"
        onClick={() => setMobileOpen((v) => !v)}
        aria-label={mobileOpen ? "Закрити меню" : "Відкрити меню"}
        aria-expanded={mobileOpen}
      >
        <span className={`block h-0.5 w-5 bg-current rounded transition-all duration-200 ${mobileOpen ? "translate-y-2 rotate-45" : ""}`} />
        <span className={`block h-0.5 w-5 bg-current rounded transition-all duration-200 ${mobileOpen ? "opacity-0" : ""}`} />
        <span className={`block h-0.5 w-5 bg-current rounded transition-all duration-200 ${mobileOpen ? "-translate-y-2 -rotate-45" : ""}`} />
      </button>

      {mobileOpen && (
        <div className="md:hidden absolute inset-x-0 top-full z-40 border-b border-zinc-200 bg-white/97 backdrop-blur-sm shadow-lg dark:border-zinc-800 dark:bg-zinc-950/97 animate-fade-in-down">
          <div className="mx-auto max-w-6xl px-4 py-4 flex flex-col gap-1">
            <Link href="/" onClick={handleLinkClick} className="px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors">
              Головна
            </Link>
            <Link href="/search" onClick={handleLinkClick} className="px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors">
              Пошук
            </Link>

            {categories.length > 0 && (
              <>
                <div className="mt-2 mb-1 px-3 text-xs font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Категорії
                </div>
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    href={`/categories/${c.slug}`}
                    onClick={handleLinkClick}
                    className="px-3 py-2.5 rounded-lg text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-colors"
                  >
                    {c.name}
                  </Link>
                ))}
              </>
            )}

            <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
              <Link
                href="/admin"
                onClick={handleLinkClick}
                className="btn btn-primary w-full justify-center"
              >
                Увійти (Адмін)
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
