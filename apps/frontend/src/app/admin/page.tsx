import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <AdminNav />
      <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">АДМІНПАНЕЛЬ.</h1>
      <p className="mt-3 text-lg font-medium text-zinc-500 dark:text-zinc-400">Керування контентом та структурою блогу.</p>
      
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {[
          { href: "/admin/articles", label: "Статті", desc: "Створення та редагування публікацій" },
          { href: "/admin/categories", label: "Категорії", desc: "Управління тематичними розділами" },
          { href: "/admin/tags", label: "Теги", desc: "Мітки для швидкого пошуку" },
          { href: "/admin/authors", label: "Автори", desc: "Керування доступом авторів" },
        ].map((x) => (
          <Link
            key={x.href}
            href={x.href}
            className="group flex flex-col rounded-3xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-zinc-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[var(--accent)]/10 hover:ring-[var(--accent)]/20 dark:bg-zinc-900/50 dark:ring-zinc-100/10 dark:hover:shadow-[var(--accent)]/20 dark:hover:ring-[var(--accent)]/30"
          >
            <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100 group-hover:text-[var(--accent)] transition-colors">
              {x.label}
            </span>
            <p className="mt-2 font-medium text-zinc-500 dark:text-zinc-400">{x.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

