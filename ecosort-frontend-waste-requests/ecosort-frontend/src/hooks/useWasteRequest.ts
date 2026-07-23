"use client";

import { useCallback, useEffect, useState } from "react";
import { wasteRequestApi } from "@/lib/api/wasteRequestApi";
import type { WasteRequest } from "@/types/wasteRequest.types";

export function useWasteRequest(id: string) {
  const [data, setData] = useState<WasteRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequest = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await wasteRequestApi.getById(id);
      setData(result);
    } catch {
      // Covers both "not found" and "not yours to see" — the backend
      // returns 404 for both (no existence-leaking 403), so the
      // frontend message stays equally generic on purpose.
      setError("This pickup request could not be found.");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRequest();
  }, [fetchRequest]);

  return { data, isLoading, error, refetch: fetchRequest };
}
