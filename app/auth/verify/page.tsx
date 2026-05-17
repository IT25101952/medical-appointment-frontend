import { Suspense } from "react";
import { VerifyForm } from "@/features/auth/components/verify-form";

export default function VerifyPage() {
  return (
    <main className="col-start-1 col-end-7">
      <div className="w-full max-w-md rounded-2xl border bg-background p-6 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold">Verify Your Account</h1>
        </div>

        <Suspense fallback={null}>
          <VerifyForm />
        </Suspense>
      </div>
    </main>
  );
}
