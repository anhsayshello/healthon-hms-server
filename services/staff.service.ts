import prisma from "../config/db";
import AppError from "../utils/app-error";
import normalizePagination from "../utils/normalize-pagination";
import { searchStaffDirect } from "../utils/search-filters";

const staffService = {
  async getStaffs(query?: string, page?: number, limit?: number) {
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
  },

  async getStaffById(uid: string) {
    const data = await prisma.staff.findUnique({ where: { uid } });
    if (!data) {
      throw new AppError("Staff data not found", 404);
    }

    return { data };
  },
};

export default staffService;
