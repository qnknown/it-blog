import { AppError } from '../utils/AppError.js';
import { ok } from '../utils/response.js';
import * as tagService from '../services/tagService.js';

export async function list(req, res) {
  const rows = await tagService.listTags();
  return ok(res, rows);
}

export async function create(req, res) {
  const row = await tagService.createTag(req.body || {});
  return ok(res, row);
}

export async function update(req, res) {
  const row = await tagService.updateTag(req.params.id, req.body || {});
  return ok(res, row);
}

export async function remove(req, res) {
  const existing = await tagService.getTagById(req.params.id);
  if (!existing) throw new AppError('NOT_FOUND', 'Tag not found', 404);
  await tagService.deleteTag(req.params.id);
  return ok(res, { id: req.params.id, deleted: true });
}
