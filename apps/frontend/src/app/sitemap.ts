import type { MetadataRoute } from "next";
import { getApiUrl, getSiteUrl } from "@/lib/env";
import type { ArticleListItem, Category, Tag } from "@/lib/types";

export const dynamic = "force-dynamic";

async function fetchJson<T>(path: string): Promise<T> {
  const url = `${getApiUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) return { data: [] } as T;
  return res.json() as Promise<T>;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const staticEntries: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/search`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ];

  let cats: { data: Category[] };
  let tags: { data: Tag[] };
  let articlesFirst: { data: ArticleListItem[] };
  try {
    [cats, tags, articlesFirst] = await Promise.all([
      fetchJson<{ data: Category[] }>("/categories"),
      fetchJson<{ data: Tag[] }>("/tags"),
      fetchJson<{ data: ArticleListItem[] }>("/articles?page=1&limit=500"),
    ]);
  } catch {
    return staticEntries;
  }

  const catUrls: MetadataRoute.Sitemap = (cats.data || []).map((c) => ({
    url: `${base}/categories/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const tagUrls: MetadataRoute.Sitemap = (tags.data || []).map((t) => ({
    url: `${base}/tags/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const articleUrls: MetadataRoute.Sitemap = (articlesFirst.data || []).map((a) => ({
    url: `${base}/articles/${a.slug}`,
    lastModified: a.updated_at ? new Date(a.updated_at) : new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...catUrls, ...tagUrls, ...articleUrls];
}
