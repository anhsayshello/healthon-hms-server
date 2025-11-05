/*
  Warnings:

  - You are about to drop the column `oxygen_saturaion` on the `VitalSigns` table. All the data in the column will be lost.
  - You are about to drop the `MedicalRecords` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Diagnosis" DROP CONSTRAINT "Diagnosis_medical_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."LabTest" DROP CONSTRAINT "LabTest_record_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."MedicalRecords" DROP CONSTRAINT "MedicalRecords_appointment_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."MedicalRecords" DROP CONSTRAINT "MedicalRecords_patient_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."VitalSigns" DROP CONSTRAINT "VitalSigns_medical_id_fkey";

-- AlterTable
ALTER TABLE "public"."VitalSigns" DROP COLUMN "oxygen_saturaion",
ADD COLUMN     "oxygen_saturation" INTEGER;

-- DropTable
DROP TABLE "public"."MedicalRecords";

-- CreateTable
CREATE TABLE "public"."MedicalRecord" (
    "id" SERIAL NOT NULL,
    "patient_id" TEXT NOT NULL,
    "appointment_id" INTEGER NOT NULL,
    "doctor_id" TEXT NOT NULL,
    "treatment_plan" TEXT,
    "prescriptions" TEXT,
    "lab_request" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicalRecord_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."LabTest" ADD CONSTRAINT "LabTest_record_id_fkey" FOREIGN KEY ("record_id") REFERENCES "public"."MedicalRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MedicalRecord" ADD CONSTRAINT "MedicalRecord_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "public"."Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MedicalRecord" ADD CONSTRAINT "MedicalRecord_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."Patient"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VitalSigns" ADD CONSTRAINT "VitalSigns_medical_id_fkey" FOREIGN KEY ("medical_id") REFERENCES "public"."MedicalRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Diagnosis" ADD CONSTRAINT "Diagnosis_medical_id_fkey" FOREIGN KEY ("medical_id") REFERENCES "public"."MedicalRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;
