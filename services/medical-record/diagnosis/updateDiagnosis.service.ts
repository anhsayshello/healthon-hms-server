import type { Diagnosis } from "@prisma/client";
import prisma from "../../../config/db";

export default async function updateDiagnosis(
  id: number,
  props: Pick<Diagnosis, "symptoms" | "diagnosis" | "notes" | "follow_up_plan">
) {
  const data = await prisma.diagnosis.update({
    where: { id },
    data: props,
  });

  return data;
}
