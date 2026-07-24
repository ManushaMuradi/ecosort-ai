"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Trash2, Recycle, AlertTriangle, Package } from "lucide-react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { WasteItemImage } from "@/components/ui/WasteItemImage";
import { HazardousBadge } from "@/components/ui/Badge";
import { WasteItemForm } from "@/features/waste-items/WasteItemForm";
import { useWasteItem } from "@/hooks/useWasteItem";
import { usePermissions } from "@/hooks/usePermissions";
import { wasteItemApi } from "@/lib/api/wasteItemApi";
import type { WasteItemFormSchema } from "@/lib/validators/wasteItemSchema";
import type { ApiResponse } from "@/types/api.types";

export default function WasteItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { data: item, isLoading, error, refetch } = useWasteItem(id);
  const { canWrite, canDelete } = usePermissions();

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  function extractErrorMessage(err: unknown, fallback: string): string {
    const message = (err as AxiosError<ApiResponse<unknown>>).response?.data?.message;
    return message ?? fallback;
  }

  async function handleUpdate(values: WasteItemFormSchema) {
    if (!item) return;
    try {
      await wasteItemApi.update(item.id, values);
      toast.success("Waste item updated");
      setEditOpen(false);
      refetch();
    } catch (err) {
      toast.error(extractErrorMessage(err, "Something went wrong. Please try again."));
    }
  }

  async function handleDelete() {
    if (!item) return;
    setIsDeleting(true);
    try {
      await wasteItemApi.delete(item.id);
      toast.success(`"${item.name}" deleted`);
      router.push("/waste-items");
    } catch (err) {
      toast.error(extractErrorMessage(err, "Unable to delete this item."));
      setIsDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/waste-items"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to waste items
      </Link>

      <div className="mt-4">
        {isLoading && (
          <Card className="p-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="mt-4 h-6 w-48" />
            <Skeleton className="mt-2 h-4 w-full" />
          </Card>
        )}

        {error && !isLoading && (
          <Card className="p-6">
            <EmptyState icon={Package} title="Item not found" description={error} />
          </Card>
        )}

        {item && !isLoading && (
          <Card className="overflow-hidden">
            <WasteItemImage src={item.imageUrl} alt={item.name} size="lg" />

            <div className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="text-xl font-semibold text-zinc-900">{item.name}</h1>
                  {item.scientificName && (
                    <p className="mt-0.5 text-sm italic text-zinc-500">{item.scientificName}</p>
                  )}
                  <Link
                    href={`/categories/${item.category.id}`}
                    className="mt-2 inline-block text-sm font-medium text-accent-600 hover:text-accent-700"
                  >
                    {item.category.name}
                  </Link>
                </div>

                <div className="flex items-center gap-2">
                  <HazardousBadge hazardous={item.hazardous} />
                  {canWrite && (
                    <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}>
                      <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                      Edit
                    </Button>
                  )}
                  {canDelete && (
                    <Button variant="danger" size="sm" onClick={() => setDeleteOpen(true)}>
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                      Delete
                    </Button>
                  )}
                </div>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <h2 className="flex items-center gap-1.5 text-sm font-semibold text-zinc-900">
                    <AlertTriangle className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                    Disposal method
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                    {item.disposalMethod}
                  </p>
                </div>
                <div>
                  <h2 className="flex items-center gap-1.5 text-sm font-semibold text-zinc-900">
                    <Recycle className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                    Recycling instructions
                  </h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">
                    {item.recyclingInstructions ?? "No specific recycling instructions provided."}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit waste item" size="lg">
        {item && (
          <WasteItemForm
            initialValues={item}
            onSubmit={handleUpdate}
            onCancel={() => setEditOpen(false)}
            submitLabel="Save changes"
          />
        )}
      </Modal>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete waste item"
        description={item ? `Delete "${item.name}"? This can't be undone.` : ""}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteOpen(false)}
      />
    </div>
  );
}
