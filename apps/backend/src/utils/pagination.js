export function parsePagination(query) {
  const page = Math.max(1, parseInt(String(query.page || '1'), 10) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(String(query.limit || '10'), 10) || 10));
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  return { page, limit, from, to };
}

export function buildPaginationMeta(page, perPage, total) {
  const totalPages = perPage > 0 && total > 0 ? Math.ceil(total / perPage) : total === 0 ? 0 : 1;
  return { page, perPage, total, totalPages };
}
