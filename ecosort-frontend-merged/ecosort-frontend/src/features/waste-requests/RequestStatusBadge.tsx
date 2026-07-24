import { Clock, Truck, CheckCircle2, ShieldCheck, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WasteRequestStatus } from "@/types/wasteRequest.types";

const STATUS_CONFIG: Record<
  WasteRequestStatus,
  { label: string; className: string; icon: typeof Clock }
> = {
  REQUESTED: { label: "Requested", className: "bg-zinc-100 text-zinc-600", icon: Clock },
  SCHEDULED: { label: "Scheduled", className: "bg-blue-50 text-blue-700", icon: Truck },
  COLLECTED: { label: "Collected", className: "bg-amber-50 text-amber-700", icon: CheckCircle2 },
  VERIFIED: { label: "Verified", className: "bg-accent-50 text-accent-700", icon: ShieldCheck },
  CANCELLED: { label: "Cancelled", className: "bg-red-50 text-red-700", icon: XCircle },
};

/**
 * The one place status → color/label/icon mapping lives. The table,
 * the detail page header, and the timeline all import this instead of
 * each re-deriving their own color logic — same instinct as
 * RecyclableBadge/HazardousBadge in the wasteknowledge module.
 */
export function RequestStatusBadge({ status }: { status: WasteRequestStatus }) {
  const { label, className, icon: Icon } = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}
