import type { Prescription } from "@prisma/client";
import prisma from "../../../config/db";

export default async function createPrescription(
  props: Omit<Prescription, "id" | "created_at" | "updated_at">
) {
  const medication = await prisma.medication.findUnique({
    where: { id: props.medication_id },
  });
  if (!medication) throw new Error("Medication not found");

  const prescription = await prisma.prescription.create({
    data: props,
  });

  return prescription;
}
