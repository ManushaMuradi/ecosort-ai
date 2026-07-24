"use client";

import { useEffect, useState } from "react";
import { categoryApi } from "@/lib/api/categoryApi";
import type { Category } from "@/types/category.types";

/**
 * Waste category taxonomy is a small, admin-curated list (9 seeded,
 * realistically dozens at most) — fetching one large page for dropdown
 * options is simpler and cheaper than building a searchable async
 * select for a list this size.
 */
export function useCategoryOptions() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    categoryApi
      .list({ page: 0, size: 100, sortBy: "name" })
      .then((result) => {
        if (!cancelled) setCategories(result.content);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { categories, isLoading };
}
