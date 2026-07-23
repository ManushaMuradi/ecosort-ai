"use client";

import { useCallback, useEffect, useState } from "react";
import { wasteRequestApi } from "@/lib/api/wasteRequestApi";
import { useAuth } from "@/lib/auth/AuthContext";
import type { PageResponse } from "@/types/api.types";
import type { WasteRequestStatus, WasteRequestSummary } from "@/types/wasteRequest.types";

/**
 * Role-branching is the whole point of this hook: it picks the right
 * backend endpoint (me / assigned / all) based on the viewer's role,
 * so the /requests page itself never has to know which endpoint
 * backs its data — it just renders whatever this hook returns. This
 * is what makes ONE page component serve three different roles
 * instead of three near-duplicate pages (see the design doc).
 */
export function useWasteRequests(page: number, status?: WasteRequestStatus, size = 10) {
  const { user } = useAuth();
  const [data, setData] = useState<PageResponse<WasteRequestSummary> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const roles = user?.roles ?? [];
  const isAdmin = roles.includes("MUNICIPAL_ADMIN") || roles.includes("SUPER_ADMIN");
  const isCollector = roles.includes("COLLECTOR");

  const fetchRequests = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const params = { page, size, status };
      const result = isAdmin
        ? await wasteRequestApi.getAll(params)
        : isCollector
          ? await wasteRequestApi.getAssigned(params)
          : await wasteRequestApi.getMine(params);
      setData(result);
    } catch {
      setError("Unable to load pickup requests. Please try again.");
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, page, size, status, isAdmin, isCollector]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchRequests,
    /** The page uses this to decide which table columns/filters to show. */
    viewerRole: isAdmin ? ("ADMIN" as const) : isCollector ? ("COLLECTOR" as const) : ("CITIZEN" as const),
  };
}
