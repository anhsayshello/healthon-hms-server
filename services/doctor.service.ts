import { Role } from "@prisma/client";
import prisma from "../config/db";
import getToday from "../utils/utils";
import appoitmentService from "./appointment.service";
import AppError from "../utils/app-error";
import getRole from "../utils/getRole";

const doctorService = {
  async getDoctors() {
    const data = await prisma.doctor.findMany({
      include: {
        working_days: true,
      },
      orderBy: { created_at: "desc" },
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

  async getDoctorAppointments(
    uid: string,
    query?: string,
    page?: number,
    limit?: number
  ) {
    const PAGENUMBER = !page || page <= 0 ? 1 : page;
    const LIMIT = limit || 10;
    const SKIP = (PAGENUMBER - 1) * LIMIT;

    const whereCondition: any = {
      doctor_id: uid,
    };

    if (query && query.trim()) {
      whereCondition.OR = [
        {
          reason: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          note: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          patient: {
            OR: [
              {
                first_name: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                last_name: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                phone: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                address: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            ],
          },
        },
      ];
    }

    const data = await prisma.appointment.findMany({
      where: whereCondition,

      include: {
        patient: {
          select: {
            uid: true,
            first_name: true,
            last_name: true,
            phone: true,
            address: true,
            gender: true,
            photo_url: true,
          },
        },
        doctor: {
          select: {
            uid: true,
            first_name: true,
            last_name: true,
            specialization: true,
            department: true,
            phone: true,
            photo_url: true,
          },
        },
      },
      orderBy: { created_at: "desc" },
      skip: SKIP,
      take: LIMIT,
    });

    const totalRecords = await prisma.appointment.count({
      where: { doctor_id: uid },
    });

    const totalPages = Math.ceil(totalRecords / LIMIT);

    return {
      data,
      totalPages,
      currentPage: PAGENUMBER,
      totalRecords,
    };
  },

  async getDoctorDashboardStatistics(uid: string) {
    const { isDoctor } = await getRole(uid);
    if (!isDoctor) {
      throw new AppError("You are not authorized to access this resource", 403);
    }

    const today = getToday();

    const [totalPatients, totalNurses, appointments, availableDoctors] =
      await Promise.all([
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
      ]);

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
