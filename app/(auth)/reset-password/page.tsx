import { ResetPasswordForm } from "@/modules/auth/components/reset-password-form";

type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string | string[];
    error?: string | string[];
  }>;
};

export default async function ResetPasswordPage({
  searchParams,
}: ResetPasswordPageProps) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : undefined;
  const invalidLink = Boolean(params.error);

  return <ResetPasswordForm token={token} invalidLink={invalidLink} />;
}
