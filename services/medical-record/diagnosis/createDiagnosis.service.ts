import type { Diagnosis } from "@prisma/client";
import prisma from "../../../config/db";

export default async function createDiagnosis(
  uid: string,
  props: Omit<Diagnosis, "id" | "doctor_id" | "created_at" | "updated_at">
) {
  const data = await prisma.diagnosis.create({
    data: {
      ...props,
      doctor_id: uid,
    },
  });

  return data;
}
