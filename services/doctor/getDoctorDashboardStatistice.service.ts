import { Role } from "@prisma/client";
import AppError from "../../utils/app-error";
import getRole from "../../utils/get-role";
import getToday from "../../utils/utils";
import prisma from "../../config/db";
import appointmentService from "../appointment";

export default async function getDoctorDashboardStatistics(uid: string) {
  const { isDoctor } = await getRole(uid);
  if (!isDoctor) {
    throw new AppError("You are not authorized to access this resource", 403);
  }

  const today = getToday();

  const [
    totalPatients,
    totalNurses,
    appointments,
    availableDoctors,
    totalRecords,
  ] = await Promise.all([
    prisma.patient.count(),
    prisma.staff.count({
      where: { role: Role.NURSE },
    }),
    prisma.appointment.findMany({
      where: { doctor_id: uid, appointment_date: { lte: new Date() } },
      include: {
        patient: {
          select: {
            uid: true,
            first_name: true,
            last_name: true,
            gender: true,
            date_of_birth: true,
            photo_url: true,
          },
        },
        doctor: {
          select: {
            uid: true,
            first_name: true,
            last_name: true,
            specialization: true,
            photo_url: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
    }),
    prisma.doctor.findMany({
      where: { working_days: { some: { day: today } } },
      select: {
        uid: true,
        first_name: true,
        last_name: true,
        photo_url: true,
        specialization: true,
        working_days: true,
      },
      take: 6,
    }),
    prisma.appointment.count({
      where: { doctor_id: uid },
    }),
  ]);

  const { appointmentCounts, monthlyData } =
    await appointmentService.processAppointments(appointments);

  const last5Records = appointments.slice(0, 5);
  const totalAppointments = appointments.length;

  return {
    totalPatients,
    totalNurses,
    appointmentCounts,
    last5Records,
    availableDoctors,
    totalRecords,
    totalAppointments,
    monthlyData,
  };
}
