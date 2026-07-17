"use client";

import { Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

function LoginContent() {
  const searchParams = useSearchParams();

  const callbackUrl =
    searchParams.get("callbackUrl") ||
    searchParams.get("from") ||
    "/dashboard";

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">🐢 Consistly</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Continue with Google to access your workspace.
          </p>
        </div>

        <button
          onClick={() =>
            signIn("google", {
              callbackUrl,
            })
          }
          className="flex w-full items-center justify-center gap-3 rounded-xl border px-4 py-3 font-medium transition hover:bg-accent"
        >
          Continue with Google
        </button>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}