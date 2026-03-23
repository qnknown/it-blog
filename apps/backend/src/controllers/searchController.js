import { AppError } from '../utils/AppError.js';
import { ok } from '../utils/response.js';
import { parsePagination } from '../utils/pagination.js';
import * as articleService from '../services/articleService.js';

export async function search(req, res) {
  const q = req.query.q;
  if (!q || !String(q).trim()) {
    throw new AppError('VALIDATION_ERROR', 'Query parameter q is required', 400);
  }
  const { page, limit, from, to } = parsePagination(req.query);
  const { rows, total } = await articleService.searchPublishedArticles(String(q), { from, to });
  return ok(res, rows, { page, perPage: limit, total });
}
