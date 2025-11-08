/*
  Warnings:

  - You are about to drop the column `patient_id` on the `Diagnosis` table. All the data in the column will be lost.
  - You are about to drop the column `patient_id` on the `VitalSigns` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Diagnosis" DROP COLUMN "patient_id";

-- AlterTable
ALTER TABLE "public"."VitalSigns" DROP COLUMN "patient_id";

-- AddForeignKey
ALTER TABLE "public"."MedicalRecord" ADD CONSTRAINT "MedicalRecord_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."Doctor"("uid") ON DELETE CASCADE ON UPDATE CASCADE;
