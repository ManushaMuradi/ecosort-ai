"use client";

import { useCallback, useEffect, useState } from "react";
import { categoryApi } from "@/lib/api/categoryApi";
import type { Category } from "@/types/category.types";
import type { PageResponse } from "@/types/api.types";

/**
 * Owns fetching + loading/error state for the category list. Pages
 * consume this instead of calling categoryApi directly, so pagination
 * state and refetch-after-mutation logic live in one place.
 */
export function useCategories(page: number, size = 10) {
  const [data, setData] = useState<PageResponse<Category> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await categoryApi.list({ page, size, sortBy: "name" });
      setData(result);
    } catch {
      setError("Unable to load categories. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [page, size]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { data, isLoading, error, refetch: fetchCategories };
}
