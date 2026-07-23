"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { categorySchema, type CategoryFormSchema } from "@/lib/validators/categorySchema";
import { BIN_COLORS } from "@/types/category.types";
import type { Category } from "@/types/category.types";

interface CategoryFormProps {
  initialValues?: Category;
  onSubmit: (values: CategoryFormSchema) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
}

/**
 * One form component for both create and edit — identical fields and
 * validation either way (mirrors backend's identical Create/Update
 * request shape); only the submit handler and initial values differ,
 * supplied by the calling page.
 */
export function CategoryForm({ initialValues, onSubmit, onCancel, submitLabel }: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormSchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialValues?.name ?? "",
      description: initialValues?.description ?? "",
      binColor: (initialValues?.binColor as CategoryFormSchema["binColor"]) ?? "GREEN",
      recyclable: initialValues?.recyclable ?? false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <Input label="Name" required error={errors.name?.message} {...register("name")} />

      <Textarea
        label="Description"
        error={errors.description?.message}
        {...register("description")}
      />

      <Select label="Bin color" required error={errors.binColor?.message} {...register("binColor")}>
        {BIN_COLORS.map((color) => (
          <option key={color} value={color}>
            {color.charAt(0) + color.slice(1).toLowerCase()}
          </option>
        ))}
      </Select>

      <label className="flex items-center gap-2 text-sm text-zinc-700">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-zinc-300 text-accent-600 focus-visible:ring-2 focus-visible:ring-accent-500"
          {...register("recyclable")}
        />
        Items in this category are generally recyclable
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
