"use client";

import { useEffect, useState } from "react";
import { Button, ScrollArea, DataTable, type Column } from "@/components/ui";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import {
  roomScheduleApi,
  type RoomScheduleResponse,
} from "@/features/room-schedule";
import { apiRequest } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/utils";

interface DoctorInfo {
  userId: number;
  roleType: number;
}

export default function DoctorRoomSchedulePage() {
  const [schedules, setSchedules] = useState<RoomScheduleResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [doctorInfo, setDoctorInfo] = useState<DoctorInfo | null>(null);

  useEffect(() => {
    fetchDoctorInfo();
  }, []);

  useEffect(() => {
    if (doctorInfo?.userId) {
      fetchSchedules();
    }
  }, [doctorInfo]);

  async function fetchDoctorInfo() {
    try {
      const doctor = await apiRequest<DoctorInfo>("/users/me", {
        method: "GET",
        cache: "no-store",
      });

      setDoctorInfo(doctor);
    } catch (error) {
      toast.error(getErrorMessage(error));
      setIsLoading(false);
    }
  }

  async function fetchSchedules() {
    if (!doctorInfo?.userId) return;
    setIsLoading(true);
    try {
      const data = await roomScheduleApi.getAllDoctorSchedules(
        doctorInfo.userId,
      );
      setSchedules(data || []);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="col-start-1 col-end-14">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">My Room Schedules</h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            View all your assigned room schedules across the week.
          </p>
        </div>
        <Button onClick={fetchSchedules} size="sm" variant="outline">
          <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>

      <DataTable
        columns={[
          { header: "Schedule ID", accessor: "roomScheduleId" },
          {
            header: "Room",
            render: (schedule: RoomScheduleResponse) =>
              `Room ${schedule.roomNumber}`,
          },
          { header: "Day", accessor: "dayOfWeek" },
          {
            header: "Time Slot",
            render: (schedule: RoomScheduleResponse) =>
              `${schedule.startTime} - ${schedule.endTime}`,
          },
          {
            header: "Created At",
            render: (schedule: RoomScheduleResponse) =>
              new Date(schedule.createdAt).toLocaleDateString(),
          },
        ]}
        data={schedules}
        pageable={true}
        pageSize={10}
        showActions={false}
        emptyMessage="No schedules assigned yet."
      />
    </div>
  );
}
