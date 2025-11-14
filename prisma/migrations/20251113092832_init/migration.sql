/*
  Warnings:

  - You are about to drop the column `lab_request` on the `MedicalRecord` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."MedicalRecord" DROP COLUMN "lab_request";
