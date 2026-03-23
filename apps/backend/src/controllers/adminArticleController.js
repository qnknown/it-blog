import { AppError } from '../utils/AppError.js';
import { ok } from '../utils/response.js';
import { parsePagination } from '../utils/pagination.js';
import * as articleService from '../services/articleService.js';

export async function list(req, res) {
  const { page, limit, from, to } = parsePagination(req.query);
  const { rows, total } = await articleService.listAllArticlesAdmin({ from, to });
  return ok(res, rows, { page, perPage: limit, total });
}

export async function getById(req, res) {
  const row = await articleService.getArticleById(req.params.id);
  if (!row) throw new AppError('NOT_FOUND', 'Article not found', 404);
  return ok(res, row);
}

export async function create(req, res) {
  const row = await articleService.createArticle(req.body || {}, req.authUser);
  return ok(res, row);
}

export async function update(req, res) {
  const row = await articleService.updateArticle(req.params.id, req.body || {});
  return ok(res, row);
}

export async function remove(req, res) {
  const existing = await articleService.getArticleById(req.params.id);
  if (!existing) throw new AppError('NOT_FOUND', 'Article not found', 404);
  await articleService.deleteArticle(req.params.id);
  return ok(res, { id: req.params.id, deleted: true });
}
