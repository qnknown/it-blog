import { AppError } from '../utils/AppError.js';
import { ok } from '../utils/response.js';
import * as categoryService from '../services/categoryService.js';

export async function list(req, res) {
  const rows = await categoryService.listCategories();
  return ok(res, rows);
}

export async function create(req, res) {
  const row = await categoryService.createCategory(req.body || {});
  return ok(res, row);
}

export async function update(req, res) {
  const row = await categoryService.updateCategory(req.params.id, req.body || {});
  return ok(res, row);
}

export async function remove(req, res) {
  const existing = await categoryService.getCategoryById(req.params.id);
  if (!existing) throw new AppError('NOT_FOUND', 'Category not found', 404);
  await categoryService.deleteCategory(req.params.id);
  return ok(res, { id: req.params.id, deleted: true });
}
