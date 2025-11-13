import type { Prisma } from "@prisma/client";
import type { SearchQueryParams } from "../../types";
import normalizePagination from "../../utils/normalize-pagination";
import prisma from "../../config/db";
import { endOfDay, startOfDay } from "date-fns";

export default async function getTodayMedicalRecords(
  uid: string,
  params: SearchQueryParams
) {
  const { query, page, limit } = params;
  const { PAGENUMBER, LIMIT, SKIP } = normalizePagination(page, limit);

  const today = new Date();

  const whereCondition: Prisma.MedicalRecordWhereInput = {
    created_at: {
      gte: startOfDay(today),
      lte: endOfDay(today),
    },
    ...(uid && { doctor_id: uid }),
    ...(query && {
      OR: [
        {
          patient: {
            first_name: { contains: query, mode: "insensitive" },
          },
        },
        {
          patient: {
            last_name: { contains: query, mode: "insensitive" },
          },
        },
        {
          patient_id: { contains: query, mode: "insensitive" },
        },
      ],
    }),
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
        diagnoses: true,
        lab_tests: true,
      },
      skip: SKIP,
      take: LIMIT,
      orderBy: { id: "asc" },
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
