import { AppointmentStatus, Role } from "@prisma/client";
import type { Appointment } from "../types/appointment.type";
import { getMonth, format, startOfYear, endOfMonth } from "date-fns";
import { initializeMonthlyData, isValidStatus } from "../utils/utils";
import AppError from "../utils/app-error";
import prisma from "../config/db";
import { getAuth } from "firebase-admin/auth";
import getRole from "../utils/getRole";

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
        doctor: true,
        patient: true,
      },
    });

    if (!data) {
      throw new AppError("Appointment data not found", 404);
    }

    return { data };
  },

  async createNewAppointment(
    patient_id: string,
    doctor_id: string,
    appointment_date: string,
    time: string,
    type: string,
    note?: string
  ) {
    const targetDate = new Date(appointment_date);
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        patient_id,
        appointment_date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        status: { not: AppointmentStatus.CANCELLED },
      },
    });

    if (existingAppointment) {
      throw new AppError(
        `You already have an appointment on ${targetDate.toLocaleDateString()}.`
      );
    }

    const doctor = await prisma.doctor.findUnique({
      where: { uid: doctor_id },
      select: { first_name: true, last_name: true, working_days: true },
    });

    const dayName = new Date(appointment_date).toLocaleDateString("en-US", {
      weekday: "long",
    });

    const isAvailable = doctor?.working_days.some((item) => {
      console.log(appointment_date);
      return item.day === dayName;
    });

    if (!isAvailable) {
      throw new AppError(
        `Please select a date within the doctor's working schedule.`
      );
    }

    const newAppointment = await prisma.appointment.create({
      data: {
        patient_id,
        doctor_id,
        appointment_date,
        time,
        status: AppointmentStatus.PENDING,
        type,
        note: note ?? null,
      },
    });

    return { data: newAppointment };
  },

  async updateAppointmentById(
    uid: string,
    id: number,
    status: AppointmentStatus,
    reason?: string
  ) {
    const { role, isPatient, isDoctor, isAdmin } = await getRole(uid);

    if (!role) {
      throw new AppError("User role not found", 403);
    }

    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment) {
      throw new AppError("Appointment not found", 404);
    }
    if (appointment.status === AppointmentStatus.COMPLETED) {
      throw new AppError("This appointment has already been completed");
    } else if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new AppError("This appointment has already been cancelled");
    }

    let data = null;

    if (isPatient) {
      if (appointment.patient_id !== uid) {
        throw new AppError(
          "You are not authorized to cancel this appointment.",
          403
        );
      }

      if (status !== AppointmentStatus.CANCELLED) {
        throw new AppError("You can only cancel your appointments.", 400);
      }

      data = await prisma.appointment.update({
        where: { id },
        data: {
          status: AppointmentStatus.CANCELLED,
          reason: reason ?? null,
        },
      });
    } else if (isDoctor) {
      if (appointment.doctor_id !== uid) {
        throw new AppError(
          "You are not authorized to update this appointment.",
          403
        );
      }

      data = await prisma.appointment.update({
        where: { id },
        data: {
          status,
          reason: reason ?? null,
        },
      });
    } else if (isAdmin) {
      data = await prisma.appointment.update({
        where: { id },
        data: {
          status,
          reason: reason ?? null,
        },
      });
    } else {
      throw new AppError("You are not authorized to update appointments.", 403);
    }

    return { data };
  },
};
export default appoitmentService;
