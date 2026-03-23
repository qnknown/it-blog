"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminNav } from "@/components/admin/AdminNav";
import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { adminFetch } from "@/lib/admin-api";
import { getApiUrl } from "@/lib/env";
import type { ArticleDetail, Category, Tag } from "@/lib/types";

export default function EditArticlePage() {
  const params = useParams();
  const id = params.id as string;
  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    const ac = new AbortController();
    const signal = ac.signal;
    Promise.all([
      fetch(`${getApiUrl()}/categories`, { signal }).then((r) => r.json()),
      fetch(`${getApiUrl()}/tags`, { signal }).then((r) => r.json()),
      adminFetch(`/admin/articles/${id}`, { signal }).then((r) => r.json()),
    ])
      .then(([cRes, tRes, aRes]: [{ data: Category[] }, { data: Tag[] }, { data: ArticleDetail }]) => {
        setCategories(cRes.data || []);
        setTags(tRes.data || []);
        setArticle(aRes.data);
      })
      .catch((e: unknown) => {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setErr("Не вдалося завантажити дані");
      });
    return () => ac.abort();
  }, [id]);

  if (err) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <AdminNav />
        <p className="text-red-600">{err}</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-10">
        <AdminNav />
        <p className="text-zinc-500">Завантаження…</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <AdminNav />
      <h1 className="mb-8 text-2xl font-bold text-zinc-900 dark:text-zinc-50">Редагування</h1>
      <ArticleEditor categories={categories} tags={tags} initial={article} mode="edit" />
    </div>
  );
}
