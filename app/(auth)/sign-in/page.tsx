import { Suspense } from "react";

import { SignInForm } from "@/modules/auth/components/sign-in-form";

type SignInPageProps = {
  searchParams: Promise<{
    verified?: string;
    error?: string | string[];
  }>;
};

async function SignInPageContent({ searchParams }: SignInPageProps) {
  const params = await searchParams;
  const verificationStatus = params.error
    ? "error"
    : params.verified === "1"
      ? "verified"
      : undefined;

  return <SignInForm verificationStatus={verificationStatus} />;
}

export default function SignInPage({ searchParams }: SignInPageProps) {
  return (
    <Suspense fallback={<SignInForm />}>
      <SignInPageContent searchParams={searchParams} />
    </Suspense>
  );
}
