const createContainsFilter = (field: string, query: string) => ({
  [field]: {
    contains: query,
    mode: "insensitive" as const,
  },
});

const createMultiFieldSearch = (fields: string[], query: string) => ({
  OR: fields.map((field) => createContainsFilter(field, query)),
});

export const searchAppointmentFields = (query: string) => {
  if (!query?.trim()) return [];

  return [
    createContainsFilter("reason", query),
    createContainsFilter("note", query),
  ];
};

export const searchDoctorDirect = (query?: string) => {
  if (!query?.trim()) return null;

  return createMultiFieldSearch(
    ["uid", "email", "first_name", "last_name", "specialization"],
    query
  );
};

export const searchPatientDirect = (query?: string) => {
  if (!query?.trim()) return null;

  return createMultiFieldSearch(
    ["uid", "email", "first_name", "last_name", "phone", "address"],
    query
  );
};

export const searchStaffDirect = (query?: string) => {
  if (!query?.trim()) return null;

  return createMultiFieldSearch(
    ["uid", "email", "first_name", "last_name", "phone", "address"],
    query
  );
};

export const searchDoctor = (query: string) => {
  const directSearch = searchDoctorDirect(query);
  if (!directSearch) return null;

  return { doctor: directSearch };
};

export const searchPatient = (query: string) => {
  const directSearch = searchPatientDirect(query);
  if (!directSearch) return null;

  return { patient: directSearch };
};

export const searchStaff = (query: string) => {
  const directSearch = searchStaffDirect(query);
  if (!directSearch) return null;

  return { staff: directSearch };
};
