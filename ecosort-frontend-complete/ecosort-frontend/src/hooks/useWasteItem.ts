"use client";

import { useCallback, useEffect, useState } from "react";
import { wasteItemApi } from "@/lib/api/wasteItemApi";
import type { WasteItem } from "@/types/wasteItem.types";

export function useWasteItem(id: string) {
  const [data, setData] = useState<WasteItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItem = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await wasteItemApi.getById(id);
      setData(result);
    } catch {
      setError("Waste item not found.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  return { data, isLoading, error, refetch: fetchItem };
}
