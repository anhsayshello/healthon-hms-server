import type { Prescription } from "@prisma/client";
import prisma from "../../../config/db";

export default async function updatePrescription(
  id: number,
  props: Omit<
    Prescription,
    "id" | "medical_record_id" | "medication_id" | "created_at" | "updated_at"
  >
) {
  const prescription = await prisma.prescription.update({
    where: { id },
    data: props,
  });

  return prescription;
}
