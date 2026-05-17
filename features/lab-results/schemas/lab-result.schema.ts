import * as z from "zod";

export const labResultSchema = z.object({
  appointmentId: z.coerce.number().min(1, "Appointment is required"),
  patientId: z.coerce.number().min(1, "Patient is required"),
  labTestId: z.coerce.number().min(1, "Lab test is required").optional(),
  testName: z.string().min(1, "Test name is required"),
  resultValue: z.string().min(1, "Result value is required"),
  referenceRange: z.string().min(1, "Reference range is required"),
  status: z.string().min(1, "Status is required"),
  remarks: z.string().optional(),
  testDate: z.string().optional(),
});

export type LabResultValues = z.infer<typeof labResultSchema>;
