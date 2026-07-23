import { z } from "zod";

/** Mirrors backend LoginRequest validation (AuthController). */
export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * Mirrors backend RegisterRequest validation exactly (same min length
 * and letter+digit pattern as com.ecosort.security.dto.RegisterRequest)
 * so a form that passes client-side validation will not then be
 * rejected by the server with a 422 — the two layers stay in sync by
 * being copied from the same source of truth intentionally.
 */
export const registerSchema = z.object({
  fullName: z.string().min(1, "Full name is required").max(150),
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/(?=.*[A-Za-z])(?=.*\d)/, "Password must contain at least one letter and one digit"),
  phone: z
    .string()
    .regex(/^$|^[0-9+\-() ]{7,20}$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
});
export type RegisterFormValues = z.infer<typeof registerSchema>;
