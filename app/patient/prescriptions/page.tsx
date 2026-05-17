import { Pill } from "lucide-react";

import { apiRequest } from "@/lib/api-client";
import { PrescriptionList } from "@/features/admin/components/prescription-list";
import { PaginationControls } from "@/features/admin/components/pagination-controls";

interface PrescriptionListItem {
  prescriptionId: number;
  appointmentId: number;
  patientName: string;
  doctorName: string;
  status: string;
  createdAt: string;
}

interface PrescriptionsResponse {
  content: PrescriptionListItem[];
  totalPages: number;
}

export default async function PatientPrescriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 0;

  let data: PrescriptionsResponse = {
    content: [],
    totalPages: 0,
  };
  let errorMessage = "";

  try {
    data = await apiRequest<PrescriptionsResponse>(
      `/prescription/my?page=${page}&size=5`,
      {
        method: "GET",
        cache: "no-store",
      },
    );
  } catch (error) {
    errorMessage =
      error instanceof Error ? error.message : "Could not load prescriptions";
  }

  return (
    <div className="space-y-6 col-start-1 col-end-14">
      <div className="flex flex-col gap-1">
        <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-md border border-border/70 px-2.5 py-1 text-xs font-medium text-muted-foreground">
          <Pill className="h-3.5 w-3.5" />
          Patient prescriptions
        </div>
        <h1 className="text-2xl font-semibold">My Prescriptions</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          View prescriptions issued by your doctor and open each record for
          medication details.
        </p>
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border bg-card p-8 text-sm text-muted-foreground shadow-sm">
          {errorMessage}
        </div>
      ) : (
        <div className="rounded-3xl border border-border/60 bg-card/50 p-4 shadow-sm">
          <PrescriptionList data={data.content || []} />
          <PaginationControls currentPage={page} totalPages={data.totalPages} />
        </div>
      )}
    </div>
  );
}
