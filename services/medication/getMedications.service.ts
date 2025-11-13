import prisma from "../../config/db";
import type { SearchQueryParams } from "../../types";
import normalizePagination from "../../utils/normalize-pagination";

export default async function getMedications(params: SearchQueryParams) {
  const { page, limit } = params;
  const { PAGENUMBER, SKIP, LIMIT } = normalizePagination(page, limit);

  const [medications, totalRecords] = await Promise.all([
    prisma.medication.findMany({
      skip: SKIP,
      take: LIMIT,
    }),
    prisma.medication.count(),
  ]);

  const totalPages = Math.ceil(totalRecords / LIMIT);

  return {
    data: medications,
    totalPages,
    currentPage: PAGENUMBER,
    totalRecords,
  };
}
