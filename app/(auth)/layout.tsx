import type { ReactNode } from "react";
import { Suspense } from "react";

import { requireUnauth } from "@/modules/auth/actions";

export const instant = false;

async function AuthGuard({ children }: { children: ReactNode }) {
  await requireUnauth();

  return children;
}

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <Suspense fallback={<div className="size-8 animate-pulse rounded-full bg-muted" />}>
        <AuthGuard>{children}</AuthGuard>
      </Suspense>
    </main>
  );
}
