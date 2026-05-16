"use client";

import { useState } from "react";
import { Calendar } from "lucide-react";
import DataTable, { Column } from "@/components/ui/data-table";
import { PrescriptionDetailsDialog } from "./prescription-details-dialog";
import { Prescription as FullPrescription } from "@/lib/services/prescription-service";

interface PrescriptionListItem {
  prescriptionId: number;
  appointmentId: number;
  patientName: string;
  doctorName: string;
  status: string;
  createdAt: string;
}

export function PrescriptionList({
  data = [],
}: {
  data: PrescriptionListItem[];
}) {
  const [selectedPrescription, setSelectedPrescription] =
    useState<FullPrescription | null>(null);

  const columns: Column<PrescriptionListItem>[] = [
    {
      header: "ID",
      accessor: "prescriptionId",
      className: "pl-6 w-[120px] font-medium",
    },
    { header: "Appointment", accessor: "appointmentId" },
    { header: "Patient", accessor: "patientName" },
    { header: "Practitioner", accessor: "doctorName" },
    { header: "Status", accessor: "status" },
    {
      header: "Created",
      render: (p: PrescriptionListItem) => (
        <div className="flex items-center justify-end gap-2">
          <Calendar className="size-3" />
          {new Date(p.createdAt).toLocaleDateString()}
        </div>
      ),
      className: "text-right",
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        data={data}
        onView={(p) =>
          setSelectedPrescription(p as unknown as FullPrescription)
        }
        emptyMessage="No prescriptions found."
      />

      <PrescriptionDetailsDialog
        prescription={selectedPrescription}
        onClose={() => setSelectedPrescription(null)}
      />
    </>
  );
}
