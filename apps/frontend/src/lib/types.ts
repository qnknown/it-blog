export type PaginationMeta = {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
};

export type ApiErrorBody = {
  error: { code: string; message: string };
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
};

export type Author = {
  id: string;
  slug: string;
  name: string;
  bio?: string | null;
  avatar_url?: string | null;
  profile_url?: string | null;
  published_articles?: number;
};

export type Tag = {
  id: string;
  slug: string;
  name: string;
};

export type ArticleTagRow = {
  tags: Tag | null;
};

export type ArticleListItem = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  category_id?: string | null;
  author_id: string;
  status: string;
  published_at?: string | null;
  views: number;
  cover_url?: string | null;
  created_at: string;
  updated_at?: string;
  categories?: Category | null;
  author?: Author | null;
};

export type ArticleDetail = ArticleListItem & {
  content: string;
  article_tags?: ArticleTagRow[] | null;
};

export type AdminUser = Author & {
  is_admin: boolean;
};
