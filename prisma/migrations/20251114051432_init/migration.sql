/*
  Warnings:

  - You are about to drop the column `total_price` on the `Prescription` table. All the data in the column will be lost.
  - You are about to drop the column `unit_price` on the `Prescription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Prescription" DROP COLUMN "total_price",
DROP COLUMN "unit_price";
