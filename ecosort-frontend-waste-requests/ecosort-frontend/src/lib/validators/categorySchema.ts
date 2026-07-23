import { z } from "zod";
import { BIN_COLORS } from "@/types/category.types";

/** Mirrors CreateCategoryRequest/UpdateCategoryRequest validation exactly. */
export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(100),
  description: z.string().max(2000, "Description must be at most 2000 characters").optional(),
  binColor: z.enum(BIN_COLORS, { errorMap: () => ({ message: "Select a bin color" }) }),
  recyclable: z.boolean(),
});
export type CategoryFormSchema = z.infer<typeof categorySchema>;
