"use client";

import { useForm } from "@tanstack/react-form";
import { CalendarClock, Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@/components/ui";
import { formatValidationErrors, getErrorMessage } from "@/lib/utils";
import { appointmentApi } from "../api/appointment.api";
import { appointmentCreateSchema } from "../schemas/appointment.schema";
import type { AppointmentType } from "../types/appointment.types";

interface AppointmentFormProps {
  patientId: number;
  onCreated?: () => void;
  onCancel?: () => void;
}

const appointmentTypes: Array<{
  value: AppointmentType;
  label: string;
}> = [
  { value: "CONSULTATION", label: "Consultation" },
  { value: "FOLLOW_UP", label: "Follow up" },
  { value: "ROUTINE_CHECKUP", label: "Routine checkup" },
  { value: "EMERGENCY", label: "Emergency" },
];

interface AppointmentFormValues {
  patientId: number;
  doctorId: number;
  appointmentDate: string;
  appointmentTime: string;
  appointmentType: string;
  notes?: string;
}

export function AppointmentForm({
  patientId,
  onCreated,
  onCancel,
}: AppointmentFormProps) {
  const defaultValues: AppointmentFormValues = {
    patientId,
    doctorId: 0,
    appointmentDate: "",
    appointmentTime: "",
    appointmentType: "CONSULTATION",
    notes: "",
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: appointmentCreateSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const payload = appointmentCreateSchema.parse({
          ...value,
          patientId,
          notes: value.notes?.trim() || undefined,
        });

        await appointmentApi.create({
          ...payload,
          appointmentType: payload.appointmentType as AppointmentType,
        });

        toast.success("Appointment scheduled", {
          description: "Your appointment request has been submitted.",
        });
        form.reset();
        form.setFieldValue("patientId", patientId);
        onCreated?.();
      } catch (error) {
        toast.error("Could not schedule appointment", {
          description: getErrorMessage(error),
        });
      }
    },
  });

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.Field name="patientId">
        {(field) => <input type="hidden" value={field.state.value} readOnly />}
      </form.Field>

      <form.Field
        name="doctorId"
        validators={{ onChange: appointmentCreateSchema.shape.doctorId }}
      >
        {(field) => (
          <div className="grid gap-2">
            <Label htmlFor={field.name}>Doctor ID *</Label>
            <Input
              id={field.name}
              min={1}
              type="number"
              value={field.state.value || ""}
              onBlur={field.handleBlur}
              onChange={(event) =>
                field.handleChange(Number(event.target.value))
              }
              placeholder="Enter doctor ID"
            />
            {field.state.meta.errors.length > 0 && (
              <p className="form-error">
                {formatValidationErrors(field.state.meta.errors)}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <form.Field
          name="appointmentDate"
          validators={{
            onChange: appointmentCreateSchema.shape.appointmentDate,
          }}
        >
          {(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Date *</Label>
              <Input
                id={field.name}
                type="date"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="form-error">
                  {formatValidationErrors(field.state.meta.errors)}
                </p>
              )}
            </div>
          )}
        </form.Field>

        <form.Field
          name="appointmentTime"
          validators={{
            onChange: appointmentCreateSchema.shape.appointmentTime,
          }}
        >
          {(field) => (
            <div className="grid gap-2">
              <Label htmlFor={field.name}>Time *</Label>
              <Input
                id={field.name}
                type="time"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
              />
              {field.state.meta.errors.length > 0 && (
                <p className="form-error">
                  {formatValidationErrors(field.state.meta.errors)}
                </p>
              )}
            </div>
          )}
        </form.Field>
      </div>

      <form.Field
        name="appointmentType"
        validators={{ onChange: appointmentCreateSchema.shape.appointmentType }}
      >
        {(field) => (
          <div className="grid gap-2">
            <Label>Appointment Type *</Label>
            <Select value={field.state.value} onValueChange={field.handleChange}>
              <SelectTrigger className="w-full">
                <CalendarClock className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="Select appointment type" />
              </SelectTrigger>
              <SelectContent>
                {appointmentTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {field.state.meta.errors.length > 0 && (
              <p className="form-error">
                {formatValidationErrors(field.state.meta.errors)}
              </p>
            )}
          </div>
        )}
      </form.Field>

      <form.Field
        name="notes"
        validators={{ onChange: appointmentCreateSchema.shape.notes }}
      >
        {(field) => (
          <div className="grid gap-2">
            <Label htmlFor={field.name}>Notes</Label>
            <Textarea
              id={field.name}
              maxLength={255}
              rows={4}
              value={field.state.value || ""}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              placeholder="Add symptoms or anything the doctor should know"
            />
            <div className="flex justify-between gap-3 text-xs text-muted-foreground">
              <span>
                {field.state.meta.errors.length > 0
                  ? formatValidationErrors(field.state.meta.errors)
                  : "Optional, up to 255 characters"}
              </span>
              <span>{field.state.value?.length || 0}/255</span>
            </div>
          </div>
        )}
      </form.Field>

      <form.Subscribe
        selector={(state) => [
          state.values.doctorId,
          state.values.appointmentDate,
          state.values.appointmentTime,
          state.values.appointmentType,
          state.canSubmit,
          state.isSubmitting,
        ]}
      >
        {([
          doctorId,
          appointmentDate,
          appointmentTime,
          appointmentType,
          canSubmit,
          isSubmitting,
        ]) => {
          const hasRequiredFields =
            Number(doctorId) > 0 &&
            String(appointmentDate).trim().length > 0 &&
            String(appointmentTime).trim().length > 0 &&
            String(appointmentType).trim().length > 0;

          return (
            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={Boolean(isSubmitting)}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={
                  !hasRequiredFields ||
                  !Boolean(canSubmit) ||
                  Boolean(isSubmitting)
                }
              >
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Send className="mr-2 h-4 w-4" />
                )}
                Schedule Appointment
              </Button>
            </div>
          );
        }}
      </form.Subscribe>
    </form>
  );
}
