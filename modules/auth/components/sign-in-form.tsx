 "use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signInAction } from "@/modules/auth/actions";
import { signInSchema, type SignInInput } from "@/modules/auth/schemas";

export function SignInForm({
  verificationStatus,
}: {
  verificationStatus?: "verified" | "error";
}) {
  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: SignInInput) {
    const result = await signInAction(values);

    if (!result.success) {
      if (result.error) {
        form.setError("root", { message: result.error });
      }

      for (const [field, messages] of Object.entries(result.fieldErrors ?? {})) {
        form.setError(field as keyof SignInInput, {
          message: messages[0],
        });
      }
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to your account.</CardDescription>
      </CardHeader>
      <CardContent>
        {verificationStatus === "verified" && (
          <Alert className="mb-4">
            <AlertDescription>
              Your email is verified. You can now sign in.
            </AlertDescription>
          </Alert>
        )}

        {verificationStatus === "error" && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              This verification link is invalid or expired. Please sign in or
              contact support for help.
            </AlertDescription>
          </Alert>
        )}

        {form.formState.errors.root?.message && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{form.formState.errors.root.message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" type="email" autoComplete="email" {...form.register("email")} />
              <FieldError errors={[form.formState.errors.email]} />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...form.register("password")}
              />
              <FieldError errors={[form.formState.errors.password]} />
            </Field>

            <div className="-mt-2 text-right text-sm">
              <Link
                href="/forgot-password"
                className="text-primary underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="bg-emerald-600 text-white hover:bg-emerald-700"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/sign-up" className="text-primary underline-offset-4 hover:underline">
                Sign up
              </Link>
            </p>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}