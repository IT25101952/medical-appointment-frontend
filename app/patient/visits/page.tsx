"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  MessageSquare,
  Plus,
  Send,
  Star,
  Trash2,
  CalendarDays,
  Clock3,
  Eye,
  RefreshCcw,
  Stethoscope,
} from "lucide-react";
import { toast } from "sonner";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
  Textarea,
} from "@/components/ui";
import { AppointmentDetailsDialog } from "@/features/appointments/components/appointment-details-dialog";
import { AppointmentStatusBadge } from "@/features/appointments/components/appointment-status-badge";
import { appointmentApi } from "@/features/appointments/api/appointment.api";
import type { AppointmentResponse } from "@/features/appointments/types/appointment.types";
import { feedbackApi } from "@/features/feedback/api/feedback.api";
import type { FeedbackResponse } from "@/features/feedback/types/feedback.types";
import { apiRequest } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/utils";

interface CurrentUser {
  userId: number;
  firstName?: string;
  lastName?: string;
}

function toComparableDateTime(value: AppointmentResponse) {
  return new Date(
    `${value.appointmentDate}T${value.appointmentTime}`,
  ).getTime();
}

export default function PatientVisitsPage() {
  const [patient, setPatient] = useState<CurrentUser | null>(null);
  const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
  const [feedback, setFeedback] = useState<FeedbackResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentResponse | null>(null);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [feedbackActionDialogOpen, setFeedbackActionDialogOpen] =
    useState(false);
  const [feedbackMode, setFeedbackMode] = useState<"create" | "edit">("create");
  const [targetAppointment, setTargetAppointment] =
    useState<AppointmentResponse | null>(null);
  const [editingFeedback, setEditingFeedback] =
    useState<FeedbackResponse | null>(null);
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComments, setFeedbackComments] = useState("");
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingFeedback, setDeletingFeedback] =
    useState<FeedbackResponse | null>(null);
  const [isDeletingFeedback, setIsDeletingFeedback] = useState(false);

  const loadVisits = useCallback(async (patientId?: number) => {
    if (!patientId) return;

    setIsLoading(true);
    try {
      const data = await appointmentApi.getMyVisits(patientId);
      setAppointments(data || []);
    } catch (error) {
      toast.error("Could not load visits", {
        description: getErrorMessage(error),
      });
      setAppointments([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadFeedback = useCallback(async (patientId?: number) => {
    if (!patientId) return;

    setIsFeedbackLoading(true);
    try {
      const data = await feedbackApi.getByPatient(patientId);
      setFeedback(data || []);
    } catch (error) {
      toast.error("Could not load feedback", {
        description: getErrorMessage(error),
      });
      setFeedback([]);
    } finally {
      setIsFeedbackLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadPatientAndVisits = async () => {
      try {
        const currentUser = await apiRequest<CurrentUser>("/users/me", {
          method: "GET",
          cache: "no-store",
        });

        setPatient(currentUser);
        await Promise.all([
          loadVisits(currentUser.userId),
          loadFeedback(currentUser.userId),
        ]);
      } catch (error) {
        toast.error("Could not load patient profile", {
          description: getErrorMessage(error),
        });
        setIsLoading(false);
        setIsFeedbackLoading(false);
      }
    };

    loadPatientAndVisits();
  }, [loadFeedback, loadVisits]);

  const sortedAppointments = useMemo(() => {
    return [...appointments].sort(
      (a, b) => toComparableDateTime(b) - toComparableDateTime(a),
    );
  }, [appointments]);

  const feedbackByAppointment = useMemo(() => {
    const map = new Map<number, FeedbackResponse>();

    feedback.forEach((item) => {
      if (!map.has(item.appointmentId)) {
        map.set(item.appointmentId, item);
      }
    });

    return map;
  }, [feedback]);

  function openCreateFeedbackDialog(appointment: AppointmentResponse) {
    setTargetAppointment(appointment);
    setEditingFeedback(null);
    setFeedbackMode("create");
    setFeedbackRating(0);
    setFeedbackComments("");
    setFeedbackDialogOpen(true);
  }

  function openEditFeedbackDialog(
    appointment: AppointmentResponse,
    item: FeedbackResponse,
  ) {
    setTargetAppointment(appointment);
    setEditingFeedback(item);
    setFeedbackMode("edit");
    setFeedbackRating(item.rating);
    setFeedbackComments(item.comments || "");
    setFeedbackDialogOpen(true);
  }

  function openDeleteFeedbackDialog(item: FeedbackResponse) {
    setDeletingFeedback(item);
    setDeleteDialogOpen(true);
  }

  function openFeedbackActionDialog(
    appointment: AppointmentResponse,
    item: FeedbackResponse,
  ) {
    setTargetAppointment(appointment);
    setEditingFeedback(item);
    setFeedbackActionDialogOpen(true);
  }

  async function submitFeedback() {
    if (!patient || !targetAppointment || feedbackRating < 1) {
      toast.error("Please select a rating.");
      return;
    }

    setIsSubmittingFeedback(true);
    try {
      if (feedbackMode === "create") {
        await feedbackApi.create({
          appointmentId: targetAppointment.appointmentId,
          patientId: patient.userId,
          doctorId: targetAppointment.doctorId,
          rating: feedbackRating,
          comments: feedbackComments.trim() || undefined,
        });

        toast.success("Feedback submitted", {
          description: "Thank you for sharing your visit experience.",
        });
      } else if (editingFeedback) {
        await feedbackApi.update(editingFeedback.feedbackId, {
          rating: feedbackRating,
          comments: feedbackComments.trim() || undefined,
        });

        toast.success("Feedback updated", {
          description: "Your feedback has been updated.",
        });
      }

      setFeedbackDialogOpen(false);
      await loadFeedback(patient.userId);
    } catch (error) {
      toast.error(
        feedbackMode === "create"
          ? "Could not submit feedback"
          : "Could not update feedback",
        {
          description: getErrorMessage(error),
        },
      );
    } finally {
      setIsSubmittingFeedback(false);
    }
  }

  async function deleteFeedback() {
    if (!deletingFeedback || !patient) return;

    setIsDeletingFeedback(true);
    try {
      await feedbackApi.remove(deletingFeedback.feedbackId);
      toast.success("Feedback deleted", {
        description: "Your feedback has been removed.",
      });
      setDeleteDialogOpen(false);
      setDeletingFeedback(null);
      await loadFeedback(patient.userId);
    } catch (error) {
      toast.error("Could not delete feedback", {
        description: getErrorMessage(error),
      });
    } finally {
      setIsDeletingFeedback(false);
    }
  }

  return (
    <div className="col-start-1 col-end-14 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-md border border-border/70 px-2.5 py-1 text-xs font-medium text-muted-foreground">
            <CalendarDays className="h-3.5 w-3.5" />
            Patient visits
          </div>
          <h1 className="text-2xl font-semibold">My Visits</h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Review your appointment history and open each visit to view full
            details.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            loadVisits(patient?.userId);
            loadFeedback(patient?.userId);
          }}
          disabled={!patient?.userId || isLoading || isFeedbackLoading}
        >
          <RefreshCcw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Card className="border-border/60 bg-card/80">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Appointment Details
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">
              Loading your visits...
            </p>
          ) : sortedAppointments.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No visits found for your account.
            </p>
          ) : (
            sortedAppointments.map((appointment) => (
              <div
                key={appointment.appointmentId}
                className="rounded-md border border-border/60 p-4"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">
                        Appointment #{appointment.appointmentNumber}
                      </p>
                      <AppointmentStatusBadge status={appointment.status} />
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="h-4 w-4" />
                        {appointment.appointmentDate}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock3 className="h-4 w-4" />
                        {appointment.appointmentTime}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Stethoscope className="h-4 w-4" />
                        Doctor #{appointment.doctorId}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedAppointment(appointment)}
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>

                    {feedbackByAppointment.get(appointment.appointmentId) ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          openFeedbackActionDialog(
                            appointment,
                            feedbackByAppointment.get(
                              appointment.appointmentId,
                            ) as FeedbackResponse,
                          )
                        }
                      >
                        <MessageSquare className=" h-4 w-4" />
                        View Feedback
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openCreateFeedbackDialog(appointment)}
                      >
                        <Plus className="h-4 w-4" />
                        Add Feedback
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <AppointmentDetailsDialog
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
      />

      <Dialog
        open={feedbackActionDialogOpen}
        onOpenChange={setFeedbackActionDialogOpen}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Feedback Actions</DialogTitle>
            <DialogDescription>
              Choose what you want to do with your feedback.
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-md border border-border/60 bg-muted/20 p-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-current" />
              {editingFeedback?.rating ?? 0}/5
              <span>- {editingFeedback?.status}</span>
            </div>
            {editingFeedback?.comments ? (
              <p className="mt-2 text-sm text-muted-foreground">
                {editingFeedback.comments}
              </p>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setFeedbackActionDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (targetAppointment && editingFeedback) {
                  setFeedbackActionDialogOpen(false);
                  openEditFeedbackDialog(targetAppointment, editingFeedback);
                }
              }}
            >
              Edit
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => {
                if (editingFeedback) {
                  setFeedbackActionDialogOpen(false);
                  openDeleteFeedbackDialog(editingFeedback);
                }
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {feedbackMode === "create" ? "Add Feedback" : "Edit Feedback"}
            </DialogTitle>
            <DialogDescription>
              {feedbackMode === "create"
                ? "Share your visit experience for this appointment."
                : "Update your feedback. Backend edit rules still apply."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Rating *</Label>
              <div className="flex flex-wrap gap-2">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button
                    key={rating}
                    type="button"
                    size="sm"
                    variant={feedbackRating === rating ? "default" : "outline"}
                    onClick={() => setFeedbackRating(rating)}
                  >
                    <Star
                      className={feedbackRating >= rating ? "fill-current" : ""}
                    />
                    {rating}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="visit-feedback-comments">Comments</Label>
              <Textarea
                id="visit-feedback-comments"
                maxLength={255}
                rows={4}
                placeholder="Tell us what went well or what could improve"
                value={feedbackComments}
                onChange={(event) => setFeedbackComments(event.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {feedbackComments.length}/255
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setFeedbackDialogOpen(false)}
              disabled={isSubmittingFeedback}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={submitFeedback}
              disabled={isSubmittingFeedback || feedbackRating < 1}
            >
              {feedbackMode === "create" ? "Submit" : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Feedback</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this feedback? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              disabled={isDeletingFeedback}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={deleteFeedback}
              disabled={isDeletingFeedback}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
