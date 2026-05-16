// src/features/appointments/hooks/use-appointments.ts

"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { appointmentApi } from "../api/appointment.api";
import { AppointmentResponse } from "../types/appointment.types";

export function useAppointments() {
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAppointments = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await appointmentApi.getAll();
      setAppointments(data);
    } catch (error: any) {
      toast.error(error?.message || "Failed to load appointments");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  return {
    appointments,
    isLoading,
    refetch: fetchAppointments,
  };
}
