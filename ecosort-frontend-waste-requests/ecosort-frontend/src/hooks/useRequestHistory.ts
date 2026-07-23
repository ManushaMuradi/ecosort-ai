"use client";

import { useCallback, useEffect, useState } from "react";
import { wasteRequestApi } from "@/lib/api/wasteRequestApi";
import type { RequestStatusHistoryEntry } from "@/types/wasteRequest.types";

export function useRequestHistory(id: string) {
  const [data, setData] = useState<RequestStatusHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await wasteRequestApi.getHistory(id);
      setData(result);
    } catch {
      setError("Unable to load the status history.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { data, isLoading, error, refetch: fetchHistory };
}
