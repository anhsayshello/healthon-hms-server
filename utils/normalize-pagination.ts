export default function normalizePagination(page?: string, limit?: string) {
  const PAGENUMBER = !page || Number(page) <= 0 ? 1 : Number(page);
  const LIMIT = Number(limit) || 10;
  const SKIP = (PAGENUMBER - 1) * LIMIT;

  return { PAGENUMBER, LIMIT, SKIP };
}
