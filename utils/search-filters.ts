import { Prisma } from "@prisma/client";

function createMultiFieldSearch<T extends Record<string, any>>(
  fields: Array<keyof T & string>,
  query: string
): { OR: Array<Partial<T>> } {
  return {
    OR: fields.map((field) => ({
      [field]: {
        contains: query,
        mode: Prisma.QueryMode.insensitive,
      },
    })) as Array<Partial<T>>,
  };
}

export const searchAppointmentFields = (
  query: string
): Prisma.AppointmentWhereInput[] => {
  const trimmedQuery = query?.trim();
  if (!trimmedQuery) return [];

  return [
    { reason: { contains: trimmedQuery, mode: Prisma.QueryMode.insensitive } },
    { note: { contains: trimmedQuery, mode: Prisma.QueryMode.insensitive } },
  ];
};

export const searchPaymentFields = (
  query?: string
): Prisma.PaymentWhereInput | null => {
  if (!query?.trim()) return null;

  return {
    OR: [
      { notes: { contains: query, mode: Prisma.QueryMode.insensitive } },
      {
        receipt_number: { contains: query, mode: Prisma.QueryMode.insensitive },
      },
    ],
  };
};

export const searchDoctorDirect = (
  query?: string
): Prisma.DoctorWhereInput | null => {
  const trimmedQuery = query?.trim();
  if (!trimmedQuery) return null;

  return createMultiFieldSearch<Prisma.DoctorWhereInput>(
    [
      "uid",
      "email",
      "first_name",
      "last_name",
      "license_number",
      "phone",
      "specialization",
      "department",
    ],
    trimmedQuery
  );
};

export const searchPatientDirect = (
  query?: string
): Prisma.PatientWhereInput | null => {
  const trimmedQuery = query?.trim();
  if (!trimmedQuery) return null;

  return createMultiFieldSearch<Prisma.PatientWhereInput>(
    ["uid", "email", "first_name", "last_name", "phone", "address"],
    trimmedQuery
  );
};

export const searchStaffDirect = (
  query?: string
): Prisma.StaffWhereInput | null => {
  const trimmedQuery = query?.trim();
  if (!trimmedQuery) return null;

  return createMultiFieldSearch<Prisma.StaffWhereInput>(
    [
      "uid",
      "email",
      "first_name",
      "last_name",
      "license_number",
      "phone",
      "address",
      "department",
    ],
    trimmedQuery
  );
};

export const searchServiceDirect = (
  query?: string
): Prisma.ServiceWhereInput | null => {
  const trimmedQuery = query?.trim();
  if (!trimmedQuery) return null;

  return createMultiFieldSearch<Prisma.ServiceWhereInput>(
    ["service_name", "description"],
    trimmedQuery
  );
};

export const searchLabTestDirect = (
  query?: string
): Prisma.LabTestWhereInput | null => {
  const trimmedQuery = query?.trim();
  if (!trimmedQuery) return null;

  return createMultiFieldSearch<Prisma.LabTestWhereInput>(
    ["result", "notes", "technician_id"],
    trimmedQuery
  );
};

export const searchDoctor = (
  query: string
): Prisma.AppointmentWhereInput | null => {
  const directSearch = searchDoctorDirect(query);
  if (!directSearch) return null;

  return { doctor: directSearch };
};

export const searchPatient = (
  query: string
): Prisma.AppointmentWhereInput | null => {
  const directSearch = searchPatientDirect(query);
  if (!directSearch) return null;

  return { patient: directSearch };
};

export const searchLabTest = (
  query?: string
): Prisma.LabTestWhereInput | null => {
  const trimmedQuery = query?.trim();
  if (!trimmedQuery) return null;

  return {
    OR: [
      searchLabTestDirect(trimmedQuery),
      {
        service: searchServiceDirect(trimmedQuery),
      },
      {
        medical_record: {
          patient: searchPatientDirect(trimmedQuery),
          doctor: searchDoctorDirect(trimmedQuery),
        },
      },
    ].filter(Boolean) as Prisma.LabTestWhereInput[],
  };
};
