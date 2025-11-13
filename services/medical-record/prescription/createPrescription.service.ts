import type { Prescription } from "@prisma/client";
import prisma from "../../../config/db";

export default async function createPrescription(
  props: Omit<Prescription, "id" | "created_at" | "updated_at">
) {
  const prescription = await prisma.prescription.create({
    data: props,
  });

  return prescription;
}
