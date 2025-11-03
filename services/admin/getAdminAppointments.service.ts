import type { Prisma } from "@prisma/client";
import normalizePagination from "../../utils/normalize-pagination";
import {
  searchAppointmentFields,
  searchDoctor,
  searchPatient,
} from "../../utils/search-filters";
import prisma from "../../config/db";

export default async function getAdminAppointments(
  query?: string,
  page?: number,
  limit?: number
) {
  const { PAGENUMBER, LIMIT, SKIP } = normalizePagination(page, limit);

  const whereCondition: Prisma.AppointmentWhereInput = {
    ...(query?.trim() && {
      OR: [
        ...searchAppointmentFields(query),
        searchDoctor(query),
        searchPatient(query),
      ].filter(Boolean) as Prisma.AppointmentWhereInput[],
    }),
  };

  const data = await prisma.appointment.findMany({
    where: whereCondition,

    include: {
      patient: {
        select: {
          uid: true,
          email: true,
          first_name: true,
          last_name: true,
          phone: true,
          address: true,
          gender: true,
          photo_url: true,
        },
      },
      doctor: {
        select: {
          uid: true,
          first_name: true,
          last_name: true,
          specialization: true,
          department: true,
          phone: true,
          photo_url: true,
        },
      },
    },
    orderBy: { created_at: "desc" },
    skip: SKIP,
    take: LIMIT,
  });

  const totalRecords = await prisma.appointment.count({
    where: whereCondition,
  });

  const totalPages = Math.ceil(totalRecords / LIMIT);

  return {
    data,
    totalPages,
    currentPage: PAGENUMBER,
    totalRecords,
  };
}
