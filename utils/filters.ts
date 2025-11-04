import { AppointmentStatus, Prisma } from "@prisma/client";
import { startOfDay, endOfDay } from "date-fns";

export default function filters(
  view?: string,
  status?: string
): Prisma.AppointmentWhereInput {
  const now = new Date();

  const where: Prisma.AppointmentWhereInput = {};

  if (view?.toLowerCase() === "today") {
    where.appointment_date = {
      gte: startOfDay(now),
      lte: endOfDay(now),
    };
  }

  const statusMap: Record<string, AppointmentStatus> = {
    pending: AppointmentStatus.PENDING,
    scheduled: AppointmentStatus.SCHEDULED,
    cancelled: AppointmentStatus.CANCELLED,
    completed: AppointmentStatus.COMPLETED,
  };

  const normalizedStatus = status?.toLowerCase() ?? "";
  if (statusMap[normalizedStatus]) {
    where.status = statusMap[normalizedStatus];
  }

  return where;
}
