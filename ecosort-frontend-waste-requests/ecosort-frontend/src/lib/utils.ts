import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines conditional class names (clsx) with Tailwind-aware conflict
 * resolution (twMerge) — e.g. cn("px-2", isActive && "px-4") correctly
 * resolves to just "px-4" instead of emitting both and letting CSS
 * source order decide, which is a common subtle bug with clsx alone.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
