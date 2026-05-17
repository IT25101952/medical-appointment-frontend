"use client";

import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, Phone, IdCard } from "lucide-react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { registerAction } from "@/lib/actions/register-action";
import { formatValidationErrors } from "@/lib/utils";

interface RegisterFormValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  nic: string;
}

function validateEmail(email: string): string | undefined {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required";
  if (!re.test(email)) return "Please enter a valid email address";
  return undefined;
}

function validateRequired(
  value: string,
  fieldName: string,
): string | undefined {
  if (!value || value.trim().length === 0) return `${fieldName} is required`;
  return undefined;
}

export function RegisterForm() {
  const router = useRouter();

  const form = useForm<RegisterFormValues>({
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
      nic: "",
    },
    onSubmit: async ({ value }) => {
      try {
        const result = await registerAction({
          ...value,
          role: "patient",
        });

        if (result.success) {
          toast.success("Registration successful!", {
            description: "Redirecting to login...",
          });
          setTimeout(() => {
            router.push("/portal");
          }, 1000);
        } else {
          toast.error("Registration failed", {
            description: result.error || "Please try again",
          });
        }
      } catch {
        toast.error("An error occurred", {
          description: "Please try again later",
        });
      }
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <div className="space-y-3">
        {/* Name Row */}
        <div className="grid grid-cols-2 gap-3">
          <form.Field name="firstName">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name} className="text-xs">
                  First Name
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <User className="size-4 text-muted-foreground/60" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id={field.name}
                    type="text"
                    placeholder="John"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                </InputGroup>
                {field.state.meta.errors && (
                  <p className="form-error text-xs">
                    {formatValidationErrors(field.state.meta.errors)}
                  </p>
                )}
              </Field>
            )}
          </form.Field>

          <form.Field name="lastName">
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name} className="text-xs">
                  Last Name
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <User className="size-4 text-muted-foreground/60" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id={field.name}
                    type="text"
                    placeholder="Doe"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                </InputGroup>
                {field.state.meta.errors && (
                  <p className="form-error text-xs">
                    {formatValidationErrors(field.state.meta.errors)}
                  </p>
                )}
              </Field>
            )}
          </form.Field>
        </div>

        {/* Email */}
        <form.Field
          name="email"
          validators={{
            onChange: (value) => validateEmail(value),
          }}
        >
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name} className="text-xs">
                Email Address
              </FieldLabel>
              <InputGroup>
                <InputGroupAddon align="inline-start">
                  <Mail className="size-4 text-muted-foreground/60" />
                </InputGroupAddon>
                <InputGroupInput
                  id={field.name}
                  type="email"
                  placeholder="john@example.com"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </InputGroup>
              {field.state.meta.errors && (
                <p className="form-error text-xs">
                  {formatValidationErrors(field.state.meta.errors)}
                </p>
              )}
            </Field>
          )}
        </form.Field>

        {/* Password */}
        <form.Field
          name="password"
          validators={{
            onChange: (value) => {
              if (!value) return "Password is required";
              if (value.length < 8)
                return "Password must be at least 8 characters";
              return undefined;
            },
          }}
        >
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name} className="text-xs">
                Password
              </FieldLabel>
              <InputGroup>
                <InputGroupAddon align="inline-start">
                  <Lock className="size-4 text-muted-foreground/60" />
                </InputGroupAddon>
                <InputGroupInput
                  id={field.name}
                  type="password"
                  placeholder="••••••••"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                />
              </InputGroup>
              {field.state.meta.errors && (
                <p className="form-error text-xs">
                  {formatValidationErrors(field.state.meta.errors)}
                </p>
              )}
            </Field>
          )}
        </form.Field>

        {/* Phone and NIC Row */}
        <div className="grid grid-cols-2 gap-3">
          <form.Field
            name="phone"
            validators={{
              onChange: (value) => validateRequired(value, "Phone"),
            }}
          >
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name} className="text-xs">
                  Phone
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <Phone className="size-4 text-muted-foreground/60" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id={field.name}
                    type="tel"
                    placeholder="+1234567890"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                </InputGroup>
                {field.state.meta.errors && (
                  <p className="form-error text-xs">
                    {formatValidationErrors(field.state.meta.errors)}
                  </p>
                )}
              </Field>
            )}
          </form.Field>

          <form.Field
            name="nic"
            validators={{
              onChange: (value) => validateRequired(value, "NIC"),
            }}
          >
            {(field) => (
              <Field>
                <FieldLabel htmlFor={field.name} className="text-xs">
                  NIC
                </FieldLabel>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <IdCard className="size-4 text-muted-foreground/60" />
                  </InputGroupAddon>
                  <InputGroupInput
                    id={field.name}
                    type="text"
                    placeholder="123456789V"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                </InputGroup>
                {field.state.meta.errors && (
                  <p className="form-error text-xs">
                    {formatValidationErrors(field.state.meta.errors)}
                  </p>
                )}
              </Field>
            )}
          </form.Field>
        </div>
      </div>

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
      >
        {([canSubmit, isSubmitting]) => (
          <Button
            type="submit"
            className="w-full"
            disabled={!canSubmit || isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              "Create Account"
            )}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
