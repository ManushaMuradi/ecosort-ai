"use client";

import type { WasteRequestStatus } from "@/types/wasteRequest.types";

interface RequestFilterBarProps {
  value: WasteRequestStatus | "";
  onChange: (value: WasteRequestStatus | "") => void;
}

const STATUS_OPTIONS: WasteRequestStatus[] = [
  "REQUESTED",
  "SCHEDULED",
  "COLLECTED",
  "VERIFIED",
  "CANCELLED",
];

/**
 * A plain <select>, not the labeled <Select> primitive — this is a
 * compact inline filter control (like the category filter on the
 * Waste Items page), not a form field, so it uses an aria-label
 * instead of a visible <label>.
 */
export function RequestFilterBar({ value, onChange }: RequestFilterBarProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as WasteRequestStatus | "")}
      aria-label="Filter by status"
      className="h-9 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-1 sm:w-48"
    >
      <option value="">All statuses</option>
      {STATUS_OPTIONS.map((status) => (
        <option key={status} value={status}>
          {status.charAt(0) + status.slice(1).toLowerCase()}
        </option>
      ))}
    </select>
  );
}
