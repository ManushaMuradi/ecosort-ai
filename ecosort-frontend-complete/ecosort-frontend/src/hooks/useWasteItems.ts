"use client";

import { useCallback, useEffect, useState } from "react";
import { wasteItemApi } from "@/lib/api/wasteItemApi";
import type { WasteItem } from "@/types/wasteItem.types";
import type { PageResponse } from "@/types/api.types";

interface UseWasteItemsOptions {
  page: number;
  size?: number;
  keyword?: string;
  categoryId?: string;
}

/**
 * The backend exposes three separate read endpoints (list, search,
 * by-category) rather than one endpoint with combinable filters, so
 * this hook picks the right one based on what's active: a non-empty
 * keyword takes priority (search), otherwise a selected category
 * filters via the nested endpoint, otherwise the full list. This
 * mirrors the actual API surface rather than pretending it supports
 * combined filtering it doesn't.
 */
export function useWasteItems({ page, size = 10, keyword, categoryId }: UseWasteItemsOptions) {
  const [data, setData] = useState<PageResponse<WasteItem> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let result: PageResponse<WasteItem>;
      if (keyword && keyword.trim().length > 0) {
        result = await wasteItemApi.search(keyword.trim(), { page, size, sortBy: "name" });
      } else if (categoryId) {
        result = await wasteItemApi.getByCategory(categoryId, { page, size, sortBy: "name" });
      } else {
        result = await wasteItemApi.list({ page, size, sortBy: "name" });
      }
      setData(result);
    } catch {
      setError("Unable to load waste items. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [page, size, keyword, categoryId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return { data, isLoading, error, refetch: fetchItems };
}
