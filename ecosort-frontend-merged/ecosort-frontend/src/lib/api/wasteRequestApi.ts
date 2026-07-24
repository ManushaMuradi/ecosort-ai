import { apiClient } from "@/lib/api/axiosClient";
import { buildPageParams, type PageParams } from "@/lib/api/pageParams";
import type { ApiResponse, PageResponse } from "@/types/api.types";
import type {
  AssignCollectorPayload,
  CancelRequestPayload,
  CreateWasteRequestPayload,
  RequestStatusHistoryEntry,
  UpdateStatusPayload,
  WasteRequest,
  WasteRequestStatus,
  WasteRequestSummary,
} from "@/types/wasteRequest.types";

interface RequestListParams extends PageParams {
  status?: WasteRequestStatus;
}

function withStatus(params: RequestListParams) {
  const query: Record<string, string | number> = { ...buildPageParams(params) };
  if (params.status) query.status = params.status;
  return query;
}

/**
 * One function per backend endpoint (WasteRequestController). Every
 * list function returns WasteRequestSummary (the lean projection);
 * getById returns the full WasteRequest — matches exactly which DTO
 * each backend endpoint actually returns, not a single shared shape.
 */
export const wasteRequestApi = {
  async create(payload: CreateWasteRequestPayload): Promise<WasteRequest> {
    const { data } = await apiClient.post<ApiResponse<WasteRequest>>("/waste-requests", payload);
    return data.data as WasteRequest;
  },

  async getById(id: string): Promise<WasteRequest> {
    const { data } = await apiClient.get<ApiResponse<WasteRequest>>(`/waste-requests/${id}`);
    return data.data as WasteRequest;
  },

  async getHistory(id: string): Promise<RequestStatusHistoryEntry[]> {
    const { data } = await apiClient.get<ApiResponse<RequestStatusHistoryEntry[]>>(
      `/waste-requests/${id}/history`
    );
    return data.data as RequestStatusHistoryEntry[];
  },

  async getMine(params: RequestListParams = {}): Promise<PageResponse<WasteRequestSummary>> {
    const { data } = await apiClient.get<ApiResponse<PageResponse<WasteRequestSummary>>>(
      "/waste-requests/me",
      { params: withStatus(params) }
    );
    return data.data as PageResponse<WasteRequestSummary>;
  },

  async getAssigned(params: RequestListParams = {}): Promise<PageResponse<WasteRequestSummary>> {
    const { data } = await apiClient.get<ApiResponse<PageResponse<WasteRequestSummary>>>(
      "/waste-requests/assigned",
      { params: withStatus(params) }
    );
    return data.data as PageResponse<WasteRequestSummary>;
  },

  async getAll(params: RequestListParams = {}): Promise<PageResponse<WasteRequestSummary>> {
    const { data } = await apiClient.get<ApiResponse<PageResponse<WasteRequestSummary>>>(
      "/waste-requests",
      { params: withStatus(params) }
    );
    return data.data as PageResponse<WasteRequestSummary>;
  },

  async assignCollector(id: string, payload: AssignCollectorPayload): Promise<WasteRequest> {
    const { data } = await apiClient.patch<ApiResponse<WasteRequest>>(
      `/waste-requests/${id}/assign`,
      payload
    );
    return data.data as WasteRequest;
  },

  async updateStatus(id: string, payload: UpdateStatusPayload): Promise<WasteRequest> {
    const { data } = await apiClient.patch<ApiResponse<WasteRequest>>(
      `/waste-requests/${id}/status`,
      payload
    );
    return data.data as WasteRequest;
  },

  async cancel(id: string, payload: CancelRequestPayload = {}): Promise<WasteRequest> {
    const { data } = await apiClient.patch<ApiResponse<WasteRequest>>(
      `/waste-requests/${id}/cancel`,
      payload
    );
    return data.data as WasteRequest;
  },
};
