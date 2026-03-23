"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { adminFetch } from "@/lib/admin-api";
import { getToken } from "@/lib/auth-storage";
import { getApiUrl } from "@/lib/env";
import type { ArticleDetail, Category, Tag } from "@/lib/types";

type Props = {
  categories: Category[];
  tags: Tag[];
  initial?: ArticleDetail;
  mode: "create" | "edit";
};

export function ArticleEditor({ categories, tags, initial, mode }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [categoryId, setCategoryId] = useState(initial?.category_id ?? "");
  const [status, setStatus] = useState(initial?.status ?? "draft");
  const [coverUrl, setCoverUrl] = useState(initial?.cover_url ?? "");
  const [selectedTags, setSelectedTags] = useState<Set<string>>(() => {
    const s = new Set<string>();
    initial?.article_tags?.forEach((row) => {
      if (row.tags?.id) s.add(row.tags.id);
    });
    return s;
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleTag(id: string) {
    setSelectedTags((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  async function uploadCover(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    const token = getToken();
    const res = await fetch(`${getApiUrl()}/admin/upload`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: fd,
    });
    const json = (await res.json()) as { data?: { url: string }; error?: { message: string } };
    if (!res.ok) throw new Error(json.error?.message || "Помилка завантаження");
    setCoverUrl(json.data?.url || "");
  }

  async function submit() {
    setError(null);
    setPending(true);
    try {
      const body = {
        title,
        content,
        excerpt: excerpt || null,
        category_id: categoryId || null,
        status,
        cover_url: coverUrl || null,
        tag_ids: Array.from(selectedTags),
      };
      const path =
        mode === "create" ? "/admin/articles" : `/admin/articles/${initial?.id}`;
      const res = await adminFetch(path, {
        method: mode === "create" ? "POST" : "PUT",
        body: JSON.stringify(body),
      });
      const json = (await res.json()) as { error?: { message: string } };
      if (!res.ok) throw new Error(json.error?.message || "Помилка збереження");
      router.push("/admin/articles");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Помилка");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-900/5 dark:bg-zinc-900 dark:ring-zinc-100/10">
        <div className="space-y-5">
          <div>
            <label className="field-label" htmlFor="f-title">Заголовок</label>
            <input
              id="f-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="field-input"
              placeholder="Введіть заголовок статті..."
            />
          </div>

          <div>
            <label className="field-label" htmlFor="f-excerpt">Короткий опис</label>
            <textarea
              id="f-excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              className="field-input resize-none"
              placeholder="Короткий опис для прев'ю..."
            />
          </div>

          <div>
            <label className="field-label" htmlFor="f-content">Контент (Markdown)</label>
            <textarea
              id="f-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={16}
              className="field-input font-mono text-sm leading-relaxed"
              placeholder="## Заголовок 2&#10;Основний текст..."
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="f-cat">Категорія</label>
              <select
                id="f-cat"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="field-input"
              >
                <option value="">— Оберіть категорію —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label" htmlFor="f-status">Статус</label>
              <select
                id="f-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="field-input"
              >
                <option value="draft">Чернетка (Draft)</option>
                <option value="published">Опубліковано (Published)</option>
              </select>
            </div>
          </div>

          <div>
            <span className="field-label">Обкладинка</span>
            <div className="mt-2 flex flex-wrap items-center gap-4 rounded-xl border border-dashed border-zinc-300 p-4 dark:border-zinc-700">
              <input
                type="file"
                accept="image/*"
                className="text-sm file:mr-4 file:rounded-full file:border-0 file:bg-[var(--accent)]/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[var(--accent)] hover:file:bg-[var(--accent)]/20 dark:file:bg-[var(--accent)]/30 dark:file:text-[var(--accent)] dark:hover:file:bg-[var(--accent)]/50"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadCover(f).catch((err) => setError(err.message));
                }}
              />
              {coverUrl && (
                <span className="truncate text-xs font-medium text-[var(--accent)] dark:text-[var(--accent)]" title={coverUrl}>
                  {coverUrl.split("/").pop()}
                </span>
              )}
            </div>
          </div>

          <div>
            <span className="field-label">Теги</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((t) => {
                const checked = selectedTags.has(t.id);
                return (
                  <label
                    key={t.id}
                    className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      checked
                        ? "bg-[var(--accent)] text-white shadow-sm shadow-[var(--accent)]/20"
                        : "bg-zinc-50 text-zinc-600 ring-1 ring-inset ring-zinc-200 hover:bg-zinc-100 dark:bg-zinc-800/50 dark:text-zinc-400 dark:ring-zinc-700 dark:hover:bg-zinc-800"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={checked}
                      onChange={() => toggleTag(t.id)}
                    />
                    {t.name}
                  </label>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/30 dark:text-red-400">
              {error}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => submit()} disabled={pending || !title.trim()} className="btn btn-primary">
          {pending ? "Збереження…" : "Зберегти статтю"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn btn-ghost">
          Скасувати
        </button>
      </div>
    </div>
  );
}

