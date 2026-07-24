import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  isLoading?: boolean;
  accentClassName?: string;
  iconClassName?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  isLoading,
  accentClassName,
  iconClassName,
}: StatCardProps) {
  return (
    <Card className="flex items-center gap-4 p-5 transition-shadow hover:shadow-popover">
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent-50",
          accentClassName
        )}
      >
        <Icon className={cn("h-5 w-5 text-accent-600", iconClassName)} aria-hidden="true" />
      </div>
      <div>
        <p className="text-sm text-zinc-500">{label}</p>
        {isLoading ? (
          <Skeleton className="mt-1.5 h-6 w-16" />
        ) : (
          <p className="mt-0.5 text-2xl font-semibold tabular-nums text-zinc-900">{value}</p>
        )}
      </div>
    </Card>
  );
}
