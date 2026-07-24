import { RequestStatusBadge } from "@/features/waste-requests/RequestStatusBadge";
import { SkeletonTable } from "@/components/ui/SkeletonTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { History } from "lucide-react";
import type { RequestStatusHistoryEntry } from "@/types/wasteRequest.types";

interface RequestStatusTimelineProps {
  entries: RequestStatusHistoryEntry[];
  isLoading: boolean;
  error: string | null;
}

/**
 * A vertical timeline, not a table — status history is inherently
 * sequential/narrative ("this happened, then this happened"), which a
 * table of rows doesn't communicate as clearly as a connected line of
 * events does. Stays a single column at every breakpoint (a timeline
 * doesn't have a meaningful "desktop multi-column" layout), so mobile
 * and desktop use the same markup — nothing to collapse.
 */
export function RequestStatusTimeline({ entries, isLoading, error }: RequestStatusTimelineProps) {
  if (isLoading) return <SkeletonTable rows={3} columns={2} />;

  if (error) {
    return <EmptyState icon={History} title="Couldn't load history" description={error} />;
  }

  if (entries.length === 0) {
    return (
      <EmptyState
        icon={History}
        title="No history yet"
        description="Status changes will appear here as this request progresses."
      />
    );
  }

  return (
    <ol className="flex flex-col gap-0">
      {entries.map((entry, index) => {
        const isLast = index === entries.length - 1;
        return (
          <li key={entry.id} className="relative flex gap-3 pb-6 last:pb-0">
            {!isLast && (
              <span
                className="absolute left-[7px] top-5 h-full w-px bg-zinc-200"
                aria-hidden="true"
              />
            )}
            <span
              className="mt-1.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 border-accent-600 bg-white"
              aria-hidden="true"
            />
            <div className="min-w-0 flex-1 -mt-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <RequestStatusBadge status={entry.toStatus} />
                <span className="text-xs text-zinc-400">
                  {new Date(entry.changedAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>
              <p className="mt-1 text-sm text-zinc-600">
                Changed by <span className="font-medium text-zinc-800">{entry.changedBy.fullName}</span>
              </p>
              {entry.remarks && (
                <p className="mt-1 rounded-md bg-zinc-50 px-2.5 py-1.5 text-sm text-zinc-600">
                  {entry.remarks}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
