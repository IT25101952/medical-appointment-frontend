"use server";

import { apiRequest } from "@/lib/api-client";

export async function registerAction(values: any) {
  try {
    const endpoint = `/auth/register/${values.role.toLowerCase()}`;

    await apiRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(values),
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
