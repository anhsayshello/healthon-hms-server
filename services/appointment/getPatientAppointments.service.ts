import type { Prisma } from "@prisma/client";
import normalizePagination from "../../utils/normalize-pagination";
import {
  searchAppointmentFields,
  searchDoctor,
} from "../../utils/search-filters";
import prisma from "../../config/db";
import type { AppointmentParams } from "../../types";
import filters from "../../utils/filters";

export default async function getPatientAppointments(
  uid: string,
  params: AppointmentParams
) {
  const { page, limit, query, view, status } = params;
  const { PAGENUMBER, LIMIT, SKIP } = normalizePagination(page, limit);

  const whereCondition: Prisma.AppointmentWhereInput = {
    AND: [
      { patient_id: uid },
      filters(view, status),
      ...(query?.trim()
        ? [
            {
              OR: [
                ...searchAppointmentFields(query),
                searchDoctor(query),
              ].filter(Boolean) as Prisma.AppointmentWhereInput[],
            },
          ]
        : []),
    ],
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
