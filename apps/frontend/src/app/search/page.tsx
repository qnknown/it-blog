import { Suspense } from "react";
import type { Metadata } from "next";
import { SearchResults } from "./SearchResults";

export const metadata: Metadata = {
  title: "Пошук",
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Пошук</h1>
      <Suspense fallback={<p className="text-zinc-500">Завантаження…</p>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
