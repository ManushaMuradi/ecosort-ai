"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { useCollectorOptions } from "@/hooks/useCollectorOptions";
import { wasteRequestApi } from "@/lib/api/wasteRequestApi";
import type { ApiResponse } from "@/types/api.types";

interface AssignCollectorModalProps {
  open: boolean;
  requestId: string;
  onClose: () => void;
  onAssigned: () => void;
}

export function AssignCollectorModal({ open, requestId, onClose, onAssigned }: AssignCollectorModalProps) {
  const { collectors, isLoading, error } = useCollectorOptions();
  const [collectorId, setCollectorId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleAssign() {
    if (!collectorId) {
      toast.error("Select a collector");
      return;
    }
    setIsSubmitting(true);
    try {
      await wasteRequestApi.assignCollector(requestId, { collectorId });
      toast.success("Collector assigned");
      onAssigned();
      onClose();
    } catch (err) {
      const message =
        (err as AxiosError<ApiResponse<unknown>>).response?.data?.message ??
        "Unable to assign a collector. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Assign a collector" size="sm">
      {isLoading && <Skeleton className="h-10 w-full" />}

      {error && <p className="text-sm text-red-600">{error}</p>}

      {!isLoading && !error && collectors.length === 0 && (
        <p className="text-sm text-zinc-500">
          No active collectors are available to assign right now.
        </p>
      )}

      {!isLoading && !error && collectors.length > 0 && (
        <Select
          label="Collector"
          required
          value={collectorId}
          onChange={(e) => setCollectorId(e.target.value)}
        >
          <option value="">Select a collector…</option>
          {collectors.map((c) => (
            <option key={c.id} value={c.id}>
              {c.fullName} ({c.email})
            </option>
          ))}
        </Select>
      )}

      <div className="mt-5 flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleAssign}
          isLoading={isSubmitting}
          disabled={collectors.length === 0}
        >
          Assign
        </Button>
      </div>
    </Modal>
  );
}
