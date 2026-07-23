"use client";

import { useEffect, useState } from "react";
import { Trash2, Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { wasteItemApi } from "@/lib/api/wasteItemApi";
import type { WasteItem } from "@/types/wasteItem.types";
import { FieldErrors } from "react-hook-form";

interface WasteRequestItemRowProps {
  index: number;
  wasteItemId: string;
  wasteItemName: string;
  quantity: number;
  estimatedWeightKg: number;
  onChange: (field: "wasteItemId" | "wasteItemName" | "quantity" | "estimatedWeightKg", value: string | number) => void;
  onRemove: () => void;
  canRemove: boolean;
  errors?: any;
}

/**
 * A search-to-select item picker (reusing the existing /waste-items
 * search endpoint), not a plain dropdown — the catalog can have
 * dozens of items across 11 categories, so a searchable picker is the
 * right pattern here even though category selection elsewhere in the
 * app uses a flat <select> (a genuinely small, fixed list).
 */
export function WasteRequestItemRow({
  index,
  wasteItemId,
  wasteItemName,
  quantity,
  estimatedWeightKg,
  onChange,
  onRemove,
  canRemove,
  errors,
}: WasteRequestItemRowProps) {
  const [query, setQuery] = useState(wasteItemName);
  const [results, setResults] = useState<WasteItem[]>([]);
  const [showResults, setShowResults] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!debouncedQuery || debouncedQuery === wasteItemName) {
      setResults([]);
      return;
    }
    let cancelled = false;
    wasteItemApi.search(debouncedQuery, { size: 6 }).then((res) => {
      if (!cancelled) setResults(res.content);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  function selectItem(item: WasteItem) {
    onChange("wasteItemId", item.id);
    onChange("wasteItemName", item.name);
    setQuery(item.name);
    setShowResults(false);
  }

  return (
    <div className="flex flex-col gap-3 rounded-md border border-zinc-200 p-3 sm:flex-row sm:items-start sm:gap-3">
      <div className="relative flex-1">
        <label className="text-sm font-medium text-zinc-700">
          Item {index + 1}
          <span className="text-red-500 ml-0.5">*</span>
        </label>
        <div className="relative mt-1.5">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
            aria-hidden="true"
          />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowResults(true);
              if (e.target.value !== wasteItemName) onChange("wasteItemId", "");
            }}
            onFocus={() => setShowResults(true)}
            placeholder="Search for an item…"
            aria-invalid={!!errors?.wasteItemId}
            className="h-10 w-full rounded-md border border-zinc-300 pl-9 pr-3 text-sm text-zinc-900 focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-1"
          />
        </div>
        {showResults && results.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full rounded-md border border-zinc-200 bg-white py-1 shadow-popover">
            {results.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => selectItem(item)}
                  className="flex w-full flex-col px-3 py-2 text-left text-sm hover:bg-zinc-50"
                >
                  <span className="font-medium text-zinc-900">{item.name}</span>
                  <span className="text-xs text-zinc-500">{item.category.name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
       {errors?.wasteItemId?.message && (
        <p className="mt-1 text-sm text-red-600">
          {String(errors.wasteItemId.message)}
         </p>
      )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:w-56 sm:shrink-0">
        <div>
          <label className="text-sm font-medium text-zinc-700">Quantity</label>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => onChange("quantity", Number(e.target.value))}
            className="mt-1.5 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm text-zinc-900 focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-1"
          />
        {errors?.quantity?.message && (
  <p className="mt-1 text-sm text-red-600">
    {String(errors.quantity.message)}
  </p>
)}
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-700">Weight (kg)</label>
          <input
            type="number"
            min={0.01}
            step={0.01}
            value={estimatedWeightKg}
            onChange={(e) => onChange("estimatedWeightKg", Number(e.target.value))}
            className="mt-1.5 h-10 w-full rounded-md border border-zinc-300 px-3 text-sm text-zinc-900 focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-1"
          />
          {errors?.estimatedWeightKg?.message && (
  <p className="mt-1 text-sm text-red-600">
    {String(errors.estimatedWeightKg.message)}
  </p>
)}
        </div>
      </div>

      {canRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove item ${index + 1}`}
          className="self-start rounded-md p-2 text-zinc-400 hover:bg-red-50 hover:text-red-600 sm:mt-6"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
