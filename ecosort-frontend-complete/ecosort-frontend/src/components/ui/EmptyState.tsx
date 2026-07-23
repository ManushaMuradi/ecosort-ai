import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * A clean, illustrated empty state (icon-in-a-circle + heading + copy
 * + optional action) — used both for "nothing exists yet" (with a
 * create action) and "no results for this search" (without one),
 * differentiated by the caller's copy, not by two separate components.
 */
export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center px-6 py-16 text-center", className)}>
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-50">
        <Icon className="h-6 w-6 text-accent-600" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-zinc-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-zinc-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
