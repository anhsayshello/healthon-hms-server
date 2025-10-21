import { Role } from "@prisma/client";
import prisma from "../config/db";
import getToday from "../utils/utils";
import appoitmentService from "./appointment.service";
import AppError from "../utils/app-error";

const doctorService = {
  async getDoctors() {
    const data = await prisma.doctor.findMany({
      include: {
        working_days: true,
      },
    });
    return {
      data,
    };
  },

  async getDoctorInformation(uid: string) {
    const doctor = await prisma.doctor.findUnique({ where: { uid } });
    console.log(doctor);
    if (!doctor) {
      throw new AppError("Doctor data not found", 404);
    }

    return { doctor };
  },

  async getDoctorDashboardStatistics(uid: string) {
    const totalPatients = await prisma.patient.count();
    const totalNurses = await prisma.staff.count({
      where: { role: Role.NURSE },
    });
    const appointments = await prisma.appointment.findMany({
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
      orderBy: { appointment_date: "desc" },
    });

    const today = getToday();
    const availableDoctors = await prisma.doctor.findMany({
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
    });

    const { appointmentCounts, monthlyData } =
      await appoitmentService.processAppointments(appointments);

    const last5Records = appointments.slice(0, 5);
    const totalAppointments = appointments.length;

    return {
      totalPatients,
      totalNurses,
      appointmentCounts,
      last5Records,
      availableDoctors,
      totalAppointments,
      monthlyData,
    };
  },
};

export default doctorService;
