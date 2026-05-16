import { apiRequest } from "@/lib/api-client";
import { PrescriptionList } from "@/components/admin/prescription-list";
import { PaginationControls } from "@/components/admin/pagination-controls";

export default async function AdminPrescriptionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 0;
  const data = await apiRequest(`/prescription?page=${page}&size=10`, {
    method: "GET",
    cache: "no-store",
  });

  return (
    <div className="space-y-6 col-span-1 col-span-13">
      <div className="flex flex-col space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Prescriptions</h1>
        <p className="text-muted-foreground">Managing medical records</p>
      </div>

      <div className="rounded-3xl border border-border/60 bg-card/50 overflow-hidden shadow-sm">
        <PrescriptionList data={data.content} />
        <PaginationControls currentPage={page} totalPages={data.totalPages} />
      </div>
    </div>
  );
}
