"use client";

import { useEffect, useState } from "react";
import { userApi } from "@/lib/api/userApi";
import type { User } from "@/types/auth.types";

/**
 * Mirrors useCategoryOptions's shape exactly (flat list, no
 * pagination — the collector pool is expected to be a small,
 * admin-managed set, same reasoning as the category taxonomy).
 */
export function useCollectorOptions() {
  const [collectors, setCollectors] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    userApi
      .listByRole("COLLECTOR")
      .then((result) => {
        if (!cancelled) setCollectors(result);
      })
      .catch(() => {
        if (!cancelled) setError("Unable to load collectors.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { collectors, isLoading, error };
}
