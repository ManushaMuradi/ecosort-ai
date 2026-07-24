import { Recycle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Status dots that double as both decoration and real information —
 * the app's one signature visual detail (see design rationale):
 * recyclable = green, hazardous = amber/red, tying color directly to
 * domain meaning instead of using color as arbitrary decoration.
 */
export function RecyclableBadge({ recyclable }: { recyclable: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium",
        recyclable ? "bg-accent-50 text-accent-700" : "bg-zinc-100 text-zinc-500"
      )}
    >
      <Recycle className="h-3 w-3" aria-hidden="true" />
      {recyclable ? "Recyclable" : "Non-recyclable"}
    </span>
  );
}

export function HazardousBadge({ hazardous }: { hazardous: boolean }) {
  if (!hazardous) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
      <AlertTriangle className="h-3 w-3" aria-hidden="true" />
      Hazardous
    </span>
  );
}

const BIN_COLOR_STYLES: Record<string, string> = {
  GREEN: "bg-emerald-500",
  BLUE: "bg-blue-500",
  YELLOW: "bg-amber-400",
  RED: "bg-red-500",
};

export function BinColorChip({ color }: { color: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600">
      <span
        className={cn("h-2.5 w-2.5 rounded-full", BIN_COLOR_STYLES[color] ?? "bg-zinc-400")}
        aria-hidden="true"
      />
      {color}
    </span>
  );
}
