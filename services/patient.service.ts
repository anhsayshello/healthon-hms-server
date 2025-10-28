import { getAuth } from "firebase-admin/auth";
import AppError from "../utils/app-error";
import prisma from "../config/db";
import { Role, type Patient } from "@prisma/client";
import appoitmentService from "./appointment.service";
import getToday from "../utils/utils";
import app from "../config/firebase";
import getRole from "../utils/get-role";
import {
  searchAppointmentFields,
  searchDoctor,
  searchPatient,
  searchPatientDirect,
} from "../utils/search-filters";
import normalizePagination from "../utils/normalize-pagination";

const patientService = {
  async upsertPatient(uid: string, props: Omit<Patient, "uid">) {
    const {
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
    } = props;
    let user;
    try {
      user = await getAuth().getUser(uid);
    } catch {
      throw new AppError("User not found", 404);
    }

    const existingPatient = await prisma.patient.findUnique({ where: { uid } });
    if (!existingPatient && !user?.customClaims?.role) {
      await getAuth(app).setCustomUserClaims(uid, { role: Role.PATIENT });
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

  async getPatients(query?: string, page?: number, limit?: number) {
    const { PAGENUMBER, LIMIT, SKIP } = normalizePagination(page, limit);

    const whereCondition = searchPatientDirect(query) || {};

    const [data, totalRecords] = await Promise.all([
      prisma.patient.findMany({
        where: whereCondition,
        skip: SKIP,
        take: LIMIT,
      }),
      prisma.patient.count({ where: whereCondition }),
    ]);

    return {
      data,
      totalPages: Math.ceil(totalRecords / LIMIT),
      currentPage: PAGENUMBER,
      totalRecords,
    };
  },

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
    const { isPatient } = await getRole(uid);
    if (!isPatient) {
      throw new AppError("You are not authorized to access this resource", 403);
    }

    const today = getToday();
    const [patient, appointments, availableDoctors] = await Promise.all([
      prisma.patient.findUnique({
        where: { uid },
        select: {
          uid: true,
          first_name: true,
          last_name: true,
          gender: true,
          photo_url: true,
        },
      }),
      prisma.appointment.findMany({
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
              gender: true,
              photo_url: true,
            },
          },
        },
        orderBy: { created_at: "desc" },
      }),
      prisma.doctor.findMany({
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
              day: today,
            },
          },
        },
        take: 6,
      }),
    ]);

    const { appointmentCounts, monthlyData } =
      await appoitmentService.processAppointments(appointments);

    const last5Records = appointments.slice(0, 5);
    const totalAppointments = appointments.length;

    return {
      data: patient,
      appointmentCounts,
      last5Records,
      totalAppointments,
      availableDoctors,
      monthlyData,
    };
  },

  async getPatientAppointments(
    uid: string,
    query?: string,
    page?: number,
    limit?: number
  ) {
    const { PAGENUMBER, LIMIT, SKIP } = normalizePagination(page, limit);

    const whereCondition: any = {
      patient_id: uid,
    };

    if (query?.trim()) {
      const searchConditions = [
        ...searchAppointmentFields(query),
        searchDoctor(query),
      ].filter(Boolean);

      whereCondition.OR = searchConditions;
    }

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
};

export default patientService;
