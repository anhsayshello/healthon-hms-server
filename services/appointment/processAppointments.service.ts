import { getMonth, startOfYear, endOfMonth } from "date-fns";
import { initializeMonthlyData, isValidStatus } from "../../utils/utils";
import type { Appointment, AppointmentStatus } from "@prisma/client";

export default async function processAppointments(appointments: Appointment[]) {
  const monthlyData = initializeMonthlyData();

  const appointmentCounts = appointments.reduce<
    Record<AppointmentStatus, number>
  >(
    (acc, appointment) => {
      const status = appointment.status;

      const appointmentDate = appointment?.appointment_date;

      const monthIndex = getMonth(appointmentDate);

      if (
        appointmentDate >= startOfYear(new Date()) &&
        appointmentDate <= endOfMonth(new Date()) &&
        monthlyData[monthIndex]
      ) {
        monthlyData[monthIndex].appointment += 1;

        if (status === "COMPLETED") {
          monthlyData[monthIndex].completed += 1;
        }
      }

      if (isValidStatus(status)) {
        acc[status] = (acc[status] || 0) + 1;
      }

      return acc;
    },
    {
      PENDING: 0,
      SCHEDULED: 0,
      COMPLETED: 0,
      CANCELLED: 0,
      IN_CONSULTATION: 0,
      CONSULTATION_COMPLETED: 0,
    }
  );
  return { appointmentCounts, monthlyData };
}
