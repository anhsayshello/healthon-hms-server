import type { Medication } from "@prisma/client";
import prisma from "../../config/db";
import AppError from "../../utils/app-error";

export default async function createMedication(
  props: Omit<Medication, "id" | "created_at" | "updated_at">
) {
  const { medication_name } = props;

  const existingMedication = await prisma.medication.findUnique({
    where: { medication_name },
  });

  if (existingMedication) {
    throw new AppError(
      `Medication "${existingMedication.medication_name}" already exists with ID #${existingMedication.id}. ` +
        `Please update the existing medication or use a different name.`,
      409
    );
  }

  const newMedication = await prisma.medication.create({
    data: props,
  });

  return newMedication;
}
