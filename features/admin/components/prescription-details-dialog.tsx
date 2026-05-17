"use client";

import {
  CalendarDays,
  Clipboard,
  FileText,
  Hash,
  Pill,
  Stethoscope,
  User,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  PrescriptionResponse,
  PrescriptionItemResponse,
} from "@/types/prescription-types";

interface Props {
  prescription: PrescriptionResponse | null;
  onClose: () => void;
}

export function PrescriptionDetailsDialog({ prescription, onClose }: Props) {
  if (!prescription) return null;

  const getStatusDetails = (status: string) => {
    const normalized = status.trim().toUpperCase();

    switch (normalized) {
      case "PENDING":
        return {
          color: "bg-yellow-100 text-yellow-700 border-yellow-200",
          label: "PENDING",
        };
      case "ACTIVE":
      case "CONFIRMED":
        return {
          color: "bg-blue-100 text-blue-700 border-blue-200",
          label: normalized,
        };
      case "COMPLETED":
        return {
          color: "bg-green-100 text-green-700 border-green-200",
          label: "COMPLETED",
        };
      case "CANCELLED":
        return {
          color: "bg-red-100 text-red-700 border-red-200",
          label: "CANCELLED",
        };
      default:
        return {
          color: "bg-muted text-muted-foreground border-border",
          label: status,
        };
    }
  };

  const status = getStatusDetails(prescription.status);

  return (
    <Dialog open={!!prescription} onOpenChange={onClose}>
      <DialogContent className="boxwidth">
        <DialogHeader className="px-6 py-5">
          <DialogTitle className="text-xl font-normal">
            Prescription Details
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[80vh] overflow-y-auto px-6 py-5">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-muted/50 p-4">
            <div>
              <p className="text-sm text-muted-foreground">
                Prescription Reference
              </p>
              <p className="text-lg">#{prescription.prescriptionId}</p>
            </div>

            <Badge
              variant="outline"
              className={`rounded-full px-3 py-1 text-xs font-normal ${status.color}`}
            >
              {status.label}
            </Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <InfoItem
              icon={<Hash className="h-4 w-4" />}
              label="Appointment"
              value={`#${prescription.appointmentId}`}
            />

            <InfoItem
              icon={<CalendarDays className="h-4 w-4" />}
              label="Date"
              value={new Date(prescription.prescriptionDate).toLocaleDateString(
                undefined,
                {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
              )}
            />

            <InfoItem
              icon={<Clipboard className="h-4 w-4" />}
              label="Items"
              value={`${prescription.items.length} medication${
                prescription.items.length === 1 ? "" : "s"
              }`}
            />

            <InfoItem
              icon={<User className="h-4 w-4" />}
              label="Patient"
              value={prescription.patientName}
            />

            <InfoItem
              icon={<Stethoscope className="h-4 w-4" />}
              label="Doctor"
              value={prescription.doctorName}
            />

            <InfoItem
              icon={<Pill className="h-4 w-4" />}
              label="Prescription ID"
              value={`#${prescription.prescriptionId}`}
            />
          </div>

          <div className="mt-5 rounded-xl border bg-card p-4">
            <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              Notes
            </div>
            <p className="text-sm">
              {prescription.notes?.trim() ||
                "No notes added for this prescription."}
            </p>
          </div>

          <div className="mt-5 rounded-xl border bg-card p-4">
            <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Pill className="h-4 w-4" />
              Medications
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Medication</TableHead>
                  <TableHead>Dosage</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Instructions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prescription.items.map((item: PrescriptionItemResponse) => (
                  <TableRow key={item.prescriptionItemId}>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="text-sm">{item.medicationName}</p>
                        {item.genericName ? (
                          <p className="text-xs text-muted-foreground">
                            {item.genericName}
                          </p>
                        ) : null}
                      </div>
                    </TableCell>
                    <TableCell>{item.dosage}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      {item.specialInstructions || (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="text-sm">{value}</p>
    </div>
  );
}
