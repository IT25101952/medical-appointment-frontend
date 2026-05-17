"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Mail, Lock, User, Phone, IdCard } from "lucide-react";
import { apiRequest } from "@/lib/api-client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AdminUserRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const ROLE_OPTIONS = [
  { value: 1, label: "ADMIN" },
  { value: 2, label: "STAFF" },
  { value: 3, label: "DOCTOR" },
];

interface RegisterAdminValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  nic: string;
  roleType: string;
}

export function AdminUserRegistrationDialog({
  open,
  onOpenChange,
  onSuccess,
}: AdminUserRegistrationDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterAdminValues>({
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
      nic: "",
      roleType: "3",
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      try {
        await apiRequest("/users", {
          method: "POST",
          body: JSON.stringify({
            email: value.email,
            password: value.password,
            firstName: value.firstName,
            lastName: value.lastName,
            phone: value.phone,
            NIC: value.nic,
            roleType: parseInt(value.roleType),
            isActive: true,
          }),
        });

        toast.success("User registered successfully!");
        onOpenChange(false);
        onSuccess?.();
        form.reset();
      } catch (error) {
        toast.error("Failed to register user", {
          description:
            error instanceof Error ? error.message : "Please try again",
        });
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Register New User</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          {/* Role Selection */}
          <form.Field name="roleType">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Role *</FieldLabel>
                <Select
                  value={field.state.value}
                  onValueChange={field.handleChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLE_OPTIONS.map((role) => (
                      <SelectItem
                        key={role.value}
                        value={role.value.toString()}
                      >
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            )}
          </form.Field>

          {/* Name Row */}
          <div className="grid grid-cols-2 gap-3">
            <form.Field name="firstName">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name} className="text-xs">
                    First Name *
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <User className="size-4 text-muted-foreground/60" />
                    </InputGroupAddon>
                    <InputGroupInput
                      id={field.name}
                      placeholder="John"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </InputGroup>
                </Field>
              )}
            </form.Field>

            <form.Field name="lastName">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name} className="text-xs">
                    Last Name *
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <User className="size-4 text-muted-foreground/60" />
                    </InputGroupAddon>
                    <InputGroupInput
                      id={field.name}
                      placeholder="Doe"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </InputGroup>
                </Field>
              )}
            </form.Field>
          </div>

          {/* Email */}
          <form.Field name="email">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Email Address *</FieldLabel>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <Mail className="size-4 text-muted-foreground/60" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id={field.name}
                    type="email"
                    placeholder="john@medical.com"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </InputGroup>
              </Field>
            )}
          </form.Field>

          {/* Password */}
          <form.Field name="password">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name}>Password *</FieldLabel>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <Lock className="size-4 text-muted-foreground/60" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id={field.name}
                    type="password"
                    placeholder="••••••••"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                </InputGroup>
              </Field>
            )}
          </form.Field>

          {/* Phone and NIC Row */}
          <div className="grid grid-cols-2 gap-3">
            <form.Field name="phone">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name} className="text-xs">
                    Phone *
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <Phone className="size-4 text-muted-foreground/60" />
                    </InputGroupAddon>
                    <InputGroupInput
                      id={field.name}
                      placeholder="+1234567890"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </InputGroup>
                </Field>
              )}
            </form.Field>

            <form.Field name="nic">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name} className="text-xs">
                    NIC *
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupAddon align="inline-start">
                      <IdCard className="size-4 text-muted-foreground/60" />
                    </InputGroupAddon>
                    <InputGroupInput
                      id={field.name}
                      placeholder="123456789V"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </InputGroup>
                </Field>
              )}
            </form.Field>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register User"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
