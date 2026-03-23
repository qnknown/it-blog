import { supabase } from '../supabase/client.js';
import { supabaseAdmin } from '../supabase/admin.js';
import { AppError } from '../utils/AppError.js';
import { escapeIlike } from '../utils/slug.js';
import { uniqueSlug } from './slugService.js';
import { ensureUserProfile } from './userService.js';

const articleSelect = `
  id,
  slug,
  title,
  content,
  excerpt,
  category_id,
  author_id,
  status,
  published_at,
  views,
  cover_url,
  created_at,
  updated_at,
  categories ( id, slug, name ),
  author:users!author_id ( id, slug, name, avatar_url ),
  article_tags ( tags ( id, slug, name ) )
`;

const articleSelectSimple = `
  id,
  slug,
  title,
  excerpt,
  category_id,
  author_id,
  status,
  published_at,
  views,
  cover_url,
  created_at,
  updated_at,
  categories ( id, slug, name ),
  author:users!author_id ( id, slug, name, avatar_url )
`;

export async function listAllArticlesAdmin({ from, to }) {
  const { data, error, count } = await supabaseAdmin
    .from('articles')
    .select(articleSelectSimple, { count: 'exact' })
    .order('updated_at', { ascending: false })
    .range(from, to);
  if (error) throw error;
  return { rows: data || [], total: count ?? 0 };
}

export async function listPublishedArticles({ categoryId, from, to }) {
  let q = supabase
    .from('articles')
    .select(articleSelectSimple, { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false, nullsFirst: false });
  if (categoryId) q = q.eq('category_id', categoryId);
  const { data, error, count } = await q.range(from, to);
  if (error) throw error;
  return { rows: data || [], total: count ?? 0 };
}

export async function getArticleBySlug(slug, { publishedOnly = true } = {}) {
  let q = supabase.from('articles').select(articleSelect).eq('slug', slug);
  if (publishedOnly) q = q.eq('status', 'published');
  const { data, error } = await q.maybeSingle();
  if (error) throw error;
  return data;
}

export async function getArticleById(id) {
  const { data, error } = await supabaseAdmin
    .from('articles')
    .select(articleSelect)
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function listRelatedArticles(categoryId, excludeArticleId, limit = 5) {
  if (!categoryId) return [];
  const { data, error } = await supabase
    .from('articles')
    .select(articleSelectSimple)
    .eq('status', 'published')
    .eq('category_id', categoryId)
    .neq('id', excludeArticleId)
    .order('published_at', { ascending: false, nullsFirst: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}

export async function incrementArticleViews(id) {
  const { data: row, error: fetchErr } = await supabaseAdmin
    .from('articles')
    .select('id, views')
    .eq('id', id)
    .eq('status', 'published')
    .maybeSingle();
  if (fetchErr) throw fetchErr;
  if (!row) {
    throw new AppError('NOT_FOUND', 'Article not found', 404);
  }
  const next = (row.views ?? 0) + 1;
  const { data, error } = await supabaseAdmin
    .from('articles')
    .update({ views: next })
    .eq('id', id)
    .select('id, views')
    .single();
  if (error) throw error;
  return data;
}

export async function searchPublishedArticles(q, { from, to }) {
  const raw = String(q || '')
    .trim()
    .replace(/,/g, ' ');
  if (!raw) return { rows: [], total: 0 };
  const pattern = `%${escapeIlike(raw)}%`;
  const quoted = `"${pattern.replace(/"/g, '""')}"`;
  const { data, error, count } = await supabase
    .from('articles')
    .select(articleSelectSimple, { count: 'exact' })
    .eq('status', 'published')
    .or(`title.ilike.${quoted},content.ilike.${quoted}`)
    .order('published_at', { ascending: false, nullsFirst: false })
    .range(from, to);
  if (error) throw error;
  return { rows: data || [], total: count ?? 0 };
}

function normalizePublishedFields(body, existing) {
  const status = body.status ?? existing?.status ?? 'draft';
  const published_at =
    status === 'published'
      ? body.published_at ?? existing?.published_at ?? new Date().toISOString()
      : null;
  return { status, published_at };
}

export async function createArticle(body, authUser) {
  if (!authUser?.id) throw new AppError('VALIDATION_ERROR', 'author required', 400);
  await ensureUserProfile(authUser);
  const title = body.title?.trim();
  if (!title) throw new AppError('VALIDATION_ERROR', 'title is required', 400);
  const slug = await uniqueSlug('articles', body.slug || title);
  const { status, published_at } = normalizePublishedFields(body, null);
  const insert = {
    slug,
    title,
    content: body.content ?? '',
    excerpt: body.excerpt ?? null,
    category_id: body.category_id ?? null,
    author_id: authUser.id,
    status,
    published_at,
    cover_url: body.cover_url ?? null,
    views: 0,
  };
  const { data: article, error } = await supabaseAdmin
    .from('articles')
    .insert(insert)
    .select('id')
    .single();
  if (error) throw error;
  await syncArticleTags(article.id, body.tag_ids);
  return getArticleById(article.id);
}

export async function updateArticle(id, body) {
  const existing = await getArticleById(id);
  if (!existing) throw new AppError('NOT_FOUND', 'Article not found', 404);
  const title = body.title !== undefined ? String(body.title).trim() : existing.title;
  let slug = existing.slug;
  if (body.title !== undefined || body.slug !== undefined) {
    slug = await uniqueSlug('articles', body.slug || title, id);
  }
  const { status, published_at } = normalizePublishedFields(
    {
      status: body.status !== undefined ? body.status : existing.status,
      published_at: body.published_at,
    },
    existing
  );
  const patch = {
    slug,
    title,
    content: body.content !== undefined ? body.content : existing.content,
    excerpt: body.excerpt !== undefined ? body.excerpt : existing.excerpt,
    category_id: body.category_id !== undefined ? body.category_id : existing.category_id,
    status,
    published_at,
    cover_url: body.cover_url !== undefined ? body.cover_url : existing.cover_url,
  };
  const { error } = await supabaseAdmin.from('articles').update(patch).eq('id', id);
  if (error) throw error;
  if (body.tag_ids !== undefined) await syncArticleTags(id, body.tag_ids);
  return getArticleById(id);
}

export async function deleteArticle(id) {
  const { error: tErr } = await supabaseAdmin.from('article_tags').delete().eq('article_id', id);
  if (tErr) throw tErr;
  const { error } = await supabaseAdmin.from('articles').delete().eq('id', id);
  if (error) throw error;
}

async function syncArticleTags(articleId, tagIds) {
  if (!Array.isArray(tagIds)) return;
  await supabaseAdmin.from('article_tags').delete().eq('article_id', articleId);
  if (tagIds.length === 0) return;
  const rows = tagIds.map((tag_id) => ({ article_id: articleId, tag_id }));
  const { error } = await supabaseAdmin.from('article_tags').insert(rows);
  if (error) throw error;
}

export async function listArticlesByCategorySlug(categorySlug, { from, to }) {
  const { data: cat, error: cErr } = await supabase
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .maybeSingle();
  if (cErr) throw cErr;
  if (!cat) return { rows: [], total: 0 };
  return listPublishedArticles({ categoryId: cat.id, from, to });
}

export async function listArticlesByTagSlug(tagSlug, { from, to }) {
  const { data: tag, error: tErr } = await supabase.from('tags').select('id').eq('slug', tagSlug).maybeSingle();
  if (tErr) throw tErr;
  if (!tag) return { rows: [], total: 0 };
  const { data: links, error: lErr } = await supabase
    .from('article_tags')
    .select('article_id')
    .eq('tag_id', tag.id);
  if (lErr) throw lErr;
  const ids = (links || []).map((l) => l.article_id);
  if (ids.length === 0) return { rows: [], total: 0 };
  const { data, error, count } = await supabase
    .from('articles')
    .select(articleSelectSimple, { count: 'exact' })
    .eq('status', 'published')
    .in('id', ids)
    .order('published_at', { ascending: false, nullsFirst: false })
    .range(from, to);
  if (error) throw error;
  return { rows: data || [], total: count ?? 0 };
}
