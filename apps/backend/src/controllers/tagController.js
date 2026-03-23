import { ok } from '../utils/response.js';
import { parsePagination } from '../utils/pagination.js';
import * as articleService from '../services/articleService.js';
import * as tagService from '../services/tagService.js';

export async function list(req, res) {
  const rows = await tagService.listTags();
  return ok(res, rows);
}

export async function articlesByTagSlug(req, res) {
  const { page, limit, from, to } = parsePagination(req.query);
  const { rows, total } = await articleService.listArticlesByTagSlug(req.params.slug, { from, to });
  return ok(res, rows, { page, perPage: limit, total });
}
