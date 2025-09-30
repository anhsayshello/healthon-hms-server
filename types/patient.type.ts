export type Gender = "MALE" | "FEMALE";
export type Marital_Status = "SINGLE" | "MARRIED" | "DIVORCED" | "SEPARATED";
export type Relation = "FATHER" | "MOTHER" | "WIFE" | "HUSBAND" | "OTHER";
export type Blood_Group = "A" | "B" | "AB" | "O";

export interface Patient {
  uid: string;
  email: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  gender: Gender;
  phone: string;
  marital_status: Marital_Status;
  address: string;
  emergency_contact_name: string;
  emergency_contact_number: string;
  relation: Relation;
  blood_group: Blood_Group | null;
  allergies: string | null;
  medical_conditions: string | null;
  medical_history: string | null;
  insurance_provider: string | null;
  insurance_number: string | null;
  privacy_consent: boolean;
  service_consent: boolean;
  medical_consent: boolean;
  photo_url?: string | null;
}
