/*
  Warnings:

  - Added the required column `subtotal` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Payment" ADD COLUMN     "subtotal" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "amount_paid" SET DEFAULT 0;
