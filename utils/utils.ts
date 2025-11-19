import { Weekday, type AppointmentStatus } from "@prisma/client";
import { format, getMonth } from "date-fns";
import type { Request } from "express";

export const getTokenFrom = (req: Request) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    return authorization.replace("Bearer ", "");
  }
  return null;
};

export function isValidStatus(status: string): status is AppointmentStatus {
  return ["PENDING", "SCHEDULED", "COMPLETED", "CANCELLED"].includes(status);
}

export const initializeMonthlyData = () => {
  const thisYear = new Date().getFullYear();

  const months = Array.from(
    { length: getMonth(new Date()) + 1 },
    (_, index) => ({
      month: format(new Date(thisYear, index), "MMM"),
      appointment: 0,
      completed: 0,
    })
  );

  return months;
};

export default function getToday() {
  const dayIndex = new Date().getDay();

  const map: Weekday[] = [
    Weekday.SUNDAY,
    Weekday.MONDAY,
    Weekday.TUESDAY,
    Weekday.WEDNESDAY,
    Weekday.THURSDAY,
    Weekday.FRIDAY,
    Weekday.SATURDAY,
  ];

  return map[dayIndex] as Weekday;
}

export function formatNumber(value: number) {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: 2,
  });
}
