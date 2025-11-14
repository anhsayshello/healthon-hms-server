import { LabTestStatus, Prisma } from "@prisma/client";
import prisma from "../../config/db";
import type { SearchQueryParams } from "../../types";
import normalizePagination from "../../utils/normalize-pagination";
import { searchLabTest } from "../../utils/search-filters";

export default async function getLabTestRequests(params: SearchQueryParams) {
  const { query, page, limit } = params;
  const { PAGENUMBER, SKIP, LIMIT } = normalizePagination(page, limit);

  const whereCondition: Prisma.LabTestWhereInput = {
    AND: [
      { status: { in: [LabTestStatus.PENDING, LabTestStatus.IN_PROGRESS] } },
      ...(query?.trim()
        ? [
            {
              OR: [searchLabTest(query)].filter(
                Boolean
              ) as Prisma.LabTestWhereInput[],
            },
          ]
        : []),
    ],
  };

  const [labRequests, totalRecords] = await Promise.all([
    prisma.labTest.findMany({
      where: whereCondition,
      include: {
        medical_record: {
          include: {
            patient: true,
            doctor: true,
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
