import prisma from "../../config/db";
import type { SearchQueryParams } from "../../types";
import normalizePagination from "../../utils/normalize-pagination";

export default async function getLabServices(params: SearchQueryParams) {
  const { page, limit } = params;
  const { PAGENUMBER, SKIP, LIMIT } = normalizePagination(page, limit);

  const [services, totalRecords] = await Promise.all([
    prisma.service.findMany({
      skip: SKIP,
      take: LIMIT,
    }),
    prisma.service.count({}),
  ]);

  const totalPages = Math.ceil(totalRecords / LIMIT);

  return {
    data: services,
    totalPages,
    currentPage: PAGENUMBER,
    totalRecords,
  };
}
