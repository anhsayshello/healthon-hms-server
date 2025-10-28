export default function normalizePagination(page?: number, limit?: number) {
  const PAGENUMBER = !page || page <= 0 ? 1 : page;
  const LIMIT = limit || 10;
  const SKIP = (PAGENUMBER - 1) * LIMIT;

  return { PAGENUMBER, LIMIT, SKIP };
}
