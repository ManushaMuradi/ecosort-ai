"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth/AuthContext";

/**
 * Guards every route under (dashboard). Client-side (not Next.js
 * middleware) is a deliberate choice here: auth state depends on a
 * memory-only access token plus a silent /auth/refresh call (see
 * AuthContext), neither of which an edge middleware — which runs
 * before any client JS and has no access to browser memory — can
 * observe. A middleware-based guard would need the token in a cookie,
 * which we specifically avoided for the access token (see
 * tokenStorage.ts). This is the correct trade-off for a token strategy
 * optimized against XSS rather than against a flash of protected UI.
 *
 * While the initial session-restore check is running, show a full-
 * screen spinner rather than momentarily rendering the page (or
 * redirecting) and then flipping — avoids the "flash of wrong content"
 * some auth guards produce.
 */
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isInitializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isInitializing, isAuthenticated, router]);

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-400" aria-label="Loading" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect effect above is already in flight; render nothing.
    return null;
  }

  return <>{children}</>;
}
