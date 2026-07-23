"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/Button";
import { wasteRequestApi } from "@/lib/api/wasteRequestApi";
import type { ApiResponse } from "@/types/api.types";

interface VerifyCollectionButtonProps {
  requestId: string;
  onVerified: () => void;
}

export function VerifyCollectionButton({ requestId, onVerified }: VerifyCollectionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [confirming, setConfirming] = useState(false);

  async function handleConfirm() {
    setIsLoading(true);
    try {
      await wasteRequestApi.updateStatus(requestId, { status: "VERIFIED" });
      toast.success("Collection verified");
      onVerified();
    } catch (err) {
      const message =
        (err as AxiosError<ApiResponse<unknown>>).response?.data?.message ??
        "Unable to verify this collection. Please try again.";
      toast.error(message);
    } finally {
      setIsLoading(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-zinc-600">Confirm this collection is verified?</span>
        <Button size="sm" isLoading={isLoading} onClick={handleConfirm}>
          Yes, verify
        </Button>
        <Button size="sm" variant="secondary" onClick={() => setConfirming(false)} disabled={isLoading}>
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={() => setConfirming(true)} className="gap-1.5">
      <ShieldCheck className="h-4 w-4" aria-hidden="true" />
      Verify Collection
    </Button>
  );
}
