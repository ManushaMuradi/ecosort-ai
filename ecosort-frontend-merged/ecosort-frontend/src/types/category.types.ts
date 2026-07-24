/** Mirrors com.ecosort.wasteknowledge.dto.response.CategoryResponse */
export interface Category {
  id: string;
  name: string;
  description: string | null;
  binColor: string;
  recyclable: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Mirrors CreateCategoryRequest / UpdateCategoryRequest (identical shape). */
export interface CategoryFormValues {
  name: string;
  description?: string;
  binColor: string;
  recyclable: boolean;
}

/** The bin colors seeded in V2__waste_knowledge_base.sql. */
export const BIN_COLORS = ["GREEN", "BLUE", "YELLOW", "RED"] as const;
export type BinColor = (typeof BIN_COLORS)[number];
