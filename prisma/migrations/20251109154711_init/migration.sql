/*
  Warnings:

  - A unique constraint covering the columns `[medication_name]` on the table `Medication` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[service_name]` on the table `Service` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Medication_medication_name_key" ON "public"."Medication"("medication_name");

-- CreateIndex
CREATE UNIQUE INDEX "Service_service_name_key" ON "public"."Service"("service_name");
