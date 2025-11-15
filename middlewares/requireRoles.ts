import { getAuth } from "firebase-admin/auth";
import app from "../config/firebase";
import { Role } from "@prisma/client";
import type { Request, Response, NextFunction } from "express";

const requireRoles = (allowedRoles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const currentUser = await getAuth(app).getUser(req.uid);
    const role = currentUser.customClaims?.role as Role;

    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({
        message: "Forbidden: Access denied",
      });
    }
    next();
  };
};

export const requireAdmin = requireRoles([Role.ADMIN]);
export const requireDoctor = requireRoles([Role.DOCTOR]);
export const requireNurse = requireRoles([Role.NURSE]);
export const requireLabTechnician = requireRoles([Role.LAB_TECHNICIAN]);
export const requireCashier = requireRoles([Role.CASHIER]);
export const requireStaff = requireRoles([
  Role.ADMIN,
  Role.NURSE,
  Role.LAB_TECHNICIAN,
  Role.CASHIER,
]);

export const requireAdminOrCashier = requireRoles([Role.ADMIN, Role.CASHIER]);
