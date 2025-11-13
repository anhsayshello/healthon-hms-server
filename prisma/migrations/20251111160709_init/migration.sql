-- AlterTable
ALTER TABLE "public"."Medication" ADD COLUMN     "currency" "public"."Currency" NOT NULL DEFAULT 'VND';
