"use client";

import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, UserPlus, Mail, Lock } from "lucide-react";
import { useRouter } from "next/router";
import {
  registerDoctorSchema,
  registerAdminSchema,
  registerStaffSchema,
} from "@/lib/validations/auth";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export function RegisterForm() {
  <div className="max-w-lg mx-auto mt-16 p-6 rounded-lg shadow-lg bg-white">
    <h2 className="text-2xl font-semibold text-center mb-6">
      Create Your Account
    </h2>
    <RegisterForm />
  </div>;
}
