import prisma from "../../config/db";
import normalizePagination from "../../utils/normalize-pagination";
import { searchPatientDirect } from "../../utils/search-filters";

export default async function getPatients(
  query?: string,
  page?: number,
  limit?: number
) {
  const { PAGENUMBER, LIMIT, SKIP } = normalizePagination(page, limit);

  const whereCondition = searchPatientDirect(query) ?? {};

  const [data, totalRecords] = await Promise.all([
    prisma.patient.findMany({
      where: whereCondition,
      skip: SKIP,
      take: LIMIT,
      orderBy: { created_at: "desc" },
    }),
    prisma.patient.count({ where: whereCondition }),
  ]);

  return {
    data,
    totalPages: Math.ceil(totalRecords / LIMIT),
    currentPage: PAGENUMBER,
    totalRecords,
  };
}
