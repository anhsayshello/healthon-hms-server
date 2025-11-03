import prisma from "../../config/db";
import normalizePagination from "../../utils/normalize-pagination";
import { searchStaffDirect } from "../../utils/search-filters";

export default async function getStaffs(
  query?: string,
  page?: number,
  limit?: number
) {
  const { PAGENUMBER, LIMIT, SKIP } = normalizePagination(page, limit);

  const whereCondition = searchStaffDirect(query) ?? {};

  const [data, totalRecords] = await Promise.all([
    prisma.staff.findMany({
      where: whereCondition,
      skip: SKIP,
      take: LIMIT,
      orderBy: { created_at: "desc" },
    }),
    prisma.staff.count({ where: whereCondition }),
  ]);

  return {
    data,
    totalPages: Math.ceil(totalRecords / LIMIT),
    currentPage: PAGENUMBER,
    totalRecords,
  };
}
