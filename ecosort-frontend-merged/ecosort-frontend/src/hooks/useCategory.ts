"use client";

import { useCallback, useEffect, useState } from "react";
import { categoryApi } from "@/lib/api/categoryApi";
import type { Category } from "@/types/category.types";

export function useCategory(id: string) {
  const [data, setData] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await categoryApi.getById(id);
      setData(result);
    } catch {
      setError("Category not found.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  return { data, isLoading, error, refetch: fetchCategory };
}
