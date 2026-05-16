"use server";

import { cookies } from "next/headers";
import { apiRequest } from "@/lib/api-client";

export async function loginAction(values: any) {
  try {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(values),
    });

    const cookieStore = await cookies();

    // Store JWT
    cookieStore.set("token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    // Store Role Type (1=Patient, 2=Doctor, 3=Staff, 4=Admin)
    cookieStore.set("user-role", data.user.roleType.toString(), { path: "/" });

    return {
      success: true,
      role: data.user.roleType,
      roleName: data.user.roleName,
      accessLevel: data.user.accessLevel,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
