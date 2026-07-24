"use client";

import Link from "next/link";
import { Pencil, Trash2, ChevronRight } from "lucide-react";
import { WasteItemImage } from "@/components/ui/WasteItemImage";
import { HazardousBadge } from "@/components/ui/Badge";
import type { WasteItem } from "@/types/wasteItem.types";

interface WasteItemTableProps {
  items: WasteItem[];
  onEdit: (item: WasteItem) => void;
  onDelete: (item: WasteItem) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export function WasteItemTable({
  items,
  onEdit,
  onDelete,
  canEdit = true,
  canDelete = true,
}: WasteItemTableProps) {
  const showActionsColumn = canEdit || canDelete;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-100 text-xs uppercase tracking-wide text-zinc-500">
            <th className="px-4 py-3 font-medium">Item</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Status</th>
            {showActionsColumn && <th className="px-4 py-3 font-medium text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {items.map((item) => (
            <tr key={item.id} className="group transition-colors hover:bg-zinc-50">
              <td className="px-4 py-3">
                <Link href={`/waste-items/${item.id}`} className="flex items-center gap-3">
                  <WasteItemImage src={item.imageUrl} alt={item.name} size="sm" />
                  <span>
                    <span className="flex items-center gap-1.5 font-medium text-zinc-900 group-hover:text-accent-700">
                      {item.name}
                      <ChevronRight
                        className="h-3.5 w-3.5 text-zinc-300 transition-transform group-hover:translate-x-0.5 group-hover:text-accent-500"
                        aria-hidden="true"
                      />
                    </span>
                    {item.scientificName && (
                      <span className="block text-xs italic text-zinc-500">
                        {item.scientificName}
                      </span>
                    )}
                  </span>
                </Link>
              </td>
              <td className="px-4 py-3 text-zinc-600">{item.category.name}</td>
              <td className="px-4 py-3">
                <HazardousBadge hazardous={item.hazardous} />
                {!item.hazardous && <span className="text-xs text-zinc-400">—</span>}
              </td>
              {showActionsColumn && (
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                    {canEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        aria-label={`Edit ${item.name}`}
                        className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
                      >
                        <Pencil className="h-4 w-4" aria-hidden="true" />
                      </button>
                    )}
                    {canDelete && (
                      <button
                        onClick={() => onDelete(item)}
                        aria-label={`Delete ${item.name}`}
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
