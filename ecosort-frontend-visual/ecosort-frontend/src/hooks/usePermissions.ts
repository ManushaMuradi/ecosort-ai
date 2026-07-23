"use client";

import { useAuth } from "@/lib/auth/AuthContext";

/**
 * Mirrors the @PreAuthorize rules on WasteCategoryController /
 * WasteItemController exactly: SUPER_ADMIN and MUNICIPAL_ADMIN can
 * create/update, SUPER_ADMIN only can delete, everyone authenticated
 * can read. Centralized here so a role rule only ever needs updating
 * in one place if the backend's authorization matrix changes, instead
 * of being re-derived inline on every list page.
 */
export function usePermissions() {
  const { user } = useAuth();
  const roles = user?.roles ?? [];

  const canWrite = roles.includes("SUPER_ADMIN") || roles.includes("MUNICIPAL_ADMIN");
  const canDelete = roles.includes("SUPER_ADMIN");

  return { canWrite, canDelete };
}
