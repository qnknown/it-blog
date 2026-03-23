import type { ArticleDetail, ArticleTagRow, Tag } from "./types";

export function extractTags(article: ArticleDetail | null | undefined): Tag[] {
  if (!article?.article_tags?.length) return [];
  return article.article_tags
    .map((row: ArticleTagRow) => row.tags)
    .filter((t): t is Tag => !!t);
}
