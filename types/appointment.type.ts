import type { AppointmentStatus } from "@prisma/client";

export interface Appointment {
  status: AppointmentStatus;
  appointment_date: Date;
}
