import { getApiUrl, getSiteUrl } from "@/lib/env";
import type { ArticleListItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const base = getSiteUrl();
  const api = getApiUrl();
  let items: ArticleListItem[] = [];
  try {
    const res = await fetch(`${api}/articles?page=1&limit=30`, { next: { revalidate: 300 } });
    const json = (await res.json()) as { data: ArticleListItem[] };
    items = json.data || [];
  } catch {
    items = [];
  }

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>IT Blog</title>
    <link>${escapeXml(base)}</link>
    <description>Новини та статті про інформаційні технології</description>
    <language>uk-UA</language>
    <atom:link href="${escapeXml(base)}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items
      .map((a) => {
        const url = `${base}/articles/${a.slug}`;
        const date = a.published_at || a.created_at;
        return `
    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid>${escapeXml(url)}</guid>
      <pubDate>${date ? new Date(date).toUTCString() : new Date().toUTCString()}</pubDate>
      <description>${escapeXml(a.excerpt || a.title)}</description>
    </item>`;
      })
      .join("")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=300, stale-while-revalidate",
    },
  });
}

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
