// src/features/appointments/api/appointment.api.ts

import { apiRequest } from "@/lib/api-client";
import {
  AppointmentCreateRequest,
  AppointmentUpdateRequest,
  AppointmentStatusUpdateRequest,
  AppointmentResponse,
} from "../types/appointment.types";

const BASE_URL = "/appointment";

export const appointmentApi = {
  getAll: async () => {
    return apiRequest<AppointmentResponse[]>(BASE_URL);
  },

  getById: async (appointmentId: number) => {
    return apiRequest<AppointmentResponse>(`${BASE_URL}/${appointmentId}`);
  },

  create: async (payload: AppointmentCreateRequest) => {
    return apiRequest<AppointmentResponse>(BASE_URL, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  getAvailableSlots: async (doctorId: number, date: string) => {
    return apiRequest<string[]>(
      `${BASE_URL}/available-slots?doctorId=${doctorId}&date=${date}`,
      {
        method: "GET",
      },
    );
  },

  update: async (appointmentId: number, data: AppointmentUpdateRequest) => {
    return apiRequest<AppointmentResponse>(`${BASE_URL}/${appointmentId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  updateStatus: async (
    appointmentId: number,
    data: AppointmentStatusUpdateRequest,
  ) => {
    return apiRequest<AppointmentResponse>(
      `${BASE_URL}/${appointmentId}/status`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      },
    );
  },

  cancel: async (appointmentId: number) => {
    return apiRequest<void>(`${BASE_URL}/${appointmentId}`, {
      method: "DELETE",
    });
  },
};
