import type { Medication } from "@prisma/client";
import prisma from "../../config/db";

export default async function updateMedication(
  id: number,
  props: Omit<Medication, "id" | "created_at" | "updated_at">
) {
  const medication = await prisma.medication.update({
    where: { id },
    data: props,
  });

  return medication;
}
