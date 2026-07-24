"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { AddressPicker } from "@/features/waste-requests/AddressPicker";
import { WasteRequestItemRow } from "@/features/waste-requests/WasteRequestItemRow";
import { wasteRequestApi } from "@/lib/api/wasteRequestApi";
import { pickupRequestSchema, type PickupRequestFormValues } from "@/lib/validators/wasteRequestSchemas";
import type { ApiResponse } from "@/types/api.types";

const emptyItem = { wasteItemId: "", wasteItemName: "", quantity: 1, estimatedWeightKg: 0.5 };

/**
 * Single column at every field on mobile; the address/date/phone
 * fields move to a two-column grid from sm up, but the item list
 * always stays full-width (each row already has its own internal
 * responsive layout — see WasteRequestItemRow) since cramming it into
 * a grid column would make the search dropdown uncomfortably narrow.
 */
export function PickupRequestForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PickupRequestFormValues>({
    resolver: zodResolver(pickupRequestSchema),
    defaultValues: { addressId: "", contactPhone: "", items: [emptyItem] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });
  const addressId = watch("addressId");
  const items = watch("items");

  async function onSubmit(values: PickupRequestFormValues) {
    setServerError(null);
    try {
      const created = await wasteRequestApi.create({
        addressId: values.addressId,
        contactPhone: values.contactPhone,
        preferredPickupDate: values.preferredPickupDate || undefined,
        pickupNotes: values.pickupNotes || undefined,
        items: values.items.map((item) => ({
          wasteItemId: item.wasteItemId,
          quantity: item.quantity,
          estimatedWeightKg: item.estimatedWeightKg,
        })),
      });
      toast.success("Pickup request submitted");
      router.push(`/requests/${created.id}`);
    } catch (err) {
      const message =
        (err as AxiosError<ApiResponse<unknown>>).response?.data?.message ??
        "Unable to submit your request. Please try again.";
      setServerError(message);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-6">
      {serverError && (
        <div role="alert" className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {serverError}
        </div>
      )}

      <AddressPicker
        value={addressId}
        onChange={(id) => setValue("addressId", id, { shouldValidate: true })}
        error={errors.addressId?.message}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          label="Contact phone"
          required
          error={errors.contactPhone?.message}
          {...register("contactPhone")}
        />
        <Input
          label="Preferred pickup date"
          type="date"
          min={new Date().toISOString().split("T")[0]}
          error={errors.preferredPickupDate?.message}
          {...register("preferredPickupDate")}
        />
      </div>

      <Textarea
        label="Notes for the collector (optional)"
        rows={3}
        error={errors.pickupNotes?.message}
        {...register("pickupNotes")}
      />

      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-900">Items to be collected</h3>
        </div>
        {errors.items?.message && (
          <p className="mt-1 text-sm text-red-600">{errors.items.message}</p>
        )}
        <div className="mt-2 flex flex-col gap-3">
          {fields.map((field, index) => (
            <WasteRequestItemRow
              key={field.id}
              index={index}
              wasteItemId={items[index]?.wasteItemId ?? ""}
              wasteItemName={items[index]?.wasteItemName ?? ""}
              quantity={items[index]?.quantity ?? 1}
              estimatedWeightKg={items[index]?.estimatedWeightKg ?? 0.5}
              onChange={(fieldName, value) => setValue(`items.${index}.${fieldName}`, value as never)}
              onRemove={() => remove(index)}
              canRemove={fields.length > 1}
              errors={errors.items?.[index]}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => append(emptyItem)}
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent-600 hover:text-accent-700"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Add another item
        </button>
      </div>

      <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full sm:w-fit">
        Submit pickup request
      </Button>
    </form>
  );
}
