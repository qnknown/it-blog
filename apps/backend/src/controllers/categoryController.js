import { ok } from '../utils/response.js';
import { parsePagination } from '../utils/pagination.js';
import * as categoryService from '../services/categoryService.js';
import * as articleService from '../services/articleService.js';

export async function list(req, res) {
  const rows = await categoryService.listCategories();
  return ok(res, rows);
}

export async function articlesByCategorySlug(req, res) {
  const { page, limit, from, to } = parsePagination(req.query);
  const { rows, total } = await articleService.listArticlesByCategorySlug(req.params.slug, { from, to });
  return ok(res, rows, { page, perPage: limit, total });
}
