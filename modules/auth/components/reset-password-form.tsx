"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { resetPasswordAction } from "@/modules/auth/actions";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/modules/auth/schemas";

export function ResetPasswordForm({
  token,
  invalidLink = false,
}: {
  token?: string;
  invalidLink?: boolean;
}) {
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token ?? "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: ResetPasswordInput) {
    const result = await resetPasswordAction(values);

    if (result.success) {
      setSubmitted(true);
      return;
    }

    if (result.error) {
      form.setError("root", { message: result.error });
    }

    for (const [field, messages] of Object.entries(result.fieldErrors ?? {})) {
      form.setError(field as keyof ResetPasswordInput, {
        message: messages[0],
      });
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Reset your password</CardTitle>
        <CardDescription>
          Choose a new password for your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {invalidLink || !token ? (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                This reset link is invalid or expired. Request a new one to
                continue.
              </AlertDescription>
            </Alert>
            <p className="text-center text-sm">
              <Link
                href="/forgot-password"
                className="text-primary underline-offset-4 hover:underline"
              >
                Request a new reset link
              </Link>
            </p>
          </div>
        ) : submitted ? (
          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                Your password has been updated. You can now sign in.
              </AlertDescription>
            </Alert>
            <p className="text-center text-sm">
              <Link
                href="/sign-in"
                className="text-primary underline-offset-4 hover:underline"
              >
                Back to sign in
              </Link>
            </p>
          </div>
        ) : (
          <>
            {form.formState.errors.root?.message && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>
                  {form.formState.errors.root.message}
                </AlertDescription>
              </Alert>
            )}

            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="newPassword">New password</FieldLabel>
                  <Input
                    id="newPassword"
                    type="password"
                    autoComplete="new-password"
                    {...form.register("newPassword")}
                  />
                  <FieldError errors={[form.formState.errors.newPassword]} />
                </Field>

                <Field>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirm new password
                  </FieldLabel>
                  <Input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    {...form.register("confirmPassword")}
                  />
                  <FieldError errors={[form.formState.errors.confirmPassword]} />
                </Field>

                <Button
                  type="submit"
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? "Updating..."
                    : "Update password"}
                </Button>
              </FieldGroup>
            </form>
          </>
        )}
      </CardContent>
    </Card>
  );
}
