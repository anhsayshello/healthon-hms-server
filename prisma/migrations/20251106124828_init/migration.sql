-- CreateEnum
CREATE TYPE "public"."Currency" AS ENUM ('VND', 'USD', 'EUR');

-- AlterTable
ALTER TABLE "public"."Service" ADD COLUMN     "currency" "public"."Currency" NOT NULL DEFAULT 'VND';
