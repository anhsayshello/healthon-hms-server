import { type Doctor, Prisma, Role, type Staff, Weekday } from "@prisma/client";
import { FirebaseAuthError, getAuth } from "firebase-admin/auth";
import app from "../config/firebase";
import prisma from "../config/db";
import AppError from "../utils/app-error";
import appoitmentService from "./appointment.service";
import getToday from "../utils/utils";
import {
  searchAppointmentFields,
  searchDoctor,
  searchPatient,
} from "../utils/search-filters";
import normalizePagination from "../utils/normalize-pagination";

const adminService = {
  async createDoctor(
    working_days: Weekday[],
    start_time: string,
    close_time: string,
    doctor: Omit<
      Doctor,
      "uid" | "availability_status" | "created_at" | "updated_at"
    >
  ) {
    const {
      email,
      first_name,
      last_name,
      specialization,
      license_number,
      phone,
      address,
      department,
      photo_url,
      type,
    } = doctor;

    let doctorUid = "";

    try {
      const userRecord = await getAuth(app).createUser({
        email,
        emailVerified: false,
        phoneNumber: phone,
        password: "12345678",
        displayName: `${first_name} ${last_name}`,
        photoURL: photo_url,
        disabled: false,
      });
      doctorUid = userRecord.uid;
      await getAuth(app).setCustomUserClaims(doctorUid, {
        role: Role.DOCTOR,
      });
      console.log(userRecord, "userRecord");
      console.log("Successfully created new user:", userRecord.uid);
    } catch (error) {
      if (error instanceof FirebaseAuthError) {
        console.log(error.message);
        throw new AppError(error.message, 400);
      }
      console.log("Error creating new user:", error);
    }

    const newDoctor = await prisma.doctor.create({
      data: {
        uid: doctorUid,
        email,
        first_name,
        last_name,
        specialization,
        license_number,
        phone,
        address,
        department,
        photo_url,
        type,
        working_days: {
          create: working_days.map((day) => ({
            day,
            start_time,
            close_time,
          })),
        },
      },
    });

    return { data: newDoctor };
  },

  async createStaff(
    props: Omit<Staff, "uid" | "status" | "created_at" | "updated_at">
  ) {
    const {
      email,
      first_name,
      last_name,
      phone,
      address,
      department,
      license_number,
      photo_url,
      role,
    } = props;

    let staffUid = "";

    try {
      const userRecord = await getAuth(app).createUser({
        email,
        emailVerified: false,
        phoneNumber: phone,
        password: "12345678",
        displayName: `${first_name} ${last_name}`,
        photoURL: photo_url,
        disabled: false,
      });
      staffUid = userRecord.uid;
      await getAuth(app).setCustomUserClaims(staffUid, {
        role,
      });

      console.log(userRecord, "userRecord");
      console.log("Successfully created new user:", userRecord.uid);
    } catch (error) {
      if (error instanceof FirebaseAuthError) {
        console.log(error.message);
        throw new AppError(error.message, 400);
      }
      console.log("Error creating new user:", error);
    }

    const newStaff = await prisma.staff.create({
      data: {
        uid: staffUid,
        email,
        first_name,
        last_name,
        phone,
        address,
        department,
        license_number,
        photo_url,
        role,
      },
    });

    return { data: newStaff };
  },

  async getAdminAppointments(query?: string, page?: number, limit?: number) {
    const { PAGENUMBER, LIMIT, SKIP } = normalizePagination(page, limit);

    const whereCondition: Prisma.AppointmentWhereInput = {
      ...(query?.trim() && {
        OR: [
          ...searchAppointmentFields(query),
          searchDoctor(query),
          searchPatient(query),
        ].filter(Boolean) as Prisma.AppointmentWhereInput[],
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

  async getFirebaseUsers(nextPageToken?: string) {
    const listUsersResult = await getAuth(app).listUsers(10, nextPageToken);
    const users = listUsersResult.users;

    return {
      data: users,
      nextPageToken: listUsersResult.pageToken,
    };
  },

  async setStaffRole(uid: string, role: Role) {
    const STAFF_ROLES = ["ADMIN", "NURSE", "LAB_TECHNICIAN", "CASHIER"];
    try {
      if (!STAFF_ROLES.includes(role)) {
        throw new AppError(
          "Invalid staff role. Only ADMIN, NURSE, LAB_TECHNICIAN, and CASHIER are allowed.",
          400
        );
      }
      const staff = await prisma.staff.findUnique({
        where: { uid },
      });

      if (!staff) {
        throw new AppError("User is not staff member.", 404);
      }
      await prisma.staff.update({
        where: { uid },
        data: {
          role,
        },
      });

      await getAuth(app).setCustomUserClaims(uid, { role });

      return { message: `Role '${role}' has been assigned to ${staff.email}.` };
    } catch (error) {
      if (error instanceof FirebaseAuthError) {
        const errorMessage = error.message;
        throw new AppError(errorMessage, 400);
      }
      throw new AppError("Failed to set staff role", 400);
    }
  },

  async setUserAccess(uid: string, disabled: boolean) {
    try {
      const user = await getAuth(app).getUser(uid);
      const email = user.email;

      if (user.disabled === disabled) {
        const status = disabled ? "revoked" : "granted";
        throw new AppError(`User access is already ${status}`, 400);
      }

      await getAuth(app).updateUser(uid, { disabled });
      await prisma.staff.update({
        where: { uid },
        data: {
          status: disabled ? "INACTIVE" : "ACTIVE",
        },
      });

      const action = disabled ? "Disabled" : "Enabled";
      return {
        message: `${action} ${email} `,
      };
    } catch (error) {
      if (error instanceof FirebaseAuthError) {
        const errorMessage = error.message;
        throw new AppError(errorMessage, 400);
      }
      throw new AppError("Failed to set user access", 400);
    }
  },

  async deleteUserById(uid: string) {
    try {
      const user = await getAuth(app).getUser(uid);
      const email = user.email;
      const role = user.customClaims?.role as Role;

      if (role) {
        switch (role) {
          case Role.PATIENT:
            await prisma.patient.deleteMany({ where: { uid } });
            break;
          case Role.DOCTOR:
            await prisma.doctor.deleteMany({ where: { uid } });
            break;
          case Role.ADMIN:
          case Role.NURSE:
          case Role.LAB_TECHNICIAN:
          case Role.CASHIER:
            await prisma.staff.deleteMany({ where: { uid } });
            break;
          default:
            break;
        }
      }

      await getAuth(app).deleteUser(uid);

      return { message: `Deleted ${email}` };
    } catch (error) {
      if (error instanceof FirebaseAuthError) {
        const errorMessage = error.message;
        throw new AppError(errorMessage, 400);
      }
      throw new AppError("Failed to delete user", 400);
    }
  },

  async getAdminDashboardStatistics() {
    const today = getToday();
    const [
      totalPatients,
      totalDoctors,
      appointments,
      availableDoctors,
      totalRecords,
    ] = await Promise.all([
      prisma.patient.count(),
      prisma.doctor.count(),
      prisma.appointment.findMany({
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
      prisma.appointment.count(),
    ]);

    const { appointmentCounts, monthlyData } =
      await appoitmentService.processAppointments(appointments);

    const last5Records = appointments.slice(0, 5);
    const totalAppointments = appointments.length;

    return {
      totalPatients,
      totalDoctors,
      appointmentCounts,
      last5Records,
      availableDoctors,
      totalRecords,
      totalAppointments,
      monthlyData,
    };
  },
};

export default adminService;
