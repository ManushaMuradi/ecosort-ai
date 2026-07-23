import { z } from "zod";

/** Mirrors CreateWasteItemRequest/UpdateWasteItemRequest validation exactly. */
export const wasteItemSchema = z.object({
  name: z.string().min(1, "Item name is required").max(150),
  scientificName: z.string().max(150).optional().or(z.literal("")),
  categoryId: z.string().min(1, "Select a category"),
  disposalMethod: z.string().min(1, "Disposal method is required"),
  recyclingInstructions: z.string().optional().or(z.literal("")),
  hazardous: z.boolean(),
  imageUrl: z
    .string()
    .max(500)
    .optional()
    .or(z.literal(""))
    .refine(
      (val) => !val || /^https?:\/\/.+/i.test(val),
      "Enter a valid URL starting with http:// or https://"
    ),
});
export type WasteItemFormSchema = z.infer<typeof wasteItemSchema>;
