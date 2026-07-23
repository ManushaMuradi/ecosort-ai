/** Mirrors the nested CategorySummary record inside WasteItemResponse. */
export interface CategorySummary {
  id: string;
  name: string;
}

/** Mirrors com.ecosort.wasteknowledge.dto.response.WasteItemResponse */
export interface WasteItem {
  id: string;
  name: string;
  scientificName: string | null;
  category: CategorySummary;
  disposalMethod: string;
  recyclingInstructions: string | null;
  hazardous: boolean;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Mirrors CreateWasteItemRequest / UpdateWasteItemRequest (identical shape). */
export interface WasteItemFormValues {
  name: string;
  scientificName?: string;
  categoryId: string;
  disposalMethod: string;
  recyclingInstructions?: string;
  hazardous: boolean;
  imageUrl?: string;
}
