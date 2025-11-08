/*
  Warnings:

  - A unique constraint covering the columns `[service_id,medical_id]` on the table `LabTest` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "LabTest_service_id_medical_id_key" ON "public"."LabTest"("service_id", "medical_id");
