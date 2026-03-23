import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArticleCard } from "@/components/article/ArticleCard";
import { ArticleViewTracker } from "@/components/article/ArticleViewTracker";
import { fetchJsonNoStore } from "@/lib/api";
import { extractTags } from "@/lib/article-tags";
import { getSiteUrl } from "@/lib/env";
import type { ArticleDetail, ArticleListItem } from "@/lib/types";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

function formatDate(iso?: string | null) {
  if (!iso) return "";
  try {
    return new Intl.DateTimeFormat("uk-UA", { dateStyle: "long" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { data: article } = await fetchJsonNoStore<{ data: ArticleDetail }>(
      `/articles/${encodeURIComponent(slug)}`
    );
    const title = `${article.title} | IT Blog`;
    const desc = article.excerpt || article.title;
    const url = `${getSiteUrl()}/articles/${article.slug}`;
    return {
      title,
      description: desc,
      alternates: { canonical: url },
      openGraph: {
        title: article.title,
        description: desc,
        type: "article",
        publishedTime: article.published_at || undefined,
        url,
        images: article.cover_url ? [{ url: article.cover_url }] : undefined,
      },
    };
  } catch {
    return { title: "Стаття" };
  }
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  let article: ArticleDetail;
  let related: ArticleListItem[] = [];

  try {
    const [aRes, rRes] = await Promise.all([
      fetchJsonNoStore<{ data: ArticleDetail }>(`/articles/${encodeURIComponent(slug)}`),
      fetchJsonNoStore<{ data: ArticleListItem[] }>(
        `/articles/${encodeURIComponent(slug)}/related`
      ),
    ]);
    article = aRes.data;
    related = rRes.data;
  } catch {
    notFound();
  }

  const tags = extractTags(article);
  const author = article.author;
  const cat = article.categories;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    datePublished: article.published_at,
    image: article.cover_url ? [article.cover_url] : undefined,
    author: author ? { "@type": "Person", name: author.name, url: `${getSiteUrl()}/authors/${author.slug}` } : undefined,
    description: article.excerpt || undefined,
    mainEntityOfPage: `${getSiteUrl()}/articles/${article.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleViewTracker articleId={article.id} />

      <article className="mx-auto max-w-3xl px-4 py-10">
        <nav className="mb-6 text-sm text-zinc-500">
          <Link href="/" className="hover:text-[var(--accent)]">
            Головна
          </Link>
          {cat && (
            <>
              {" / "}
              <Link href={`/categories/${cat.slug}`} className="hover:text-[var(--accent)]">
                {cat.name}
              </Link>
            </>
          )}
        </nav>

        {cat && (
          <Link
            href={`/categories/${cat.slug}`}
            className="text-sm font-semibold uppercase tracking-wide text-[var(--accent)] dark:text-[var(--accent)]"
          >
            {cat.name}
          </Link>
        )}

        <h1 className="mt-2 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">{article.title}</h1>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-zinc-600 dark:text-zinc-400">
          {author && (
            <Link href={`/authors/${author.slug}`} className="font-medium hover:text-[var(--accent)]">
              {author.name}
            </Link>
          )}
          <time dateTime={article.published_at || undefined}>{formatDate(article.published_at)}</time>
          <span>👁 {article.views ?? 0} переглядів</span>
        </div>

        {article.cover_url && (
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
            <Image
              src={article.cover_url}
              alt=""
              fill
              className="object-cover"
              priority
              sizes="(max-width:768px) 100vw, 768px"
            />
          </div>
        )}

        {tags.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-2">
            {tags.map((t) => (
              <li key={t.id}>
                <Link
                  href={`/tags/${t.slug}`}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700 hover:bg-[var(--accent)]/20 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-[var(--accent)]/20"
                >
                  #{t.name}
                </Link>
              </li>
            ))}
          </ul>
        )}

        <div className="prose prose-zinc mt-10 max-w-none dark:prose-invert prose-headings:scroll-mt-24 prose-a:text-[var(--accent)]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{article.content || ""}</ReactMarkdown>
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-950">
          <div className="mx-auto max-w-6xl px-4">
            <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">Читайте також</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
