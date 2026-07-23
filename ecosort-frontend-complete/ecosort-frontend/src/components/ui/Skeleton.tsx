import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

/**
 * Base skeleton block — a pulsing neutral placeholder used to build
 * every loading state in the app (see SkeletonCard, SkeletonTable).
 * Kept as one primitive so pulse timing/color stays consistent.
 */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-zinc-200", className)}
      aria-hidden="true"
      {...props}
    />
  );
}
