import { LabTestStatus } from "@prisma/client";
import prisma from "../../config/db";
import type { SearchQueryParams } from "../../types";
import normalizePagination from "../../utils/normalize-pagination";

export default async function getLabTestRequests(params: SearchQueryParams) {
  const { page, limit } = params;
  const { PAGENUMBER, SKIP, LIMIT } = normalizePagination(page, limit);

  const whereCondition = {
    status: { in: [LabTestStatus.PENDING, LabTestStatus.IN_PROGRESS] },
  };

  const [labRequests, totalRecords] = await Promise.all([
    prisma.labTest.findMany({
      where: whereCondition,
      include: {
        medical_record: {
          include: {
            patient: true,
            appointment: { include: { doctor: true } },
          },
        },
        service: true,
      },
      skip: SKIP,
      take: LIMIT,
      orderBy: { created_at: "asc" },
    }),
    prisma.labTest.count({
      where: whereCondition,
    }),
  ]);

  const totalPages = Math.ceil(totalRecords / LIMIT);

  return {
    data: labRequests,
    totalPages,
    currentPage: PAGENUMBER,
    totalRecords,
  };
}
