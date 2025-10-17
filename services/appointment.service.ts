import { Role, type AppointmentStatus } from "@prisma/client";
import type { Appointment } from "../types/appointment.type";
import { getMonth, format, startOfYear, endOfMonth } from "date-fns";
import { initializeMonthlyData, isValidStatus } from "../utils/utils";
import AppError from "../utils/app-error";
import prisma from "../config/db";
import { getAuth } from "firebase-admin/auth";

const appoitmentService = {
  async processAppointments(appointments: Appointment[]) {
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
          appointmentDate <= endOfMonth(new Date())
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
      }
    );
    return { appointmentCounts, monthlyData };
  },

  async getAppointmentById(id: number) {
    const data = await prisma.appointment.findUnique({
      where: { id },
      include: {
        doctor: {
          select: {
            uid: true,
            first_name: true,
            last_name: true,
            specialization: true,
            photo_url: true,
          },
        },
        patient: {
          select: {
            uid: true,
            first_name: true,
            last_name: true,
            date_of_birth: true,
            gender: true,
            phone: true,
            address: true,
          },
        },
      },
    });

    if (!data) {
      throw new AppError("Appointment data not found", 404);
    }

    return { data };
  },

  async updateAppointmentById(
    uid: string,
    id: number,
    status: AppointmentStatus,
    reason: string
  ) {
    const currentUser = await getAuth().getUser(uid);
    const isAdmin = currentUser.customClaims?.role === Role.ADMIN;
    if (!isAdmin) {
      throw new AppError("You are not authorized to update appointments.", 403);
    }

    const data = await prisma.appointment.update({
      where: { id },
      data: {
        status: status,
        reason: reason,
      },
    });

    if (!data) {
      throw new AppError("Appointment data not found", 404);
    }

    return { data };
  },
};
export default appoitmentService;
