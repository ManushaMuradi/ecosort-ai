"use client";

import Link from "next/link";
import { FolderTree, Package, AlertTriangle, Plus, Search, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";
import { WasteItemImage } from "@/components/ui/WasteItemImage";
import { HazardousBadge } from "@/components/ui/Badge";
import { CategoryDistributionChart } from "@/features/dashboard/CategoryDistributionChart";
import { useAuth } from "@/lib/auth/AuthContext";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { usePermissions } from "@/hooks/usePermissions";

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const { stats, isLoading, error, refetch } = useDashboardStats();
  const { canWrite } = usePermissions();

  return (
    <div>
      <h1 className="text-lg font-semibold text-zinc-900">
        Welcome back{user ? `, ${user.fullName.split(" ")[0]}` : ""}
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Here&apos;s an overview of your waste management platform.
      </p>

      {error && !isLoading && (
        <Card className="mt-6">
          <EmptyState
            icon={AlertTriangle}
            title="Couldn't load dashboard data"
            description={error}
            action={
              <button
                onClick={refetch}
                className="text-sm font-medium text-accent-600 hover:text-accent-700"
              >
                Try again
              </button>
            }
          />
        </Card>
      )}

      {!error && (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              label="Total categories"
              value={stats?.totalCategories ?? 0}
              icon={FolderTree}
              isLoading={isLoading}
            />
            <StatCard
              label="Total waste items"
              value={stats?.totalItems ?? 0}
              icon={Package}
              isLoading={isLoading}
            />
            <StatCard
              label="Hazardous items"
              value={stats?.hazardousCount ?? 0}
              icon={AlertTriangle}
              isLoading={isLoading}
              accentClassName="bg-red-50"
              iconClassName="text-red-600"
            />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="p-5 lg:col-span-2">
              <h2 className="text-sm font-semibold text-zinc-900">Items by category</h2>
              {isLoading ? (
                <Skeleton className="mt-4 h-64 w-full" />
              ) : stats && stats.categoryDistribution.length > 0 ? (
                <div className="mt-2">
                  <CategoryDistributionChart data={stats.categoryDistribution} />
                </div>
              ) : (
                <EmptyState
                  icon={Package}
                  title="No data yet"
                  description="Add waste items to see the category breakdown."
                  className="py-10"
                />
              )}
            </Card>

            <Card className="p-5">
              <h2 className="text-sm font-semibold text-zinc-900">Quick actions</h2>
              <div className="mt-3 flex flex-col gap-2">
                {canWrite && (
                  <Link
                    href="/categories"
                    className="flex items-center gap-2.5 rounded-md border border-zinc-200 px-3 py-2.5 text-sm text-zinc-700 transition-colors hover:border-accent-200 hover:bg-accent-50 hover:text-accent-700"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Add a category
                  </Link>
                )}
                {canWrite && (
                  <Link
                    href="/waste-items"
                    className="flex items-center gap-2.5 rounded-md border border-zinc-200 px-3 py-2.5 text-sm text-zinc-700 transition-colors hover:border-accent-200 hover:bg-accent-50 hover:text-accent-700"
                  >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Add a waste item
                  </Link>
                )}
                <Link
                  href="/waste-items"
                  className="flex items-center gap-2.5 rounded-md border border-zinc-200 px-3 py-2.5 text-sm text-zinc-700 transition-colors hover:border-accent-200 hover:bg-accent-50 hover:text-accent-700"
                >
                  <Search className="h-4 w-4" aria-hidden="true" />
                  Search waste items
                </Link>
              </div>
            </Card>
          </div>

          <Card className="mt-6">
            <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
              <h2 className="text-sm font-semibold text-zinc-900">Recently added items</h2>
              <Link
                href="/waste-items"
                className="flex items-center gap-1 text-sm font-medium text-accent-600 hover:text-accent-700"
              >
                View all
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>

            {isLoading && (
              <div className="divide-y divide-zinc-100">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            )}

            {!isLoading && stats && stats.recentItems.length === 0 && (
              <EmptyState
                icon={Package}
                title="No waste items yet"
                description="Items you add will show up here first."
                className="py-10"
              />
            )}

            {!isLoading && stats && stats.recentItems.length > 0 && (
              <ul className="divide-y divide-zinc-100">
                {stats.recentItems.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={`/waste-items/${item.id}`}
                      className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-zinc-50"
                    >
                      <WasteItemImage src={item.imageUrl} alt={item.name} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-zinc-900">{item.name}</p>
                        <p className="truncate text-xs text-zinc-500">{item.category.name}</p>
                      </div>
                      <HazardousBadge hazardous={item.hazardous} />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
