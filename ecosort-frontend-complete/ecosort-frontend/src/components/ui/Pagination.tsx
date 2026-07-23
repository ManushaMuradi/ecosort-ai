"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number; // 0-indexed, matching Spring Data Pageable
  totalPages: number;
  totalElements: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

/**
 * Deliberately takes the raw PageResponse fields (page, totalPages,
 * totalElements) rather than reimplementing page-math — this stays a
 * dumb, reusable control; every list page just wires its hook's data
 * straight into these props.
 */
export function Pagination({ page, totalPages, totalElements, pageSize, onPageChange }: PaginationProps) {
  if (totalElements === 0) return null;

  const from = page * pageSize + 1;
  const to = Math.min(totalElements, (page + 1) * pageSize);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-zinc-100 px-4 py-3 sm:flex-row">
      <p className="text-sm text-zinc-500">
        Showing <span className="font-medium text-zinc-700">{from}–{to}</span> of{" "}
        <span className="font-medium text-zinc-700">{totalElements}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          aria-label="Previous page"
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 text-zinc-600",
            "hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
          )}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <span className="px-2 text-sm text-zinc-600">
          Page {page + 1} of {Math.max(totalPages, 1)}
        </span>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page + 1 >= totalPages}
          aria-label="Next page"
          className={cn(
            "flex h-8 w-8 items-center justify-center rounded-md border border-zinc-200 text-zinc-600",
            "hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-40"
          )}
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
