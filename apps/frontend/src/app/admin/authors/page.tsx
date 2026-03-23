"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AdminNav } from "@/components/admin/AdminNav";
import { adminFetch } from "@/lib/admin-api";
import type { AdminUser } from "@/lib/types";

export default function AdminAuthorsPage() {
  const [rows, setRows] = useState<AdminUser[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    adminFetch("/admin/users")
      .then((r) => r.json())
      .then((j: { data: AdminUser[] }) => setRows(j.data || []))
      .catch(() => setErr("Помилка завантаження"));
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <AdminNav />
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Автори</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Користувачі з профілем у системі. Публічні сторінки:{" "}
        <code className="rounded bg-zinc-200 px-1 dark:bg-zinc-800">/authors/[slug]</code>
      </p>
      {err && <p className="mt-4 text-red-600">{err}</p>}
      <ul className="mt-6 space-y-2">
        {rows.map((u) => (
          <li
            key={u.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div>
              <p className="font-medium">{u.name}</p>
              <p className="text-xs text-zinc-500">
                {u.slug} {u.is_admin ? "· адмін" : ""}
              </p>
            </div>
            <Link href={`/authors/${u.slug}`} className="text-sm text-[var(--accent)] hover:underline">
              Публічний профіль
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
