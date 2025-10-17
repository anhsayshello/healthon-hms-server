-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'NURSE', 'DOCTOR', 'LAB_TECHNICIAN', 'PATIENT', 'CASHIER');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('ACTIVE', 'INACTIVE', 'DORMANT');

-- CreateEnum
CREATE TYPE "public"."JobType" AS ENUM ('FULL', 'PART');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "public"."AppointmentStatus" AS ENUM ('PENDING', 'SCHEDULED', 'CANCELLED', 'COMPLETED');

-- CreateEnum
CREATE TYPE "public"."PaymentMethod" AS ENUM ('CASH', 'CARD');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PAID', 'UNPAID', 'PART');

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
CREATE TABLE "public"."WorkingDays" (
    "id" SERIAL NOT NULL,
    "doctor_id" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "start_time" TEXT NOT NULL,
    "close_time" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkingDays_pkey" PRIMARY KEY ("id")
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
    "bill_id" INTEGER,
    "patient_id" TEXT NOT NULL,
    "appointment_id" INTEGER NOT NULL,
    "bill_date" TIMESTAMP(3) NOT NULL,
    "payment_date" TIMESTAMP(3) NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "amount_paid" DOUBLE PRECISION NOT NULL,
    "payment_method" "public"."PaymentMethod" NOT NULL DEFAULT 'CASH',
    "status" "public"."PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "receipt_number" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PatientBills" (
    "id" SERIAL NOT NULL,
    "bill_id" INTEGER NOT NULL,
    "service_id" INTEGER NOT NULL,
    "service_date" TIMESTAMP(3) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unit_cost" DOUBLE PRECISION NOT NULL,
    "total_cost" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PatientBills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LabTest" (
    "id" SERIAL NOT NULL,
    "record_id" INTEGER NOT NULL,
    "test_date" TIMESTAMP(3) NOT NULL,
    "result" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "service_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LabTest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MedicalRecords" (
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

    CONSTRAINT "MedicalRecords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VitalSigns" (
    "id" SERIAL NOT NULL,
    "patient_id" TEXT NOT NULL,
    "medical_id" INTEGER NOT NULL,
    "body_temperature" DOUBLE PRECISION NOT NULL,
    "systolic" INTEGER NOT NULL,
    "diastolic" INTEGER NOT NULL,
    "heartRate" TEXT NOT NULL,
    "respiratory_rate" INTEGER,
    "oxygen_saturaion" INTEGER,
    "weight" DOUBLE PRECISION NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VitalSigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Diagnosis" (
    "id" SERIAL NOT NULL,
    "patient_id" TEXT NOT NULL,
    "medical_id" INTEGER NOT NULL,
    "doctor_id" TEXT NOT NULL,
    "symptoms" TEXT NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "notes" TEXT,
    "prescribed_medications" TEXT,
    "follow_up_plan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Diagnosis_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "public"."Rating" (
    "id" SERIAL NOT NULL,
    "staff_id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Services" (
    "id" SERIAL NOT NULL,
    "service_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Services_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "LabTest_service_id_key" ON "public"."LabTest"("service_id");

-- AddForeignKey
ALTER TABLE "public"."WorkingDays" ADD CONSTRAINT "WorkingDays_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."Doctor"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."Patient"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Appointment" ADD CONSTRAINT "Appointment_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."Doctor"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "public"."Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."Patient"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PatientBills" ADD CONSTRAINT "PatientBills_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."Services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PatientBills" ADD CONSTRAINT "PatientBills_bill_id_fkey" FOREIGN KEY ("bill_id") REFERENCES "public"."Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LabTest" ADD CONSTRAINT "LabTest_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."Services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LabTest" ADD CONSTRAINT "LabTest_record_id_fkey" FOREIGN KEY ("record_id") REFERENCES "public"."MedicalRecords"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MedicalRecords" ADD CONSTRAINT "MedicalRecords_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "public"."Appointment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MedicalRecords" ADD CONSTRAINT "MedicalRecords_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."Patient"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."VitalSigns" ADD CONSTRAINT "VitalSigns_medical_id_fkey" FOREIGN KEY ("medical_id") REFERENCES "public"."MedicalRecords"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Diagnosis" ADD CONSTRAINT "Diagnosis_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "public"."Doctor"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Diagnosis" ADD CONSTRAINT "Diagnosis_medical_id_fkey" FOREIGN KEY ("medical_id") REFERENCES "public"."MedicalRecords"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Rating" ADD CONSTRAINT "Rating_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "public"."Doctor"("uid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Rating" ADD CONSTRAINT "Rating_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."Patient"("uid") ON DELETE CASCADE ON UPDATE CASCADE;
