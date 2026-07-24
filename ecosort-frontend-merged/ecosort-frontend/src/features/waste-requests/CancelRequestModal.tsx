"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { wasteRequestApi } from "@/lib/api/wasteRequestApi";
import type { ApiResponse } from "@/types/api.types";

interface CancelRequestModalProps {
  open: boolean;
  requestId: string;
  onClose: () => void;
  onCancelled: () => void;
}

/**
 * Built directly on Modal + Textarea rather than reusing ConfirmDialog
 * — ConfirmDialog's shape (icon + description + confirm/cancel) has no
 * slot for the optional remarks field this action needs, and adding
 * one there would be a special case bolted onto a component every
 * other delete confirmation in the app also uses.
 */
export function CancelRequestModal({ open, requestId, onClose, onCancelled }: CancelRequestModalProps) {
  const [remarks, setRemarks] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleConfirm() {
    setIsLoading(true);
    try {
      await wasteRequestApi.cancel(requestId, { remarks: remarks || undefined });
      toast.success("Pickup request cancelled");
      onCancelled();
      onClose();
    } catch (err) {
      const message =
        (err as AxiosError<ApiResponse<unknown>>).response?.data?.message ??
        "Unable to cancel this request. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Cancel pickup request" size="sm">
      <div className="flex gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle className="h-5 w-5 text-red-600" aria-hidden="true" />
        </div>
        <p className="text-sm text-zinc-600">
          This will cancel your pickup request. This can&apos;t be undone.
        </p>
      </div>

      <div className="mt-4">
        <Textarea
          label="Reason (optional)"
          rows={3}
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
      </div>

      <div className="mt-5 flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose} disabled={isLoading}>
          Keep request
        </Button>
        <Button className="bg-red-600 hover:bg-red-700" onClick={handleConfirm} isLoading={isLoading}>
          Cancel request
        </Button>
      </div>
    </Modal>
  );
}
