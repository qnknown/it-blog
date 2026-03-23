import { buildPaginationMeta } from './pagination.js';

export function ok(res, data, meta) {
  if (meta !== undefined) {
    const m =
      typeof meta.total === 'number' && typeof meta.perPage === 'number'
        ? buildPaginationMeta(meta.page, meta.perPage, meta.total)
        : meta;
    return res.json({ data, meta: m });
  }
  return res.json({ data });
}

export function fail(res, code, message, status = 400) {
  return res.status(status).json({
    error: { code, message },
  });
}
