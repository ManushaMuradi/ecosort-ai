import { Skeleton } from "@/components/ui/Skeleton";

/** A table-shaped skeleton — rows of shimmering blocks matching column count. */
export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="divide-y divide-zinc-100">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex items-center gap-4 px-4 py-3.5">
          {Array.from({ length: columns }).map((__, colIndex) => (
            <Skeleton
              key={colIndex}
              className={colIndex === 0 ? "h-4 w-1/4" : "h-4 flex-1"}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
