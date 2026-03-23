"use client";

import { useEffect, useState } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { adminFetch } from "@/lib/admin-api";
import type { Tag } from "@/lib/types";

export default function AdminTagsPage() {
  const [rows, setRows] = useState<Tag[]>([]);
  const [name, setName] = useState("");
  const [err, setErr] = useState<string | null>(null);

  function load() {
    adminFetch("/admin/tags")
      .then((r) => r.json())
      .then((j: { data: Tag[] }) => setRows(j.data || []))
      .catch(() => setErr("Помилка завантаження"));
  }

  useEffect(() => {
    load();
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const res = await adminFetch("/admin/tags", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
    const j = (await res.json()) as { error?: { message: string } };
    if (!res.ok) {
      setErr(j.error?.message || "Помилка");
      return;
    }
    setName("");
    load();
  }

  async function remove(id: string) {
    if (!confirm("Видалити тег?")) return;
    const res = await adminFetch(`/admin/tags/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const j = (await res.json()) as { error?: { message: string } };
      setErr(j.error?.message || "Не вдалося видалити");
      return;
    }
    load();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <AdminNav />
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Теги</h1>
      <form onSubmit={create} className="mt-6 flex flex-wrap gap-2 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <input
          required
          placeholder="Назва тегу"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="min-w-[200px] flex-1 rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950"
        />
        <button type="submit" className="rounded btn btn-primary">
          Додати
        </button>
      </form>
      {err && <p className="mt-4 text-sm text-red-600">{err}</p>}
      <ul className="mt-8 flex flex-wrap gap-2">
        {rows.map((t) => (
          <li
            key={t.id}
            className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <span>{t.name}</span>
            <button type="button" onClick={() => remove(t.id)} className="text-red-600 hover:underline">
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
