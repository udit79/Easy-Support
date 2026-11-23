"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { signOutAction } from "@/modules/auth/actions";

export function SignOutButton() {
  const [isPending, startTransition] = useTransition();

  function handleSignOut() {
    startTransition(async () => {
      await signOutAction();
    });
  }

  return (
    <Button
      type="button"
      variant="destructive"
      className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950"
      disabled={isPending}
      onClick={handleSignOut}
    >
      <LogOut />
      {isPending ? "Signing out..." : "Sign out"}
    </Button>
  );
}
