"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

/**
 * App Router's built-in error boundary convention: any uncaught error
 * thrown during rendering anywhere under this segment renders this
 * component instead of a blank white screen. Satisfies "use error
 * boundaries" at the root level; nested segments can add their own
 * error.tsx for more localized recovery later if needed.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled application error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-4 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
        <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
      </div>
      <div>
        <h1 className="text-lg font-semibold text-zinc-900">Something went wrong</h1>
        <p className="mt-1 text-sm text-zinc-500">
          An unexpected error occurred. You can try again, or refresh the page.
        </p>
      </div>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
