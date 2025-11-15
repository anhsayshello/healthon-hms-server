import { AppointmentStatus, Role, Weekday } from "@prisma/client";
import { fakerDE as faker } from "@faker-js/faker";
import prisma from "../config/db";

async function seed() {
  console.log("Seeding data...");

  // Create 3 staff
  const staffRoles = ["NURSE", "CASHIER", "LAB_TECHNICIAN"];
  for (const role of staffRoles) {
    const mobile = faker.phone.number();

    await prisma.staff.create({
      data: {
        uid: faker.string.uuid(),
        email: faker.internet.email(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        phone: mobile,
        address: faker.location.streetAddress(),
        department: faker.company.name(),
        role: role as Role,
        status: "ACTIVE",
        photo_url: faker.image.avatar(),
      },
    });
  }

  // Create 10 doctors
  const doctors = [];
  const randomDay = (min: number, max: number) => {
    const values = Object.values(Weekday);
    const randomIndex = Math.floor(Math.random() * (max - min)) + min;
    return values[randomIndex];
  };

  for (let i = 0; i < 10; i++) {
    const doctor = await prisma.doctor.create({
      data: {
        uid: faker.string.uuid(),
        email: faker.internet.email(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        specialization: faker.person.jobType(),
        license_number: faker.string.uuid(),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        department: faker.company.name(),
        availability_status: "ACTIVE",
        type: i % 2 === 0 ? "FULL" : "PART",
        working_days: {
          create: [
            {
              day: randomDay(0, 4) as Weekday,
              start_time: "08:00",
              close_time: "17:00",
            },
            {
              day: randomDay(4, 7) as Weekday,
              start_time: "08:00",
              close_time: "17:00",
            },
          ],
        },
        photo_url: faker.image.avatar(),
      },
    });

    doctors.push(doctor);
  }

  // Create 20 patients
  const patients = [];

  for (let i = 0; i < 20; i++) {
    const patient = await prisma.patient.create({
      data: {
        uid: faker.string.uuid(),
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        date_of_birth: faker.date.birthdate(),
        gender: i % 2 === 0 ? "MALE" : "FEMALE",
        phone: faker.phone.number(),
        email: faker.internet.email(),
        marital_status: i % 3 === 0 ? "MARRIED" : "SINGLE",
        address: faker.location.streetAddress(),
        emergency_contact_name: faker.person.fullName(),
        emergency_contact_number: faker.phone.number(),
        relation: "Sibling",
        blood_group: i % 4 === 0 ? "O+" : "A+",
        allergies: faker.lorem.words(2),
        medical_conditions: faker.lorem.words(3),
        privacy_consent: true,
        service_consent: true,
        medical_consent: true,
        photo_url: faker.image.avatar(),
      },
    });

    patients.push(patient);
  }

  // Create 20 Appointments
  const statuses = ["PENDING", "SCHEDULED", "CANCELLED", "COMPLETED"];

  for (let i = 0; i < 20; i++) {
    const doctor = doctors[Math.floor(Math.random() * doctors.length)];
    const patient = patients[Math.floor(Math.random() * patients.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    if (!doctor || !patient) {
      throw new Error("Doctors or patients array is empty!");
    }

    await prisma.appointment.create({
      data: {
        patient_id: patient.uid,
        doctor_id: doctor.uid,
        appointment_date: faker.date.soon(),
        time: "10:00",
        status: randomStatus as AppointmentStatus,
        type: "Checkup",
        reason: faker.lorem.sentence(),
      },
    });
  }

  console.log("✅ Seeding completed!");
}

seed()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
