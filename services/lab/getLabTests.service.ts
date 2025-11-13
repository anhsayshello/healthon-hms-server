import prisma from "../../config/db";
import type { SearchQueryParams } from "../../types";
import normalizePagination from "../../utils/normalize-pagination";

export default async function getLabTests(params: SearchQueryParams) {
  const { page, limit } = params;
  const { PAGENUMBER, SKIP, LIMIT } = normalizePagination(page, limit);

  const [labTests, totalRecords] = await Promise.all([
    prisma.labTest.findMany({
      include: {
        medical_record: {
          include: {
            patient: true,
            appointment: { include: { doctor: true } },
          },
        },
        technician: true,
        service: true,
      },
      skip: SKIP,
      take: LIMIT,
      orderBy: { created_at: "asc" },
    }),
    prisma.labTest.count(),
  ]);

  const totalPages = Math.ceil(totalRecords / LIMIT);

  return {
    data: labTests,
    totalPages,
    currentPage: PAGENUMBER,
    totalRecords,
  };
}
