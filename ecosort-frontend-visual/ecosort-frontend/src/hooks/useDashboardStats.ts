"use client";

import { useCallback, useEffect, useState } from "react";
import { categoryApi } from "@/lib/api/categoryApi";
import { wasteItemApi } from "@/lib/api/wasteItemApi";
import type { WasteItem } from "@/types/wasteItem.types";

export interface DashboardStats {
  totalCategories: number;
  totalItems: number;
  hazardousCount: number;
  recentItems: WasteItem[];
  categoryDistribution: { category: string; items: number }[];
}

/**
 * The backend deliberately has no dedicated Analytics module (out of
 * scope for the Waste Knowledge Base phase), so every number here is
 * derived from the existing category/item list endpoints rather than
 * a bespoke stats endpoint:
 *  - totalCategories / totalItems: the `totalElements` field Spring
 *    Data already returns on any paginated list — a size=1 request is
 *    enough to read it, no need to fetch real content.
 *  - hazardousCount / categoryDistribution: computed client-side from
 *    one size=100 items fetch (the full seeded dataset comfortably
 *    fits in one page; a "real" scale-up would need a backend
 *    aggregation endpoint instead of this client-side approach).
 *  - recentItems: a small page sorted by createdAt desc.
 */
export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [categoryCountPage, itemCountPage, allItemsPage, recentPage] = await Promise.all([
        categoryApi.list({ page: 0, size: 1 }),
        wasteItemApi.list({ page: 0, size: 1 }),
        wasteItemApi.list({ page: 0, size: 100 }),
        wasteItemApi.list({ page: 0, size: 5, sortBy: "createdAt", sortDir: "desc" }),
      ]);

      const hazardousCount = allItemsPage.content.filter((item) => item.hazardous).length;

      const countsByCategory = new Map<string, number>();
      for (const item of allItemsPage.content) {
        countsByCategory.set(item.category.name, (countsByCategory.get(item.category.name) ?? 0) + 1);
      }
      const categoryDistribution = Array.from(countsByCategory.entries()).map(
        ([category, items]) => ({ category, items })
      );

      setStats({
        totalCategories: categoryCountPage.totalElements,
        totalItems: itemCountPage.totalElements,
        hazardousCount,
        recentItems: recentPage.content,
        categoryDistribution,
      });
    } catch {
      setError("Unable to load dashboard statistics. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, isLoading, error, refetch: fetchStats };
}
