import {
  AppointmentStatus,
  LabTestStatus,
  PaymentStatus,
  Prisma,
} from "@prisma/client";
import prisma from "../../config/db";
import type { SearchQueryParams } from "../../types";
import normalizePagination from "../../utils/normalize-pagination";

export default async function getAppointmentsForPayment(
  params: SearchQueryParams
) {
  const { page, limit } = params;
  const { PAGENUMBER, LIMIT, SKIP } = normalizePagination(page, limit);

  const whereCondition: Prisma.AppointmentWhereInput = {
    status: AppointmentStatus.CONSULTATION_COMPLETED,
    medical_records: {
      some: {
        OR: [
          { prescriptions: { some: {} } },
          { lab_tests: { some: { status: LabTestStatus.COMPLETED } } },
        ],
      },
    },
    OR: [{ payment: null }, { payment: { status: PaymentStatus.UNPAID } }],
  };

  const [appointmentsForPayment, totalRecords] = await Promise.all([
    prisma.appointment.findMany({
      where: whereCondition,
      select: {
        id: true,
        appointment_date: true,
        time: true,
        status: true,
        type: true,
        patient: {
          select: {
            first_name: true,
            last_name: true,
            photo_url: true,
            gender: true,
          },
        },
        medical_records: {
          select: {
            id: true,
            lab_tests: {
              where: {
                status: LabTestStatus.COMPLETED,
              },
              select: { id: true },
            },
            prescriptions: {
              select: { id: true },
            },
          },
        },
        payment: { select: { id: true, status: true } },
      },
      skip: SKIP,
      take: LIMIT,
    }),
    prisma.appointment.count({
      where: whereCondition,
    }),
  ]);

  const totalPages = Math.ceil(totalRecords / LIMIT);

  return {
    data: appointmentsForPayment,
    totalPages,
    currentPage: PAGENUMBER,
    totalRecords,
  };
}
