import type { Role } from "@prisma/client";
import { getAuth } from "firebase-admin/auth";
import app from "../config/firebase";
import prisma from "../config/db";

const adminService = {
  async setUserRole(uid: string, role: Role) {
    await getAuth(app).setCustomUserClaims(uid, { role });
    return { message: `Assigned role '${role}' to user ${uid}` };
  },
  async getUsers() {
    const patients = await prisma.patient.findMany();
    const doctors = await prisma.doctor.findMany({
      include: { working_days: true },
    });

    return {
      patients,
      doctors,
    };
  },
};

export default adminService;
