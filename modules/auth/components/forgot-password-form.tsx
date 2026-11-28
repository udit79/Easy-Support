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
import { forgotPasswordAction } from "@/modules/auth/actions";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/modules/auth/schemas";

export function ForgotPasswordForm() {
  const [submitted, setSubmitted] = useState(false);
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: ForgotPasswordInput) {
    const result = await forgotPasswordAction(values);

    if (result.success) {
      setSubmitted(true);
      return;
    }

    if (result.error) {
      form.setError("root", { message: result.error });
    }

    for (const [field, messages] of Object.entries(result.fieldErrors ?? {})) {
      form.setError(field as keyof ForgotPasswordInput, {
        message: messages[0],
      });
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Forgot your password?</CardTitle>
        <CardDescription>
          Enter your email and we&apos;ll send a reset link if an account matches.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                If an account exists for that email, you&apos;ll receive a
                password reset link shortly.
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
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    {...form.register("email")}
                  />
                  <FieldError errors={[form.formState.errors.email]} />
                </Field>

                <Button
                  type="submit"
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? "Sending..."
                    : "Send reset link"}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Remembered your password?{" "}
                  <Link
                    href="/sign-in"
                    className="text-primary underline-offset-4 hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              </FieldGroup>
            </form>
          </>
        )}
      </CardContent>
    </Card>
  );
}
