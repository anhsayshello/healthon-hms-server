import { getAuth } from "firebase-admin/auth";
import AppError from "../utils/app-error";
import prisma from "../config/db";
import admin from "../config/firebase";
import { Role } from "@prisma/client";
import type { Patient } from "../types/patient.type";
import appoitmentService from "./appointment.service";
import getToday from "../utils/utils";

const patientService = {
  async getPatientInfomation(uid: string) {
    const patient = await prisma.patient.findUnique({ where: { uid } });
    console.log(patient);
    if (!patient) {
      throw new AppError("Patient data not found", 404);
    }

    return {
      data: patient,
    };
  },
  async getPatientDashboardStatistics(uid: string) {
    const patient = await prisma.patient.findUnique({
      where: { uid },
      select: {
        uid: true,
        first_name: true,
        last_name: true,
        gender: true,
        photo_url: true,
      },
    });
    if (!patient) {
      throw new AppError("Patient data not found", 404);
    }

    const appointments = await prisma.appointment.findMany({
      where: { patient_id: uid },
      include: {
        doctor: {
          select: {
            uid: true,
            first_name: true,
            last_name: true,
            photo_url: true,
            specialization: true,
          },
        },
        patient: {
          select: {
            uid: true,
            first_name: true,
            last_name: true,
            photo_url: true,
            gender: true,
          },
        },
      },
      orderBy: { appointment_date: "desc" },
    });

    const { appointmentCounts, monthlyData } =
      await appoitmentService.processAppointments(appointments);

    const last5Records = appointments.slice(0, 5);
    const today = getToday();
    const availableDoctor = await prisma.doctor.findMany({
      select: {
        uid: true,
        first_name: true,
        last_name: true,
        photo_url: true,
        specialization: true,
        working_days: true,
      },
      where: {
        working_days: {
          some: {
            day: {
              equals: today as string,
              mode: "insensitive",
            },
          },
        },
      },
      take: 6,
    });
    console.log(availableDoctor, "available doctor");

    return {
      data: patient,
      appointmentCounts,
      last5Records,
      totalAppointments: appointments.length,
      availableDoctor,
      monthlyData,
    };
  },
  async getPatientAppointments(
    uid: string,
    query?: string,
    page?: number,
    limit?: number
  ) {
    const PAGENUMBER = !page || page <= 0 ? 1 : page;
    const LIMIT = limit || 10;
    const SKIP = (PAGENUMBER - 1) * LIMIT;

    const whereCondition: any = {
      patient_id: uid,
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
          doctor: {
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
                specialization: {
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
      orderBy: { appointment_date: "desc" },
      skip: SKIP,
      take: LIMIT,
    });

    const totalRecords = await prisma.appointment.count({
      where: { patient_id: uid },
    });

    const totalPages = Math.ceil(totalRecords / LIMIT);

    return {
      data,
      totalPages,
      currentPage: PAGENUMBER,
      totalRecords,
    };
  },

  async upsertPatient({
    uid,
    email,
    first_name,
    last_name,
    date_of_birth,
    gender,
    phone,
    marital_status,
    address,
    emergency_contact_name,
    emergency_contact_number,
    relation,
    blood_group,
    allergies,
    medical_conditions,
    medical_history,
    insurance_provider,
    insurance_number,
    privacy_consent,
    service_consent,
    medical_consent,
  }: Patient) {
    let user;
    try {
      user = await getAuth().getUser(uid);
    } catch {
      throw new AppError("User not found", 404);
    }

    const existingPatient = await prisma.patient.findUnique({ where: { uid } });
    if (!existingPatient && !user?.customClaims?.role) {
      await admin.auth().setCustomUserClaims(uid, { role: Role.PATIENT });
    }

    const data = {
      first_name: first_name,
      last_name: last_name,
      email,
      date_of_birth: date_of_birth,
      gender,
      phone,
      marital_status: marital_status,
      address,
      emergency_contact_name: emergency_contact_name,
      emergency_contact_number: emergency_contact_number,
      relation,
      blood_group: blood_group,
      allergies,
      medical_conditions: medical_conditions,
      medical_history: medical_history,
      insurance_provider: insurance_provider,
      insurance_number: insurance_number,
      privacy_consent: privacy_consent,
      service_consent: service_consent,
      medical_consent: medical_consent,
    };

    const patient = await prisma.patient.upsert({
      where: {
        uid,
      },
      update: data,
      create: {
        uid,
        ...data,
      },
    });
    console.log(patient);

    return {
      role: Role.PATIENT,
      data: patient,
    };
  },
};

export default patientService;
