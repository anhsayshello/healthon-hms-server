import { AppointmentStatus, Prisma } from "@prisma/client";
import prisma from "../../config/db";
import getToday from "../../utils/utils";
import type { SearchQueryParams } from "../../types";
import normalizePagination from "../../utils/normalize-pagination";
import { searchPatient } from "../../utils/search-filters";
import { endOfDay, startOfDay } from "date-fns";

export default async function getTodayVitalSigns(params: SearchQueryParams) {
  const { query, limit, page } = params;

  const { PAGENUMBER, LIMIT, SKIP } = normalizePagination(page, limit);

  const today = new Date();

  const whereCondition: Prisma.AppointmentWhereInput = {
    appointment_date: {
      gte: startOfDay(today),
      lte: endOfDay(today),
    },
    status: AppointmentStatus.SCHEDULED,
    ...(query?.trim() && {
      OR: [searchPatient(query)].filter(
        Boolean
      ) as Prisma.AppointmentWhereInput[],
    }),
  };

  const [appointments, totalRecords] = await Promise.all([
    prisma.appointment.findMany({
      where: whereCondition,
      include: {
        patient: {
          select: {
            uid: true,
            first_name: true,
            last_name: true,
            date_of_birth: true,
            gender: true,
            phone: true,
            address: true,
            photo_url: true,
            allergies: true,
            medical_conditions: true,
          },
        },
        doctor: {
          select: {
            uid: true,
            first_name: true,
            last_name: true,
            photo_url: true,
            specialization: true,
          },
        },
        medical: {
          select: {
            id: true,
            vital_signs: {
              select: {
                id: true,
              },
              take: 1,
            },
          },
        },
      },
      skip: SKIP,
      take: LIMIT,
      orderBy: { time: "asc" },
    }),
    prisma.appointment.count({
      where: whereCondition,
    }),
  ]);

  const totalPages = Math.ceil(totalRecords / LIMIT);

  return {
    data: appointments,
    totalPages,
    currentPage: PAGENUMBER,
    totalRecords,
  };
}
