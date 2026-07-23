import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

/**
 * The flat, bordered container used for every panel in the app (stat
 * cards, list rows, form panels) — deliberately no heavy shadow, matching
 * the Linear/Vercel-style flat surface direction rather than a
 * Material-style elevated card.
 */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-lg border border-zinc-200 bg-white shadow-subtle", className)}
      {...props}
    />
  );
}
