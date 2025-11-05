import type { Prisma } from "@prisma/client";
import normalizePagination from "../../utils/normalize-pagination";
import {
  searchAppointmentFields,
  searchDoctor,
  searchPatient,
} from "../../utils/search-filters";
import prisma from "../../config/db";
import filters from "../../utils/filters";
import type { AppointmentParams } from "../../types";

export default async function getAppointments(params: AppointmentParams) {
  const { page, limit, query, view, status } = params;
  const { PAGENUMBER, LIMIT, SKIP } = normalizePagination(page, limit);

  const whereCondition: Prisma.AppointmentWhereInput = {
    AND: [
      filters(view, status),
      ...(query?.trim()
        ? [
            {
              OR: [
                ...searchAppointmentFields(query),
                searchDoctor(query),
                searchPatient(query),
              ].filter(Boolean) as Prisma.AppointmentWhereInput[],
            },
          ]
        : []),
    ],
  };

  const appointments = await prisma.appointment.findMany({
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
    orderBy: [{ appointment_date: "desc" }, { time: "asc" }],
    skip: SKIP,
    take: LIMIT,
  });

  const totalRecords = await prisma.appointment.count({
    where: whereCondition,
  });

  const totalPages = Math.ceil(totalRecords / LIMIT);

  return {
    data: appointments,
    totalPages,
    currentPage: PAGENUMBER,
    totalRecords,
  };
}
