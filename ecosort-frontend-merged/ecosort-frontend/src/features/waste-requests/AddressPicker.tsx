"use client";

import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { addressApi } from "@/lib/api/addressApi";
import type { AddressResponse, CreateAddressPayload } from "@/types/address.types";

interface AddressPickerProps {
  value: string;
  onChange: (addressId: string) => void;
  error?: string;
}

const emptyDraft: CreateAddressPayload = { line1: "", city: "", postalCode: "" };

/**
 * Self-contained: fetches its own address list and owns the
 * add-new-address flow, rather than pushing that state up into
 * PickupRequestForm — the parent form only ever needs to know "which
 * addressId is selected," not how the address list is fetched or how
 * a new one gets created.
 */
export function AddressPicker({ value, onChange, error }: AddressPickerProps) {
  const [addresses, setAddresses] = useState<AddressResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState<CreateAddressPayload>(emptyDraft);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    addressApi
      .listMine()
      .then((result) => {
        setAddresses(result);
        // If there's exactly one saved address, pre-select it — one
        // less click for the common case of a citizen with one home.
        const firstAddress = result[0];

        if (result.length === 1 && firstAddress && !value) {
          onChange(firstAddress.id);
        }
        if (result.length === 0) setIsAdding(true);
      })
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleSaveNewAddress() {
    if (!draft.line1 || !draft.city || !draft.postalCode) {
      toast.error("Please fill in address line, city, and postal code");
      return;
    }
    setIsSaving(true);
    try {
      const created = await addressApi.create(draft);
      setAddresses((prev) => [...prev, created]);
      onChange(created.id);
      setIsAdding(false);
      setDraft(emptyDraft);
      toast.success("Address saved");
    } catch {
      toast.error("Unable to save this address. Please check the details and try again.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) return <Skeleton className="h-10 w-full" />;

  return (
    <div className="flex flex-col gap-3">
      {addresses.length > 0 && !isAdding && (
        <Select
          label="Pickup address"
          required
          value={value}
          error={error}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select an address…</option>
          {addresses.map((addr) => (
            <option key={addr.id} value={addr.id}>
              {addr.line1}, {addr.city} {addr.postalCode}
            </option>
          ))}
        </Select>
      )}

      {!isAdding && (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="inline-flex w-fit items-center gap-1 text-sm font-medium text-accent-600 hover:text-accent-700"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Add a new address
        </button>
      )}

      {isAdding && (
        <div className="flex flex-col gap-3 rounded-md border border-zinc-200 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-zinc-700">New address</p>
            {addresses.length > 0 && (
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                aria-label="Cancel adding address"
                className="rounded-md p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            )}
          </div>

          {/* Single column on mobile, two columns from sm up */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Input
                label="Address line 1"
                required
                value={draft.line1}
                onChange={(e) => setDraft({ ...draft, line1: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <Input
                label="Address line 2"
                value={draft.line2 ?? ""}
                onChange={(e) => setDraft({ ...draft, line2: e.target.value })}
              />
            </div>
            <Input
              label="City"
              required
              value={draft.city}
              onChange={(e) => setDraft({ ...draft, city: e.target.value })}
            />
            <Input
              label="State"
              value={draft.state ?? ""}
              onChange={(e) => setDraft({ ...draft, state: e.target.value })}
            />
            <Input
              label="Postal code"
              required
              value={draft.postalCode}
              onChange={(e) => setDraft({ ...draft, postalCode: e.target.value })}
            />
          </div>

          <Button type="button" size="sm" isLoading={isSaving} onClick={handleSaveNewAddress} className="w-fit">
            Save address
          </Button>
        </div>
      )}
    </div>
  );
}
