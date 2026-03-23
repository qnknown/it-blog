import { AppError } from '../utils/AppError.js';
import { ok } from '../utils/response.js';
import { parsePagination } from '../utils/pagination.js';
import * as userService from '../services/userService.js';

export async function getBySlug(req, res) {
  const author = await userService.getAuthorBySlug(req.params.slug);
  if (!author) throw new AppError('NOT_FOUND', 'Author not found', 404);
  return ok(res, author);
}

export async function articlesByAuthor(req, res) {
  const { page, limit, from, to } = parsePagination(req.query);
  const { rows, total } = await userService.listArticlesByAuthorSlug(req.params.slug, { from, to });
  return ok(res, rows, { page, perPage: limit, total });
}
