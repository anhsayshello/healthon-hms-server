/*
  Warnings:

  - You are about to drop the column `medical_id` on the `Diagnosis` table. All the data in the column will be lost.
  - You are about to drop the column `medical_id` on the `LabTest` table. All the data in the column will be lost.
  - You are about to drop the column `medical_id` on the `Prescription` table. All the data in the column will be lost.
  - You are about to drop the column `medical_id` on the `VitalSigns` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[service_id,medical_record_id]` on the table `LabTest` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `medical_record_id` to the `Diagnosis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medical_record_id` to the `LabTest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medical_record_id` to the `Prescription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medical_record_id` to the `VitalSigns` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Diagnosis" DROP CONSTRAINT "Diagnosis_medical_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."LabTest" DROP CONSTRAINT "LabTest_medical_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Prescription" DROP CONSTRAINT "Prescription_medical_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."VitalSigns" DROP CONSTRAINT "VitalSigns_medical_id_fkey";

-- DropIndex
DROP INDEX "public"."LabTest_service_id_medical_id_key";

-- AlterTable
ALTER TABLE "public"."Diagnosis" DROP COLUMN "medical_id",
ADD COLUMN     "medical_record_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."LabTest" DROP COLUMN "medical_id",
ADD COLUMN     "medical_record_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Prescription" DROP COLUMN "medical_id",
ADD COLUMN     "medical_record_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."VitalSigns" DROP COLUMN "medical_id",
ADD COLUMN     "medical_record_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "LabTest_service_id_medical_record_id_key" ON "public"."LabTest"("service_id", "medical_record_id");

-- AddForeignKey
ALTER TABLE "public"."LabTest" ADD CONSTRAINT "LabTest_medical_record_id_fkey" FOREIGN KEY ("medical_record_id") REFERENCES "public"."MedicalRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VitalSigns" ADD CONSTRAINT "VitalSigns_medical_record_id_fkey" FOREIGN KEY ("medical_record_id") REFERENCES "public"."MedicalRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Diagnosis" ADD CONSTRAINT "Diagnosis_medical_record_id_fkey" FOREIGN KEY ("medical_record_id") REFERENCES "public"."MedicalRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Prescription" ADD CONSTRAINT "Prescription_medical_record_id_fkey" FOREIGN KEY ("medical_record_id") REFERENCES "public"."MedicalRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;
