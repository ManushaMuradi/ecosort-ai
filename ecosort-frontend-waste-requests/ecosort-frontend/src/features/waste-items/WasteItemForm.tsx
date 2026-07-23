"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { WasteItemImage } from "@/components/ui/WasteItemImage";
import { useCategoryOptions } from "@/hooks/useCategoryOptions";
import { wasteItemSchema, type WasteItemFormSchema } from "@/lib/validators/wasteItemSchema";
import type { WasteItem } from "@/types/wasteItem.types";

interface WasteItemFormProps {
  initialValues?: WasteItem;
  onSubmit: (values: WasteItemFormSchema) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}

export function WasteItemForm({ initialValues, onSubmit, onCancel, submitLabel }: WasteItemFormProps) {
  const { categories, isLoading: categoriesLoading } = useCategoryOptions();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<WasteItemFormSchema>({
    resolver: zodResolver(wasteItemSchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      scientificName: initialValues?.scientificName ?? "",
      categoryId: initialValues?.category.id ?? "",
      disposalMethod: initialValues?.disposalMethod ?? "",
      recyclingInstructions: initialValues?.recyclingInstructions ?? "",
      hazardous: initialValues?.hazardous ?? false,
      imageUrl: initialValues?.imageUrl ?? "",
    },
  });

  const imageUrlPreview = watch("imageUrl");

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Name" required error={errors.name?.message} {...register("name")} />
        <Input
          label="Scientific name (optional)"
          error={errors.scientificName?.message}
          {...register("scientificName")}
        />
      </div>

      <Select
        label="Category"
        required
        disabled={categoriesLoading}
        error={errors.categoryId?.message}
        {...register("categoryId")}
      >
        <option value="">{categoriesLoading ? "Loading categories…" : "Select a category"}</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>

      <Textarea
        label="Disposal method"
        required
        error={errors.disposalMethod?.message}
        {...register("disposalMethod")}
      />

      <Textarea
        label="Recycling instructions (optional)"
        error={errors.recyclingInstructions?.message}
        {...register("recyclingInstructions")}
      />

      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-start">
        <Input
          label="Image URL (optional)"
          placeholder="https://…"
          error={errors.imageUrl?.message}
          {...register("imageUrl")}
        />
        <div className="hidden sm:block">
          <p className="mb-1.5 text-sm font-medium text-zinc-700">Preview</p>
          <WasteItemImage src={imageUrlPreview || null} alt="Preview" size="sm" />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-zinc-700">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-zinc-300 text-red-600 focus-visible:ring-2 focus-visible:ring-red-500"
          {...register("hazardous")}
        />
        This item is hazardous
      </label>

      <div className="mt-2 flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
