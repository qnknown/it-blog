"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { adminFetch } from "@/lib/admin-api";
import type { ArticleListItem } from "@/lib/types";

export default function AdminArticlesPage() {
  const [rows, setRows] = useState<ArticleListItem[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    adminFetch("/admin/articles?limit=100&page=1")
      .then((r) => r.json())
      .then((j: { data: ArticleListItem[] }) => setRows(j.data || []))
      .catch(() => setErr("Не вдалося завантажити статті"));
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <AdminNav />
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Статті</h1>
        <Link
          href="/admin/articles/new"
          className="rounded-lg btn btn-primary"
        >
          Нова стаття
        </Link>
      </div>
      {err && <p className="mt-4 text-red-600">{err}</p>}
      <div className="mt-6 overflow-x-auto rounded-xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
            <tr>
              <th className="px-4 py-3">Заголовок</th>
              <th className="px-4 py-3">Статус</th>
              <th className="px-4 py-3">Оновлено</th>
              <th className="px-4 py-3">Дії</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((a) => (
              <tr key={a.id} className="border-b border-zinc-100 dark:border-zinc-800">
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{a.title}</td>
                <td className="px-4 py-3 capitalize text-zinc-600">{a.status}</td>
                <td className="px-4 py-3 text-zinc-500">
                  {a.updated_at ? new Date(a.updated_at).toLocaleString("uk-UA") : "—"}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/articles/${a.id}/edit`} className="text-[var(--accent)] hover:underline">
                    Редагувати
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
