"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/features/dashboard";
import { AppointmentForm } from "@/features/appointments/components/appointment-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  CalendarPlus,
  FileText,
  ClipboardList,
  CreditCard,
  History,
  MessageSquare,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/utils";

interface CurrentUser {
  userId: number;
  firstName?: string;
  lastName?: string;
  roleType: number;
}

export default function PatientDashboard() {
  const router = useRouter();
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [patient, setPatient] = useState<CurrentUser | null>(null);
  const [isPatientLoading, setIsPatientLoading] = useState(true);

  useEffect(() => {
    async function loadPatient() {
      try {
        const currentUser = await apiRequest<CurrentUser>("/users/me", {
          method: "GET",
          cache: "no-store",
        });
        setPatient(currentUser);
      } catch (error) {
        toast.error(getErrorMessage(error, "Could not load patient profile"));
      } finally {
        setIsPatientLoading(false);
      }
    }

    loadPatient();
  }, []);

  const openAppointmentForm = () => setAppointmentDialogOpen(true);

  const patientItems = [
    {
      icon: CalendarPlus,
      title: "Appointment",
      buttonText: "Schedule Now",
      action: openAppointmentForm,
    },
    {
      icon: FileText,
      title: "My Prescriptions",
      buttonText: "View Current",
      action: () => router.push("/patient/prescriptions"),
    },
    {
      icon: ClipboardList,
      title: "Lab Results",
      buttonText: "Check Status",
      action: () => router.push("/patient/results"),
    },
    {
      icon: CreditCard,
      title: "Medical Billing",
      buttonText: "Pay Invoices",
      action: () => router.push("/patient/billing"),
    },
    {
      icon: History,
      title: "Medical History",
      buttonText: "View Records",
      action: () => router.push("/patient/visits"),
    },
    {
      icon: MessageSquare,
      title: "Feedback",
      buttonText: "Share Feedback",
      action: () => router.push("/patient/feedback"),
    },
  ];

  return (
    <>
      <DashboardShell
        badgeText="Patient Care Portal"
        title={
          <>
            Your Health Center <br />
            <span>Manage Appointments & Records</span>
          </>
        }
        description="Stay on top of your health. Book new appointments, pay your medical bills, and access your lab results securely."
        primaryButton={{
          text: "Book Appointment",
          onClick: openAppointmentForm,
        }}
        secondaryButton={{
          text: "View My Visits",
          onClick: () => router.push("/patient/visits"),
        }}
        bentoItems={patientItems}
      />

      <Dialog
        open={appointmentDialogOpen}
        onOpenChange={setAppointmentDialogOpen}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Schedule Appointment</DialogTitle>
            <DialogDescription>
              Choose your doctor, appointment time, and visit type.
            </DialogDescription>
          </DialogHeader>

          {isPatientLoading ? (
            <p className="text-sm text-muted-foreground">
              Loading your patient profile...
            </p>
          ) : patient?.userId ? (
            <AppointmentForm
              patientId={patient.userId}
              onCancel={() => setAppointmentDialogOpen(false)}
              onCreated={() => setAppointmentDialogOpen(false)}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              We could not load your patient profile. Please sign in again.
            </p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
