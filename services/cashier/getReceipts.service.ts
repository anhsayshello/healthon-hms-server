import { PaymentStatus, Prisma } from "@prisma/client";
import prisma from "../../config/db";
import type { SearchQueryParams } from "../../types";
import normalizePagination from "../../utils/normalize-pagination";
import { searchPatient, searchPaymentFields } from "../../utils/search-filters";

export default async function getReceipts(params: SearchQueryParams) {
  const { query, page, limit } = params;

  const { PAGENUMBER, LIMIT, SKIP } = normalizePagination(page, limit);

  const whereCondition: Prisma.PaymentWhereInput = {
    AND: [
      { status: PaymentStatus.PAID },
      ...(query?.trim()
        ? [
            {
              OR: [searchPaymentFields(query), searchPatient(query)].filter(
                Boolean
              ) as Prisma.PaymentWhereInput[],
            },
          ]
        : []),
    ],
  };

  const [receipts, totalRecords] = await Promise.all([
    prisma.payment.findMany({
      where: whereCondition,
      include: {
        appointment: {
          select: {
            patient: {
              select: {
                first_name: true,
                last_name: true,
                photo_url: true,
                gender: true,
              },
            },
          },
        },
        cashier: {
          select: {
            first_name: true,
            last_name: true,
            photo_url: true,
            department: true,
          },
        },
      },
      skip: SKIP,
      take: LIMIT,
    }),
    prisma.payment.count({
      where: whereCondition,
    }),
  ]);

  const totalPages = Math.ceil(totalRecords / LIMIT);

  return {
    data: receipts,
    totalPages,
    currentPage: PAGENUMBER,
    totalRecords,
  };
}
