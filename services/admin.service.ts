import { type Doctor, Role, Weekday } from "@prisma/client";
import { FirebaseAuthError, getAuth } from "firebase-admin/auth";
import app from "../config/firebase";
import prisma from "../config/db";
import AppError from "../utils/app-error";
import appoitmentService from "./appointment.service";
import getToday from "../utils/utils";

const adminService = {
  async setStaffRole(uid: string, role: Role) {
    const STAFF_ROLES = ["ADMIN", "NURSE", "LAB_TECHNICIAN", "CASHIER"];

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

    return { message: `Assigned role '${role}' to user ${uid}` };
  },
  async setUserAccess(uid: string, disabled: boolean) {
    const user = await getAuth(app).getUser(uid);

    if (user.disabled === disabled) {
      const status = disabled ? "revoked" : "granted";
      throw new AppError(`User access is already ${status}`, 400);
    }

    await getAuth(app).updateUser(uid, { disabled });

    const action = disabled ? "revoked" : "granted";
    return {
      message: `User access has been ${action}`,
      uid,
      disabled,
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
  async deleteUserById(uid: string) {
    try {
      const user = await getAuth(app).getUser(uid);
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

      return { message: `User ${uid} deleted successfully` };
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new AppError("Failed to delete user", 400);
    }
  },
  async getUserById(uid: string) {
    const user = await getAuth(app).getUser(uid);
    const role = user.customClaims?.role;

    let data = null;

    if (role) {
      switch (role) {
        case Role.PATIENT:
          data = await prisma.patient.findUnique({ where: { uid } });
          break;

        case Role.DOCTOR:
          data = await prisma.doctor.findUnique({
            where: { uid },
            include: { working_days: true },
          });
          break;

        case Role.ADMIN:
        case Role.NURSE:
        case Role.LAB_TECHNICIAN:
        case Role.CASHIER:
          data = await prisma.staff.findUnique({ where: { uid } });
          break;

        default:
          throw new AppError(`Unknown role: ${role}`, 400);
      }
    }

    return { data };
  },
  async createNewDoctor(
    working_days: Weekday[],
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
            start_time: "08:00:00",
            close_time: "17:00:00",
          })),
        },
      },
    });

    return { data: newDoctor };
  },

  async getAdminDashboardStatistics() {
    const today = getToday();

    const [totalPatients, totalDoctors, appointments, availableDoctors] =
      await Promise.all([
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
      totalAppointments,
      monthlyData,
    };
  },
};

export default adminService;
