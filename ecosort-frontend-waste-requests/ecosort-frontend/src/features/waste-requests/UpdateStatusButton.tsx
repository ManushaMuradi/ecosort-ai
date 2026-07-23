"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/Button";
import { wasteRequestApi } from "@/lib/api/wasteRequestApi";
import type { ApiResponse } from "@/types/api.types";

interface UpdateStatusButtonProps {
  requestId: string;
  onUpdated: () => void;
}

/**
 * A single confirm-on-click action, not a modal — "mark collected" is
 * a low-stakes, easily-reversible-by-an-admin action (unlike delete),
 * so a lightweight inline confirm (via window.confirm-equivalent
 * pattern using local state) is appropriate rather than a full dialog.
 */
export function UpdateStatusButton({ requestId, onUpdated }: UpdateStatusButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function handleConfirm() {
    setIsLoading(true);
    try {
      await wasteRequestApi.updateStatus(requestId, { status: "COLLECTED" });
      toast.success("Marked as collected");
      onUpdated();
    } catch (err) {
      const message =
        (err as AxiosError<ApiResponse<unknown>>).response?.data?.message ??
        "Unable to update status. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-zinc-600">Confirm this pickup is collected?</span>
        <Button size="sm" isLoading={isLoading} onClick={handleConfirm}>
          Yes, mark collected
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setConfirming(false)} disabled={isLoading}>
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={() => setConfirming(true)} className="gap-1.5">
      <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
      Mark Collected
    </Button>
  );
}
