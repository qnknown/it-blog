import { AppError } from '../utils/AppError.js';
import { ok } from '../utils/response.js';
import { parsePagination } from '../utils/pagination.js';
import * as articleService from '../services/articleService.js';
import { getCategoryBySlug } from '../services/categoryService.js';

export async function list(req, res) {
  const { page, limit, from, to } = parsePagination(req.query);
  let categoryId = req.query.category_id ? String(req.query.category_id) : null;
  if (req.query.category) {
    const cat = await getCategoryBySlug(String(req.query.category));
    categoryId = cat?.id ?? '__none__';
  }
  if (categoryId === '__none__') {
    return ok(res, [], { page, perPage: limit, total: 0 });
  }
  const { rows, total } = await articleService.listPublishedArticles({
    categoryId: categoryId || undefined,
    from,
    to,
  });
  return ok(res, rows, { page, perPage: limit, total });
}

export async function getBySlug(req, res) {
  const row = await articleService.getArticleBySlug(req.params.slug);
  if (!row) throw new AppError('NOT_FOUND', 'Article not found', 404);
  return ok(res, row);
}

export async function related(req, res) {
  const article = await articleService.getArticleBySlug(req.params.slug);
  if (!article) throw new AppError('NOT_FOUND', 'Article not found', 404);
  const related = await articleService.listRelatedArticles(article.category_id, article.id, 5);
  return ok(res, related);
}

export async function recordView(req, res) {
  const data = await articleService.incrementArticleViews(req.params.id);
  return ok(res, data);
}
