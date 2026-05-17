"use server";

import { apiRequest } from "@/lib/api-client";
import { getErrorMessage } from "@/lib/utils";

interface VerificationRequest {
  email: string;
  code: string;
}

interface ResendVerificationRequest {
  email: string;
}

interface ActionResult {
  success: boolean;
  error?: string;
}

function extractServerMessage(error: unknown) {
  if (!error || typeof error !== "object") return null;
  const body = (error as { body?: Record<string, unknown> }).body;
  if (!body) return null;

  const message = body.message || body.error || body.detail;
  return typeof message === "string" && message.trim() ? message : null;
}

async function requestAction<T>(
  endpoint: string,
  payload: T,
): Promise<ActionResult> {
  try {
    await apiRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    return { success: true };
  } catch (error: unknown) {
    const serverMessage = extractServerMessage(error);

    return {
      success: false,
      error: serverMessage || getErrorMessage(error),
    };
  }
}

export async function verifyAccountAction(values: VerificationRequest) {
  return requestAction("/auth/verify", values);
}

export async function resendVerificationAction(
  values: ResendVerificationRequest,
) {
  return requestAction("/auth/resend-verification", values);
}
