import type { AddressResponse } from "@/types/address.types";

export type WasteRequestStatus = "REQUESTED" | "SCHEDULED" | "COLLECTED" | "VERIFIED" | "CANCELLED";

/** Mirrors UserSummaryResponse — a deliberately small nested person reference, not the full User. */
export interface PersonSummary {
  id: string;
  fullName: string;
  email: string;
}

/** Mirrors the nested waste-item summary inside WasteRequestItemResponse. */
export interface RequestedItemSummary {
  id: string;
  name: string;
  categoryName: string;
}

/** Mirrors WasteRequestItemResponse. */
export interface WasteRequestItem {
  id: string;
  wasteItem: RequestedItemSummary;
  quantity: number;
  estimatedWeightKg: number;
}

/** Mirrors WasteRequestResponse — the full detail view. */
export interface WasteRequest {
  id: string;
  citizen: PersonSummary;
  address: AddressResponse;
  collector: PersonSummary | null;
  contactPhone: string;
  preferredPickupDate: string | null; // ISO date (yyyy-MM-dd)
  pickupNotes: string | null;
  status: WasteRequestStatus;
  items: WasteRequestItem[];
  createdAt: string;
  updatedAt: string;
}

/** Mirrors WasteRequestSummaryResponse — the lean list-row projection. */
export interface WasteRequestSummary {
  id: string;
  citizen: PersonSummary;
  collector: PersonSummary | null;
  status: WasteRequestStatus;
  itemCount: number;
  totalWeightKg: number;
  preferredPickupDate: string | null;
  createdAt: string;
}

/** Mirrors RequestStatusHistoryResponse — one row of the timeline. */
export interface RequestStatusHistoryEntry {
  id: string;
  fromStatus: WasteRequestStatus | null;
  toStatus: WasteRequestStatus;
  changedBy: PersonSummary;
  remarks: string | null;
  changedAt: string;
}

/** Mirrors WasteRequestItemInput — one line item in the create payload. */
export interface WasteRequestItemInput {
  wasteItemId: string;
  quantity: number;
  estimatedWeightKg: number;
}

/** Mirrors CreateWasteRequestRequest. */
export interface CreateWasteRequestPayload {
  addressId: string;
  contactPhone: string;
  preferredPickupDate?: string;
  pickupNotes?: string;
  items: WasteRequestItemInput[];
}

/** Mirrors AssignCollectorRequest. */
export interface AssignCollectorPayload {
  collectorId: string;
}

/** Mirrors UpdateStatusRequest — only ever sent as COLLECTED (by a collector) or VERIFIED (by an admin); SCHEDULED/CANCELLED go through their own dedicated endpoints. */
export interface UpdateStatusPayload {
  status: Extract<WasteRequestStatus, "COLLECTED" | "VERIFIED">;
  remarks?: string;
}

/** Mirrors CancelRequestRequest. */
export interface CancelRequestPayload {
  remarks?: string;
}
