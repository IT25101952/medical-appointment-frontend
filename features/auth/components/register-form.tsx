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
import { patientRegisterFormSchema } from "@/lib/validations/auth";

export function RegisterForm() {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      phone: "",
      nic: "",
    },
    validators: {
      onSubmit: patientRegisterFormSchema,
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
            router.push("/patient/login");
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
          <form.Field
            name="firstName"
            validators={{ onChange: patientRegisterFormSchema.shape.firstName }}
          >
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

          <form.Field
            name="lastName"
            validators={{ onChange: patientRegisterFormSchema.shape.lastName }}
          >
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
          validators={{ onChange: patientRegisterFormSchema.shape.email }}
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
          validators={{ onChange: patientRegisterFormSchema.shape.password }}
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
            validators={{ onChange: patientRegisterFormSchema.shape.phone }}
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
            validators={{ onChange: patientRegisterFormSchema.shape.nic }}
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
        selector={(state) => [
          state.values.email,
          state.values.password,
          state.values.firstName,
          state.values.lastName,
          state.values.phone,
          state.values.nic,
          state.canSubmit,
          state.isSubmitting,
        ]}
      >
        {([
          email,
          password,
          firstName,
          lastName,
          phone,
          nic,
          canSubmit,
          isSubmitting,
        ]) => {
          const hasRequiredFields = [
            email,
            password,
            firstName,
            lastName,
            phone,
            nic,
          ].every((value) => String(value).trim().length > 0);

          if (!hasRequiredFields) {
            return null;
          }

          return (
            <Button
              type="submit"
              className="w-full"
              disabled={!Boolean(canSubmit) || Boolean(isSubmitting)}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Create Account"
              )}
            </Button>
          );
        }}
      </form.Subscribe>
    </form>
  );
}
