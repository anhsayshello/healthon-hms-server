import { Prisma, Role } from "@prisma/client";
import prisma from "../config/db";
import getToday from "../utils/utils";
import appoitmentService from "./appointment.service";
import AppError from "../utils/app-error";
import getRole from "../utils/get-role";
import {
  searchAppointmentFields,
  searchDoctor,
  searchDoctorDirect,
  searchPatient,
} from "../utils/search-filters";
import normalizePagination from "../utils/normalize-pagination";

const doctorService = {
  async getDoctors(query?: string, page?: number, limit?: number) {
    const { PAGENUMBER, LIMIT, SKIP } = normalizePagination(page, limit);

    const whereCondition = searchDoctorDirect(query) ?? {};

    const [data, totalRecords] = await Promise.all([
      prisma.doctor.findMany({
        where: whereCondition,
        include: { working_days: true },
        skip: SKIP,
        take: LIMIT,
        orderBy: { created_at: "desc" },
      }),
      prisma.doctor.count({ where: whereCondition }),
    ]);

    return {
      data,
      totalPages: Math.ceil(totalRecords / LIMIT),
      currentPage: PAGENUMBER,
      totalRecords,
    };
  },

  async getDoctorById(uid: string) {
    const data = await prisma.doctor.findUnique({
      where: { uid },
      include: { working_days: true },
    });
    if (!data) {
      throw new AppError("Doctor data not found", 404);
    }

    return { data };
  },

  async getDoctorAppointments(
    uid: string,
    query?: string,
    page?: number,
    limit?: number
  ) {
    const { PAGENUMBER, LIMIT, SKIP } = normalizePagination(page, limit);

    const whereCondition: Prisma.AppointmentWhereInput = {
      doctor_id: uid,
      ...(query?.trim() && {
        OR: [...searchAppointmentFields(query), searchPatient(query)].filter(
          Boolean
        ) as Prisma.AppointmentWhereInput[],
      }),
    };

    const data = await prisma.appointment.findMany({
      where: whereCondition,
      include: {
        patient: {
          select: {
            uid: true,
            email: true,
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
      where: whereCondition,
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
      await appoitmentService.processAppointments(appointments);

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
  },
};

export default doctorService;
