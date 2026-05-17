"use client";

import { useMemo, useState } from "react";
import {
  Edit3,
  Eye,
  FilePlus,
  FlaskConical,
  Plus,
  Search,
} from "lucide-react";
import { toast } from "sonner";

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/components/ui";
import { getErrorMessage } from "@/lib/utils";
import { labResultApi } from "../api/lab-result.api";
import {
  labResultSchema,
  type LabResultValues,
} from "../schemas/lab-result.schema";
import { LabResultResponse } from "../types/lab-result.types";

const statusOptions = ["PENDING", "IN_PROGRESS", "COMPLETED"];

function createEmptyForm(): LabResultValues {
  return {
    appointmentId: 0,
    patientId: 0,
    labTestId: 0,
    testName: "",
    resultValue: "",
    referenceRange: "",
    status: "PENDING",
    remarks: "",
    testDate: new Date().toISOString().split("T")[0],
  };
}

function getStatusClasses(status: string) {
  const normalized = status.toUpperCase();

  if (normalized === "COMPLETED") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (normalized === "IN_PROGRESS") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-700";
}

function allRequiredFieldsSet(values: LabResultValues) {
  return (
    Number(values.appointmentId) > 0 &&
    Number(values.patientId) > 0 &&
    values.testName.trim().length > 0 &&
    values.resultValue.trim().length > 0 &&
    values.referenceRange.trim().length > 0 &&
    values.status.trim().length > 0
  );
}

export function LabResultManagement() {
  const [results, setResults] = useState<LabResultResponse[]>([]);
  const [patientIdFilter, setPatientIdFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedResult, setSelectedResult] =
    useState<LabResultResponse | null>(null);
  const [formValues, setFormValues] =
    useState<LabResultValues>(createEmptyForm());

  const sortedResults = useMemo(() => {
    return [...results].sort((a, b) => b.id - a.id);
  }, [results]);

  async function searchByPatient() {
    if (!patientIdFilter.trim()) {
      toast.error("Patient ID is required.");
      return;
    }

    setLoading(true);
    try {
      const data = await labResultApi.getByPatient(Number(patientIdFilter));
      setResults(data || []);
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not load lab results"));
    } finally {
      setLoading(false);
    }
  }

  function openCreateDialog() {
    setSelectedResult(null);
    setFormValues({
      ...createEmptyForm(),
      patientId: patientIdFilter ? Number(patientIdFilter) : 0,
    });
    setDialogOpen(true);
  }

  function openEditDialog(result: LabResultResponse) {
    setSelectedResult(result);
    setFormValues({
      appointmentId: result.appointmentId,
      patientId: result.patientId,
      labTestId: 0,
      testName: result.testName || "",
      resultValue: result.resultValue || "",
      referenceRange: result.referenceRange || "",
      status: result.status || "PENDING",
      remarks: result.remarks || "",
      testDate: new Date().toISOString().split("T")[0],
    });
    setDialogOpen(true);
  }

  function openDetailsDialog(result: LabResultResponse) {
    setSelectedResult(result);
    setDetailsOpen(true);
  }

  async function saveResult() {
    const parsed = labResultSchema.safeParse({
      ...formValues,
      remarks: formValues.remarks?.trim() || undefined,
      testDate: formValues.testDate || undefined,
    });

    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message || "Check lab result fields");
      return;
    }

    setSaving(true);
    try {
      if (selectedResult) {
        await labResultApi.update(selectedResult.id, parsed.data);
        toast.success("Lab result updated successfully.");
      } else {
        await labResultApi.create(parsed.data);
        toast.success("Lab result created successfully.");
      }

      setDialogOpen(false);
      setSelectedResult(null);
      setFormValues(createEmptyForm());

      if (patientIdFilter.trim()) {
        const data = await labResultApi.getByPatient(Number(patientIdFilter));
        setResults(data || []);
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not save lab result"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="col-start-1 col-end-14 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-md border border-border/70 px-2.5 py-1 text-xs font-medium text-muted-foreground">
            <FlaskConical className="h-3.5 w-3.5" />
            Laboratory results
          </div>
          <h1 className="text-2xl font-semibold">Lab Results</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Create and update patient lab results by appointment and test.
          </p>
        </div>

        <Button size="sm" onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          New Result
        </Button>
      </div>

      <Card className="border-border/60 bg-card/80">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Search patient results
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-[220px_auto] md:items-end">
          <div className="grid gap-2">
            <Label htmlFor="patient-search">Patient ID</Label>
            <Input
              id="patient-search"
              type="number"
              min={1}
              value={patientIdFilter}
              onChange={(event) => setPatientIdFilter(event.target.value)}
              placeholder="Enter patient ID"
            />
          </div>
          {patientIdFilter.trim() && (
            <Button onClick={searchByPatient} disabled={loading}>
              <Search className="mr-2 h-4 w-4" />
              {loading ? "Searching..." : "Search"}
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {loading ? (
          <Card className="border-border/60 bg-card/80">
            <CardContent className="p-6 text-sm text-muted-foreground">
              Loading lab results...
            </CardContent>
          </Card>
        ) : sortedResults.length === 0 ? (
          <Card className="border-border/60 bg-card/80">
            <CardContent className="p-6 text-sm text-muted-foreground">
              Search by patient ID to view lab results.
            </CardContent>
          </Card>
        ) : (
          sortedResults.map((result) => (
            <Card key={result.id} className="border-border/60 bg-card/80">
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold">
                        {result.testName}
                      </h2>
                      <Badge variant="outline">Result #{result.id}</Badge>
                      <Badge
                        variant="outline"
                        className={getStatusClasses(result.status)}
                      >
                        {result.status}
                      </Badge>
                    </div>
                    <div className="grid gap-1 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">
                      <span>Appointment #{result.appointmentId}</span>
                      <span>Patient #{result.patientId}</span>
                      <span>
                        Updated{" "}
                        {result.updatedAt
                          ? new Date(result.updatedAt).toLocaleDateString()
                          : "not available"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openDetailsDialog(result)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(result)}
                    >
                      <Edit3 className="mr-2 h-4 w-4" />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[820px]">
          <DialogHeader>
            <DialogTitle>
              {selectedResult ? "Edit Lab Result" : "Create Lab Result"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-2 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="appointment-id">Appointment ID *</Label>
              <Input
                id="appointment-id"
                type="number"
                min={1}
                value={formValues.appointmentId || ""}
                onChange={(event) =>
                  setFormValues((current) => ({
                    ...current,
                    appointmentId: Number(event.target.value),
                  }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="patient-id">Patient ID *</Label>
              <Input
                id="patient-id"
                type="number"
                min={1}
                value={formValues.patientId || ""}
                onChange={(event) =>
                  setFormValues((current) => ({
                    ...current,
                    patientId: Number(event.target.value),
                  }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="lab-test-id">Lab Test ID</Label>
              <Input
                id="lab-test-id"
                type="number"
                min={1}
                value={formValues.labTestId || ""}
                onChange={(event) =>
                  setFormValues((current) => ({
                    ...current,
                    labTestId: Number(event.target.value),
                  }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label>Status *</Label>
              <Select
                value={formValues.status}
                onValueChange={(value) =>
                  setFormValues((current) => ({ ...current, status: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="test-name">Test Name *</Label>
              <Input
                id="test-name"
                value={formValues.testName}
                onChange={(event) =>
                  setFormValues((current) => ({
                    ...current,
                    testName: event.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="test-date">Test Date</Label>
              <Input
                id="test-date"
                type="date"
                value={formValues.testDate || ""}
                onChange={(event) =>
                  setFormValues((current) => ({
                    ...current,
                    testDate: event.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="result-value">Result Value *</Label>
              <Input
                id="result-value"
                value={formValues.resultValue}
                onChange={(event) =>
                  setFormValues((current) => ({
                    ...current,
                    resultValue: event.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reference-range">Reference Range *</Label>
              <Input
                id="reference-range"
                value={formValues.referenceRange}
                onChange={(event) =>
                  setFormValues((current) => ({
                    ...current,
                    referenceRange: event.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="remarks">Remarks</Label>
              <Textarea
                id="remarks"
                value={formValues.remarks || ""}
                onChange={(event) =>
                  setFormValues((current) => ({
                    ...current,
                    remarks: event.target.value,
                  }))
                }
                rows={4}
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                setSelectedResult(null);
                setFormValues(createEmptyForm());
              }}
            >
              Cancel
            </Button>
            {allRequiredFieldsSet(formValues) && (
              <Button onClick={saveResult} disabled={saving}>
                <FilePlus className="mr-2 h-4 w-4" />
                {saving
                  ? "Saving..."
                  : selectedResult
                    ? "Update Result"
                    : "Create Result"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[720px]">
          <DialogHeader>
            <DialogTitle>Lab Result Details</DialogTitle>
          </DialogHeader>

          {selectedResult && (
            <div className="space-y-4">
              <div className="rounded-md border border-border/60 bg-muted/30 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold">
                    {selectedResult.testName}
                  </h3>
                  <Badge
                    variant="outline"
                    className={getStatusClasses(selectedResult.status)}
                  >
                    {selectedResult.status}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Result: {selectedResult.resultValue}
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-md border border-border/60 p-3">
                  <p className="text-xs text-muted-foreground">Reference</p>
                  <p className="font-medium">{selectedResult.referenceRange}</p>
                </div>
                <div className="rounded-md border border-border/60 p-3">
                  <p className="text-xs text-muted-foreground">Appointment</p>
                  <p className="font-medium">
                    #{selectedResult.appointmentId}
                  </p>
                </div>
                <div className="rounded-md border border-border/60 p-3">
                  <p className="text-xs text-muted-foreground">Patient</p>
                  <p className="font-medium">#{selectedResult.patientId}</p>
                </div>
                <div className="rounded-md border border-border/60 p-3">
                  <p className="text-xs text-muted-foreground">Updated</p>
                  <p className="font-medium">
                    {selectedResult.updatedAt
                      ? new Date(selectedResult.updatedAt).toLocaleString()
                      : "Not available"}
                  </p>
                </div>
              </div>

              {selectedResult.remarks && (
                <div className="rounded-md border border-border/60 p-3">
                  <p className="text-xs text-muted-foreground">Remarks</p>
                  <p className="text-sm">{selectedResult.remarks}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
