"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { auth } from "@/lib/auth";
import {
  signInSchema,
  signUpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  type ForgotPasswordInput,
  type ResetPasswordInput,
  type SignInInput,
  type SignUpInput,
} from "@/modules/auth/schemas";

type ActionResult = {
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

function getFieldErrors(error: z.ZodError) {
  const fieldErrors: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const field = issue.path[0];

    if (typeof field === "string") {
      fieldErrors[field] ??= [];
      fieldErrors[field].push(issue.message);
    }
  }

  return fieldErrors;
}

export async function getCurrentSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    return session ?? null;
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      error.digest === "HANGING_PROMISE_REJECTION"
    ) {
      return null;
    }

    console.error("Unable to read the current auth session:", error);
    return null;
  }
}

export async function getCurrentUser() {
  const session = await getCurrentSession();
  return session?.user ?? null;
}

export async function requireSession() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/sign-in");
  }

  return session;
}

export async function requireAuth() {
  const session = await requireSession();
  return session.user;
}

export async function requireUnauth() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/");
  }

  return null;
}

export async function signInAction(input: SignInInput): Promise<ActionResult> {
  const result = signInSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      fieldErrors: getFieldErrors(result.error),
    };
  }

  try {
    await auth.api.signInEmail({
      body: {
        email: result.data.email,
        password: result.data.password,
        callbackURL: "/",
      },
      headers: await headers(),
    });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unable to sign in",
    };
  }

  redirect("/");
}

export async function signUpAction(input: SignUpInput): Promise<ActionResult> {
  const result = signUpSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      fieldErrors: getFieldErrors(result.error),
    };
  }

  try {
    await auth.api.signUpEmail({
      body: {
        name: result.data.name,
        email: result.data.email,
        password: result.data.password,
        callbackURL: "/sign-in?verified=1",
      },
      headers: await headers(),
    });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unable to create account",
    };
  }

  return { success: true };
}

export async function forgotPasswordAction(
  input: ForgotPasswordInput,
): Promise<ActionResult> {
  const result = forgotPasswordSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      fieldErrors: getFieldErrors(result.error),
    };
  }

  try {
    const response = await auth.api.requestPasswordReset({
      body: {
        email: result.data.email,
        redirectTo: "/reset-password",
      },
      headers: await headers(),
    });

    if (!response.status) {
      return {
        success: false,
        error: "Unable to request a reset link. Please try again.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Password reset request failed:", error);
    return {
      success: false,
      error: "Unable to request a reset link. Please try again.",
    };
  }
}

export async function resetPasswordAction(
  input: ResetPasswordInput,
): Promise<ActionResult> {
  const result = resetPasswordSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      fieldErrors: getFieldErrors(result.error),
    };
  }

  try {
    await auth.api.resetPassword({
      body: {
        token: result.data.token,
        newPassword: result.data.newPassword,
      },
      headers: await headers(),
    });

    return { success: true };
  } catch (error) {
    console.error("Password reset failed:", error);
    return {
      success: false,
      error:
        "Unable to reset your password. The link may be invalid or expired; request a new one.",
    };
  }
}

export async function signOutAction(): Promise<never> {
  await auth.api.signOut({
    headers: await headers(),
  });

  redirect("/sign-in");
}
