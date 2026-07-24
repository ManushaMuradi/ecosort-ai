import { z } from "zod";

/** One line item row within the pickup request form. */
export const wasteRequestItemSchema = z.object({
  wasteItemId: z.string().min(1, "Select an item"),
  wasteItemName: z.string(), // display-only, not sent to the backend — see PickupRequestForm
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  estimatedWeightKg: z.coerce.number().min(0.01, "Weight must be greater than 0"),
});

/** Mirrors CreateWasteRequestRequest validation exactly. */
export const pickupRequestSchema = z.object({
  addressId: z.string().min(1, "Select or add a pickup address"),
  contactPhone: z
    .string()
    .min(1, "Contact phone is required")
    .regex(/^[0-9+\-() ]{7,20}$/, "Enter a valid phone number"),
  preferredPickupDate: z.string().optional().or(z.literal("")),
  pickupNotes: z.string().max(1000, "Notes must be at most 1000 characters").optional().or(z.literal("")),
  items: z.array(wasteRequestItemSchema).min(1, "Add at least one waste item"),
});
export type PickupRequestFormValues = z.infer<typeof pickupRequestSchema>;

/** Mirrors CancelRequestRequest. */
export const cancelRequestSchema = z.object({
  remarks: z.string().max(1000, "Remarks must be at most 1000 characters").optional().or(z.literal("")),
});
export type CancelRequestFormValues = z.infer<typeof cancelRequestSchema>;
