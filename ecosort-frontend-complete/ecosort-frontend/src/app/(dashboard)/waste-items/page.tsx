"use client";

import { useState } from "react";
import { Package, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonTable } from "@/components/ui/SkeletonTable";
import { Pagination } from "@/components/ui/Pagination";
import { SearchInput } from "@/components/ui/SearchInput";
import { WasteItemTable } from "@/features/waste-items/WasteItemTable";
import { WasteItemForm } from "@/features/waste-items/WasteItemForm";
import { useWasteItems } from "@/hooks/useWasteItems";
import { useCategoryOptions } from "@/hooks/useCategoryOptions";
import { useDebounce } from "@/hooks/useDebounce";
import { usePermissions } from "@/hooks/usePermissions";
import { wasteItemApi } from "@/lib/api/wasteItemApi";
import type { WasteItem } from "@/types/wasteItem.types";
import type { WasteItemFormSchema } from "@/lib/validators/wasteItemSchema";
import type { ApiResponse } from "@/types/api.types";

type ModalState = { mode: "create" } | { mode: "edit"; item: WasteItem } | null;

export default function WasteItemsPage() {
  const [page, setPage] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const debouncedKeyword = useDebounce(keyword);

  const { data, isLoading, error, refetch } = useWasteItems({
    page,
    size: 10,
    keyword: debouncedKeyword,
    // Search takes priority over category filtering in the hook, so
    // only pass categoryId when there's no active search — matches the
    // control being disabled below, keeping the UI and the fetch logic
    // in agreement about which filter is "active".
    categoryId: debouncedKeyword ? undefined : categoryId || undefined,
  });
  const { categories } = useCategoryOptions();
  const { canWrite, canDelete } = usePermissions();

  const [modalState, setModalState] = useState<ModalState>(null);
  const [deleteTarget, setDeleteTarget] = useState<WasteItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function extractErrorMessage(err: unknown, fallback: string): string {
    const message = (err as AxiosError<ApiResponse<unknown>>).response?.data?.message;
    return message ?? fallback;
  }

  function resetToFirstPage() {
    setPage(0);
  }

  async function handleFormSubmit(values: WasteItemFormSchema) {
    try {
      if (modalState?.mode === "edit") {
        await wasteItemApi.update(modalState.item.id, values);
        toast.success("Waste item updated");
      } else {
        await wasteItemApi.create(values);
        toast.success("Waste item created");
      }
      setModalState(null);
      refetch();
    } catch (err) {
      toast.error(extractErrorMessage(err, "Something went wrong. Please try again."));
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await wasteItemApi.delete(deleteTarget.id);
      toast.success(`"${deleteTarget.name}" deleted`);
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(extractErrorMessage(err, "Unable to delete this item."));
    } finally {
      setIsDeleting(false);
    }
  }

  const isEmpty = !isLoading && !error && data?.content.length === 0;
  const isFiltering = debouncedKeyword.length > 0 || categoryId.length > 0;

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900">Waste Items</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Search disposal and recycling guidance for individual items.
          </p>
        </div>
        {canWrite && (
          <Button onClick={() => setModalState({ mode: "create" })} className="gap-1.5">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add waste item
          </Button>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="sm:w-72">
          <SearchInput
            value={keyword}
            onChange={(value) => {
              setKeyword(value);
              resetToFirstPage();
            }}
            placeholder="Search by name or scientific name…"
          />
        </div>
        <select
          value={categoryId}
          disabled={keyword.length > 0}
          onChange={(e) => {
            setCategoryId(e.target.value);
            resetToFirstPage();
          }}
          aria-label="Filter by category"
          className="h-9 rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-400 focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-1 sm:w-56"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <Card className="mt-4 overflow-hidden">
        {isLoading && <SkeletonTable rows={6} columns={4} />}

        {error && !isLoading && (
          <EmptyState
            icon={Package}
            title="Couldn't load waste items"
            description={error}
            action={<Button onClick={refetch}>Try again</Button>}
          />
        )}

        {isEmpty && isFiltering && (
          <EmptyState
            icon={Package}
            title="No matching items"
            description="Try a different keyword or clear the category filter."
          />
        )}

        {isEmpty && !isFiltering && (
          <EmptyState
            icon={Package}
            title="No waste items yet"
            description="Add your first waste item to start building the citizen-facing disposal guide."
            action={
              canWrite && (
                <Button onClick={() => setModalState({ mode: "create" })} className="gap-1.5">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Add waste item
                </Button>
              )
            }
          />
        )}

        {!isLoading && !error && data && data.content.length > 0 && (
          <>
            <WasteItemTable
              items={data.content}
              onEdit={(item) => setModalState({ mode: "edit", item })}
              onDelete={setDeleteTarget}
              canEdit={canWrite}
              canDelete={canDelete}
            />
            <Pagination
              page={data.page}
              totalPages={data.totalPages}
              totalElements={data.totalElements}
              pageSize={data.size}
              onPageChange={setPage}
            />
          </>
        )}
      </Card>

      <Modal
        open={modalState !== null}
        onClose={() => setModalState(null)}
        title={modalState?.mode === "edit" ? "Edit waste item" : "Add waste item"}
        size="lg"
      >
        <WasteItemForm
          initialValues={modalState?.mode === "edit" ? modalState.item : undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => setModalState(null)}
          submitLabel={modalState?.mode === "edit" ? "Save changes" : "Create item"}
        />
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete waste item"
        description={deleteTarget ? `Delete "${deleteTarget.name}"? This can't be undone.` : ""}
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
