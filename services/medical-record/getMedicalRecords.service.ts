import type { Prisma } from "@prisma/client";
import type { SearchQueryParams } from "../../types";
import normalizePagination from "../../utils/normalize-pagination";
import prisma from "../../config/db";
import { searchDoctor, searchPatient } from "../../utils/search-filters";

export default async function getMedicalRecords(params: SearchQueryParams) {
  const { query, page, limit } = params;
  const { PAGENUMBER, LIMIT, SKIP } = normalizePagination(page, limit);

  const whereCondition: Prisma.MedicalRecordWhereInput = {
    ...(query?.trim()
      ? {
          OR: [searchPatient(query), searchDoctor(query)].filter(
            Boolean
          ) as Prisma.MedicalRecordWhereInput[],
        }
      : {}),
  };

  const [patients, totalRecords] = await Promise.all([
    prisma.medicalRecord.findMany({
      where: whereCondition,
      include: {
        patient: {
          select: {
            first_name: true,
            last_name: true,
            photo_url: true,
            gender: true,
          },
        },
        doctor: {
          select: {
            first_name: true,
            last_name: true,
            photo_url: true,
            specialization: true,
          },
        },
        appointment: { select: { status: true } },
      },
      skip: SKIP,
      take: LIMIT,
      orderBy: { created_at: "desc" },
    }),
    prisma.medicalRecord.count({ where: whereCondition }),
  ]);

  const totalPages = Math.ceil(totalRecords / LIMIT);

  return {
    data: patients,
    totalPages,
    currentPage: PAGENUMBER,
    totalRecords,
  };
}
