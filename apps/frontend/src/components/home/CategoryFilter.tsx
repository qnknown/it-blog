import Link from "next/link";
import type { Category } from "@/lib/types";

export function CategoryFilter({
  categories,
  activeSlug,
}: {
  categories: Category[];
  activeSlug?: string;
}) {
  return (
    <div className="mb-10 flex flex-wrap gap-2.5">
      <FilterChip href="/" label="Усі" active={!activeSlug} />
      {categories.map((c) => (
        <FilterChip
          key={c.id}
          href={`/?category=${encodeURIComponent(c.slug)}`}
          label={c.name}
          active={activeSlug === c.slug}
        />
      ))}
    </div>
  );
}

function FilterChip({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full px-5 py-2 text-sm font-bold transition-all duration-200 ${
        active
          ? "bg-[var(--accent)] text-white shadow-md hover:-translate-y-0.5"
          : "bg-white text-zinc-600 ring-2 ring-inset ring-zinc-200 hover:ring-zinc-300 hover:text-zinc-900 hover:-translate-y-0.5 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-700 dark:hover:ring-zinc-600 dark:hover:text-zinc-100"
      }`}
    >
      {label}
    </Link>
  );
}
