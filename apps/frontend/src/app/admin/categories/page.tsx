"use client";

import { useEffect, useState } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { adminFetch } from "@/lib/admin-api";
import type { Category } from "@/lib/types";

export default function AdminCategoriesPage() {
  const [rows, setRows] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [err, setErr] = useState<string | null>(null);

  function load() {
    adminFetch("/admin/categories")
      .then((r) => r.json())
      .then((j: { data: Category[] }) => setRows(j.data || []))
      .catch(() => setErr("Помилка завантаження"));
  }

  useEffect(() => {
    load();
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    const res = await adminFetch("/admin/categories", {
      method: "POST",
      body: JSON.stringify({ name, description: description || null }),
    });
    const j = (await res.json()) as { error?: { message: string } };
    if (!res.ok) {
      setErr(j.error?.message || "Помилка");
      return;
    }
    setName("");
    setDescription("");
    load();
  }

  async function remove(id: string) {
    if (!confirm("Видалити категорію?")) return;
    const res = await adminFetch(`/admin/categories/${id}`, { method: "DELETE" });
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
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Категорії</h1>
      <form onSubmit={create} className="mt-6 space-y-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="font-semibold">Нова категорія</h2>
        <input
          required
          placeholder="Назва"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950"
        />
        <textarea
          placeholder="Опис (необов’язково)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded border border-zinc-300 px-3 py-2 dark:border-zinc-700 dark:bg-zinc-950"
          rows={2}
        />
        <button type="submit" className="rounded btn btn-primary">
          Додати
        </button>
      </form>
      {err && <p className="mt-4 text-sm text-red-600">{err}</p>}
      <ul className="mt-8 space-y-2">
        {rows.map((c) => (
          <li
            key={c.id}
            className="flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div>
              <p className="font-medium">{c.name}</p>
              <p className="text-xs text-zinc-500">{c.slug}</p>
            </div>
            <button
              type="button"
              onClick={() => remove(c.id)}
              className="text-sm text-red-600 hover:underline"
            >
              Видалити
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
