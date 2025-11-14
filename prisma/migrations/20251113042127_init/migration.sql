-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'NURSE', 'DOCTOR', 'LAB_TECHNICIAN', 'PATIENT', 'CASHIER');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('ACTIVE', 'INACTIVE', 'DORMANT');

-- CreateEnum
CREATE TYPE "public"."JobType" AS ENUM ('FULL', 'PART');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "public"."AppointmentStatus" AS ENUM ('PENDING', 'SCHEDULED', 'IN_CONSULTATION', 'CONSULTATION_COMPLETED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "public"."LabTestStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "public"."Weekday" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- CreateEnum
CREATE TYPE "public"."Currency" AS ENUM ('VND', 'USD', 'EUR');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('CASH', 'CARD', 'BANK_TRANSFER');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PAID', 'UNPAID', 'PARTIALLY_PAID', 'REFUNDED');

-- CreateTable
CREATE TABLE "public"."Patient" (
    "uid" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "date_of_birth" TIMESTAMP(3) NOT NULL,
    "gender" "public"."Gender" NOT NULL DEFAULT 'MALE',
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "marital_status" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "emergency_contact_name" TEXT NOT NULL,
    "emergency_contact_number" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "blood_group" TEXT,
    "allergies" TEXT,
    "medical_conditions" TEXT,
    "medical_history" TEXT,
    "insurance_provider" TEXT,
    "insurance_number" TEXT,
    "privacy_consent" BOOLEAN NOT NULL,
    "service_consent" BOOLEAN NOT NULL,
    "medical_consent" BOOLEAN NOT NULL,
    "photo_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "public"."Doctor" (
    "uid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "specialization" TEXT NOT NULL,
    "license_number" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "department" TEXT,
    "photo_url" TEXT,
    "availability_status" TEXT,
    "type" "public"."JobType" NOT NULL DEFAULT 'FULL',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Doctor_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "public"."WorkingDay" (
    "id" SERIAL NOT NULL,
    "doctor_id" TEXT NOT NULL,
    "day" "public"."Weekday" NOT NULL,
    "start_time" TEXT NOT NULL,
    "close_time" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkingDay_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Staff" (
    "uid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "department" TEXT,
    "license_number" TEXT,
    "photo_url" TEXT,
    "role" "public"."Role" NOT NULL,
    "status" "public"."Status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Staff_pkey" PRIMARY KEY ("uid")
);

-- CreateTable
CREATE TABLE "public"."Appointment" (
    "id" SERIAL NOT NULL,
    "patient_id" TEXT NOT NULL,
    "doctor_id" TEXT NOT NULL,
    "appointment_date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "status" "public"."AppointmentStatus" NOT NULL DEFAULT 'PENDING',
    "type" TEXT NOT NULL,
    "note" TEXT,
    "reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Payment" (
    "id" SERIAL NOT NULL,
    "patient_id" TEXT NOT NULL,
    "appointment_id" INTEGER NOT NULL,
    "bill_date" TIMESTAMP(3) NOT NULL,
    "payment_date" TIMESTAMP(3),
    "discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "amount_paid" DOUBLE PRECISION NOT NULL,
    "cashier_id" TEXT,
    "notes" TEXT,
    "refund_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "change_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "payment_method" "public"."PaymentMethod" NOT NULL DEFAULT 'CASH',
    "status" "public"."PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "receipt_number" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PaymentHistory" (
    "id" SERIAL NOT NULL,
    "payment_id" INTEGER NOT NULL,
    "previous_status" "public"."PaymentStatus" NOT NULL,
    "new_status" "public"."PaymentStatus" NOT NULL,
    "changed_by" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LabBill" (
    "id" SERIAL NOT NULL,
    "payment_id" INTEGER NOT NULL,
    "service_id" INTEGER NOT NULL,
    "service_date" TIMESTAMP(3) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_cost" DOUBLE PRECISION NOT NULL,
    "total_cost" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LabBill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Service" (
    "id" SERIAL NOT NULL,
    "service_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" "public"."Currency" NOT NULL DEFAULT 'VND',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LabTest" (
    "id" SERIAL NOT NULL,
    "service_id" INTEGER NOT NULL,
    "medical_record_id" INTEGER NOT NULL,
    "technician_id" TEXT,
    "test_date" TIMESTAMP(3) NOT NULL,
    "result" TEXT,
    "status" "public"."LabTestStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LabTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MedicalRecord" (
    "id" SERIAL NOT NULL,
    "patient_id" TEXT NOT NULL,
    "appointment_id" INTEGER NOT NULL,
    "doctor_id" TEXT NOT NULL,
    "treatment_plan" TEXT,
    "lab_request" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedicalRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VitalSigns" (
    "id" SERIAL NOT NULL,
    "medical_record_id" INTEGER NOT NULL,
    "body_temperature" DOUBLE PRECISION NOT NULL,
    "systolic" INTEGER NOT NULL,
    "diastolic" INTEGER NOT NULL,
    "heart_rate" INTEGER NOT NULL,
    "respiratory_rate" INTEGER,
    "oxygen_saturation" INTEGER,
    "weight" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VitalSigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Diagnosis" (
    "id" SERIAL NOT NULL,
    "medical_record_id" INTEGER NOT NULL,
    "doctor_id" TEXT NOT NULL,
    "symptoms" TEXT NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "notes" TEXT,
    "follow_up_plan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Diagnosis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Medication" (
    "id" SERIAL NOT NULL,
    "medication_name" TEXT NOT NULL,
    "description" TEXT,
    "unit_price" DOUBLE PRECISION NOT NULL,
    "currency" "public"."Currency" NOT NULL DEFAULT 'VND',
    "unit_type" TEXT NOT NULL,
    "manufacturer" TEXT,
    "stock_quantity" INTEGER NOT NULL DEFAULT 0,
    "min_stock_level" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Prescription" (
    "id" SERIAL NOT NULL,
    "medical_record_id" INTEGER NOT NULL,
    "medication_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "dosage" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "instructions" TEXT,
    "unit_price" DOUBLE PRECISION NOT NULL,
    "total_price" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PrescriptionBill" (
    "id" SERIAL NOT NULL,
    "payment_id" INTEGER NOT NULL,
    "prescription_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_cost" DOUBLE PRECISION NOT NULL,
    "total_cost" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrescriptionBill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AuditLog" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "record_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "model" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Patient_email_key" ON "public"."Patient"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Doctor_email_key" ON "public"."Doctor"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_email_key" ON "public"."Staff"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_appointment_id_key" ON "public"."Payment"("appointment_id");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_receipt_number_key" ON "public"."Payment"("receipt_number");

-- CreateIndex
CREATE UNIQUE INDEX "Service_service_name_key" ON "public"."Service"("service_name");

-- CreateIndex
CREATE UNIQUE INDEX "LabTest_service_id_medical_record_id_key" ON "public"."LabTest"("service_id", "medical_record_id");

-- CreateIndex
CREATE UNIQUE INDEX "Medication_medication_name_key" ON "public"."Medication"("medication_name");

-- CreateIndex
CREATE UNIQUE INDEX "PrescriptionBill_payment_id_prescription_id_key" ON "public"."PrescriptionBill"("payment_id", "prescription_id");

-- AddForeignKey
ALTER TABLE "public"."WorkingDay" ADD CONSTRAINT "WorkingDay_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."Doctor"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."Patient"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."Doctor"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "public"."Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."Patient"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_cashier_id_fkey" FOREIGN KEY ("cashier_id") REFERENCES "public"."Staff"("uid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaymentHistory" ADD CONSTRAINT "PaymentHistory_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "public"."Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LabBill" ADD CONSTRAINT "LabBill_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LabBill" ADD CONSTRAINT "LabBill_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "public"."Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LabTest" ADD CONSTRAINT "LabTest_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LabTest" ADD CONSTRAINT "LabTest_medical_record_id_fkey" FOREIGN KEY ("medical_record_id") REFERENCES "public"."MedicalRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LabTest" ADD CONSTRAINT "LabTest_technician_id_fkey" FOREIGN KEY ("technician_id") REFERENCES "public"."Staff"("uid") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MedicalRecord" ADD CONSTRAINT "MedicalRecord_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "public"."Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MedicalRecord" ADD CONSTRAINT "MedicalRecord_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."Doctor"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MedicalRecord" ADD CONSTRAINT "MedicalRecord_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."Patient"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VitalSigns" ADD CONSTRAINT "VitalSigns_medical_record_id_fkey" FOREIGN KEY ("medical_record_id") REFERENCES "public"."MedicalRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Diagnosis" ADD CONSTRAINT "Diagnosis_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."Doctor"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Diagnosis" ADD CONSTRAINT "Diagnosis_medical_record_id_fkey" FOREIGN KEY ("medical_record_id") REFERENCES "public"."MedicalRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Prescription" ADD CONSTRAINT "Prescription_medical_record_id_fkey" FOREIGN KEY ("medical_record_id") REFERENCES "public"."MedicalRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Prescription" ADD CONSTRAINT "Prescription_medication_id_fkey" FOREIGN KEY ("medication_id") REFERENCES "public"."Medication"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PrescriptionBill" ADD CONSTRAINT "PrescriptionBill_prescription_id_fkey" FOREIGN KEY ("prescription_id") REFERENCES "public"."Prescription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PrescriptionBill" ADD CONSTRAINT "PrescriptionBill_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "public"."Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
