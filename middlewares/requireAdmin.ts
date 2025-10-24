import { getAuth } from "firebase-admin/auth";
import app from "../config/firebase";
import { Role } from "@prisma/client";

export const requireAdmin = async (req, res, next) => {
  const currentUser = await getAuth(app).getUser(req.uid);
  const role = currentUser.customClaims?.role;

  if (role !== Role.ADMIN) {
    return res.status(403).json({ message: "Forbidden: Admin only" });
  }

  next();
};
