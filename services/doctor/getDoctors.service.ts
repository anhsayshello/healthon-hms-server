import prisma from "../../config/db";
import type { SearchQueryParams } from "../../types";
import normalizePagination from "../../utils/normalize-pagination";
import { searchDoctorDirect } from "../../utils/search-filters";

export default async function getDoctors(params: SearchQueryParams) {
  const { page, limit, query } = params;
  const { PAGENUMBER, LIMIT, SKIP } = normalizePagination(page, limit);

  const whereCondition = searchDoctorDirect(query) ?? {};

  const [data, totalRecords] = await Promise.all([
    prisma.doctor.findMany({
      where: whereCondition,
      include: { working_days: true },
      skip: SKIP,
      take: LIMIT,
      orderBy: { created_at: "desc" },
    }),
    prisma.doctor.count({ where: whereCondition }),
  ]);

  return {
    data,
    totalPages: Math.ceil(totalRecords / LIMIT),
    currentPage: PAGENUMBER,
    totalRecords,
  };
}
