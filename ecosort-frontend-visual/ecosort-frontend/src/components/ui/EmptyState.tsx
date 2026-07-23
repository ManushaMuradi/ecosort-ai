import Image from "next/image";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  /** Lucide icon, used for transient/error states (e.g. "couldn't load"). */
  icon?: LucideIcon;
  /** Illustration path under /public, used for genuine empty states (nothing exists yet, no results). Takes priority over `icon` when both are given. */
  illustrationSrc?: string;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * A clean, illustrated empty state — used both for "nothing exists yet"
 * (with a create action) and "no results for this search" (without
 * one), differentiated by the caller's copy and illustration, not by
 * two separate components. Error states (couldn't load) pass `icon`
 * instead — an illustration would overstate a transient failure as a
 * genuine empty state.
 */
export function EmptyState({
  icon: Icon,
  illustrationSrc,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center px-6 py-16 text-center", className)}>
      {illustrationSrc ? (
        <Image src={illustrationSrc} alt="" width={180} height={150} className="h-auto w-44" />
      ) : Icon ? (
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-50">
          <Icon className="h-6 w-6 text-accent-600" aria-hidden="true" />
        </div>
      ) : null}
      <h3 className="mt-4 text-sm font-semibold text-zinc-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-zinc-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
