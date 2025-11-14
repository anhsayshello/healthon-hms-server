import type { Prisma } from "@prisma/client";
import prisma from "../../config/db";
import type { SearchQueryParams } from "../../types";
import normalizePagination from "../../utils/normalize-pagination";
import { searchServiceDirect } from "../../utils/search-filters";

export default async function getLabServices(params: SearchQueryParams) {
  const { query, page, limit } = params;
  const { PAGENUMBER, SKIP, LIMIT } = normalizePagination(page, limit);

  const whereCondition: Prisma.ServiceWhereInput = {
    ...(query?.trim()
      ? {
          OR: [searchServiceDirect(query)].filter(
            Boolean
          ) as Prisma.ServiceWhereInput[],
        }
      : {}),
  };

  const [services, totalRecords] = await Promise.all([
    prisma.service.findMany({
      where: whereCondition,
      skip: SKIP,
      take: LIMIT,
    }),
    prisma.service.count({ where: whereCondition }),
  ]);

  const totalPages = Math.ceil(totalRecords / LIMIT);

  return {
    data: services,
    totalPages,
    currentPage: PAGENUMBER,
    totalRecords,
  };
}
