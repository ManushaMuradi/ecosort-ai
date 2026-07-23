"use client";

import { useState } from "react";
import { FolderTree, Plus } from "lucide-react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { SkeletonTable } from "@/components/ui/SkeletonTable";
import { Pagination } from "@/components/ui/Pagination";
import { CategoryTable } from "@/features/categories/CategoryTable";
import { CategoryForm } from "@/features/categories/CategoryForm";
import { useCategories } from "@/hooks/useCategories";
import { usePermissions } from "@/hooks/usePermissions";
import { categoryApi } from "@/lib/api/categoryApi";
import type { Category } from "@/types/category.types";
import type { CategoryFormSchema } from "@/lib/validators/categorySchema";
import type { ApiResponse } from "@/types/api.types";

type ModalState = { mode: "create" } | { mode: "edit"; category: Category } | null;

export default function CategoriesPage() {
  const [page, setPage] = useState(0);
  const { data, isLoading, error, refetch } = useCategories(page, 10);
  const { canWrite, canDelete } = usePermissions();

  const [modalState, setModalState] = useState<ModalState>(null);
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  function extractErrorMessage(err: unknown, fallback: string): string {
    const message = (err as AxiosError<ApiResponse<unknown>>).response?.data?.message;
    return message ?? fallback;
  }

  async function handleFormSubmit(values: CategoryFormSchema) {
    try {
      if (modalState?.mode === "edit") {
        await categoryApi.update(modalState.category.id, values);
        toast.success("Category updated");
      } else {
        await categoryApi.create(values);
        toast.success("Category created");
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
      await categoryApi.delete(deleteTarget.id);
      toast.success(`"${deleteTarget.name}" deleted`);
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      toast.error(extractErrorMessage(err, "Unable to delete this category."));
    } finally {
      setIsDeleting(false);
    }
  }

  const isEmpty = !isLoading && !error && data?.content.length === 0;

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-zinc-900">Waste Categories</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Manage the waste taxonomy citizens use to sort their items.
          </p>
        </div>
        {canWrite && (
          <Button onClick={() => setModalState({ mode: "create" })} className="gap-1.5">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add category
          </Button>
        )}
      </div>

      <Card className="mt-6 overflow-hidden">
        {isLoading && <SkeletonTable rows={6} columns={4} />}

        {error && !isLoading && (
          <EmptyState
            icon={FolderTree}
            title="Couldn't load categories"
            description={error}
            action={<Button onClick={refetch}>Try again</Button>}
          />
        )}

        {isEmpty && (
          <EmptyState
            icon={FolderTree}
            title="No categories yet"
            description="Create your first waste category to start building the disposal guide citizens will search."
            action={
              canWrite && (
                <Button onClick={() => setModalState({ mode: "create" })} className="gap-1.5">
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  Add category
                </Button>
              )
            }
          />
        )}

        {!isLoading && !error && data && data.content.length > 0 && (
          <>
            <CategoryTable
              categories={data.content}
              onEdit={(category) => setModalState({ mode: "edit", category })}
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
        title={modalState?.mode === "edit" ? "Edit category" : "Add category"}
        size="md"
      >
        <CategoryForm
          initialValues={modalState?.mode === "edit" ? modalState.category : undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => setModalState(null)}
          submitLabel={modalState?.mode === "edit" ? "Save changes" : "Create category"}
        />
      </Modal>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete category"
        description={
          deleteTarget
            ? `Delete "${deleteTarget.name}"? This can't be undone, and will fail if any waste items still reference it.`
            : ""
        }
        isLoading={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
