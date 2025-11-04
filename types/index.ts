import type { AppointmentStatus } from "@prisma/client";

export interface SearchQueryParams {
  query?: string;
  limit?: string;
  page?: string;
}

export interface AppointmentParams extends SearchQueryParams {
  view?: "all" | "today";
  status?: AppointmentStatus;
}
