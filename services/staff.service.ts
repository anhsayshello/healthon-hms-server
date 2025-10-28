import prisma from "../config/db";
import normalizePagination from "../utils/normalize-pagination";
import { searchStaff, searchStaffDirect } from "../utils/search-filters";

const staffService = {
  async getStaffs(query?: string, page?: number, limit?: number) {
    const { PAGENUMBER, LIMIT, SKIP } = normalizePagination(page, limit);

    const whereCondition = searchStaffDirect(query) || {};

    const [data, totalRecords] = await Promise.all([
      prisma.staff.findMany({
        where: whereCondition,
        skip: SKIP,
        take: LIMIT,
      }),
      prisma.staff.count({ where: whereCondition }),
    ]);

    return {
      data,
      totalPages: Math.ceil(totalRecords / LIMIT),
      currentPage: PAGENUMBER,
      totalRecords,
    };
  },
};

export default staffService;
