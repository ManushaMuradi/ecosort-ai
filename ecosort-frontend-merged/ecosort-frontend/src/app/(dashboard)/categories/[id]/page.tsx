"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Package } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { SkeletonTable } from "@/components/ui/SkeletonTable";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { BinColorChip, RecyclableBadge } from "@/components/ui/Badge";
import { WasteItemTable } from "@/features/waste-items/WasteItemTable";
import { useCategory } from "@/hooks/useCategory";
import { useWasteItems } from "@/hooks/useWasteItems";

/**
 * Params arrives as a Promise in Next.js 15's App Router — `use()`
 * unwraps it in a client component, the supported pattern for this
 * version rather than the old synchronous props.params.
 */
export default function CategoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: category, isLoading, error } = useCategory(id);
  const [itemsPage, setItemsPage] = useState(0);
  const { data: items, isLoading: itemsLoading } = useWasteItems({
    page: itemsPage,
    size: 10,
    categoryId: id,
  });

  return (
    <div>
      <Link
        href="/categories"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to categories
      </Link>

      <div className="mt-4">
        {isLoading && (
          <Card className="p-6">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="mt-3 h-4 w-full max-w-md" />
            <Skeleton className="mt-2 h-4 w-24" />
          </Card>
        )}

        {error && !isLoading && (
          <Card className="p-6">
            <EmptyState icon={Package} title="Category not found" description={error} />
          </Card>
        )}

        {category && !isLoading && (
          <Card className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-xl font-semibold text-zinc-900">{category.name}</h1>
                {category.description && (
                  <p className="mt-1 max-w-2xl text-sm text-zinc-500">{category.description}</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <BinColorChip color={category.binColor} />
                <RecyclableBadge recyclable={category.recyclable} />
              </div>
            </div>
          </Card>
        )}
      </div>

      <div className="mt-6">
        <h2 className="text-sm font-semibold text-zinc-900">Waste items in this category</h2>

        <Card className="mt-3 overflow-hidden">
          {itemsLoading && <SkeletonTable rows={5} columns={4} />}

          {!itemsLoading && items && items.content.length === 0 && (
            <EmptyState
              illustrationSrc="/images/illustrations/empty-waste-items.svg"
              title="No items in this category yet"
              description="Waste items assigned to this category will appear here."
            />
          )}

          {!itemsLoading && items && items.content.length > 0 && (
            <>
              <WasteItemTable
                items={items.content}
                onEdit={() => {}}
                onDelete={() => {}}
                canEdit={false}
                canDelete={false}
              />
              <Pagination
                page={items.page}
                totalPages={items.totalPages}
                totalElements={items.totalElements}
                pageSize={items.size}
                onPageChange={setItemsPage}
              />
            </>
          )}
        </Card>
        <p className="mt-2 text-xs text-zinc-400">
          Manage items from the{" "}
          <Link href="/waste-items" className="underline hover:text-zinc-600">
            Waste Items
          </Link>{" "}
          page.
        </p>
      </div>
    </div>
  );
}
