"use server";

import { apiRequest } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/utils";

interface VerifyValues {
  email: string;
  code: string;
}

interface ResendValues {
  email: string;
}

export async function verifyAccountAction(values: VerifyValues) {
  try {
    await apiRequest("/auth/verify", {
      method: "POST",
      body: JSON.stringify(values),
    });

    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}

export async function resendVerificationAction(values: ResendValues) {
  try {
    await apiRequest("/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify(values),
    });

    return { success: true };
  } catch (error: unknown) {
    return {
      success: false,
      error: getErrorMessage(error),
    };
  }
}
