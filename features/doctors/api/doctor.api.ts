import { apiRequest } from "@/lib/api-client";

export interface DoctorResponse {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  nic?: string;
  NIC?: string;
  address: string;
  isActive: boolean;
  roleType: number;
  doctorId: number;
  specialization: string;
  licenseNumber: string;
  qualification: string;
  experienceYears: number;
  consultationFee: number;
}

export const doctorApi = {
  getOptions: async () => {
    return apiRequest<DoctorResponse[]>("/doctor/options", {
      method: "GET",
    });
  },
};
