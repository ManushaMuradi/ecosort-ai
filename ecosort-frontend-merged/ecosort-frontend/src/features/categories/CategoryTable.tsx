"use client";

import Link from "next/link";
import { Pencil, Trash2, ChevronRight } from "lucide-react";
import { BinColorChip, RecyclableBadge } from "@/components/ui/Badge";
import type { Category } from "@/types/category.types";

interface CategoryTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export function CategoryTable({
  categories,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
}: CategoryTableProps) {
  const showActionsColumn = canEdit || canDelete;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-100 text-xs uppercase tracking-wide text-zinc-500">
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Bin color</th>
            <th className="px-4 py-3 font-medium">Recyclable</th>
            {showActionsColumn && <th className="px-4 py-3 font-medium text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {categories.map((category) => (
            <tr key={category.id} className="group transition-colors hover:bg-zinc-50">
              <td className="px-4 py-3">
                <Link
                  href={`/categories/${category.id}`}
                  className="flex items-center gap-1.5 font-medium text-zinc-900 hover:text-accent-700"
                >
                  {category.name}
                  <ChevronRight
                    className="h-3.5 w-3.5 text-zinc-300 transition-transform group-hover:translate-x-0.5 group-hover:text-accent-500"
                    aria-hidden="true"
                  />
                </Link>
                {category.description && (
                  <p className="mt-0.5 max-w-md truncate text-xs text-zinc-500">
                    {category.description}
                  </p>
                )}
              </td>
              <td className="px-4 py-3">
                <BinColorChip color={category.binColor} />
              </td>
              <td className="px-4 py-3">
                <RecyclableBadge recyclable={category.recyclable} />
              </td>
              {showActionsColumn && (
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                    {canEdit && (
                      <button
                        onClick={() => onEdit(category)}
                        aria-label={`Edit ${category.name}`}
                        className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => onDelete(category)}
                        aria-label={`Delete ${category.name}`}
                        className="rounded-md p-1.5 text-zinc-500 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
