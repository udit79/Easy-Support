import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { sendEmail } from "@/modules/email/service";
import ResetPassword from "@/modules/email/templates/reset-password";
import VerifyEmail from "@/modules/email/templates/verify-email";
import prisma from "./db";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your Easy Support password",
        react: ResetPassword({ name: user.name, url }),
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email",
        react: VerifyEmail({ name: user.name, url }),
      });
    },
  },
  plugins: [nextCookies()],
});
