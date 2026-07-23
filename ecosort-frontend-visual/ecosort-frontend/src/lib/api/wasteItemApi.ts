import { apiClient } from "@/lib/api/axiosClient";
import { buildPageParams, type PageParams } from "@/lib/api/pageParams";
import type { ApiResponse, PageResponse } from "@/types/api.types";
import type { WasteItem, WasteItemFormValues } from "@/types/wasteItem.types";

/**
 * One function per backend endpoint (WasteItemController). Note
 * getByCategory calls GET /api/v1/categories/{categoryId}/waste-items —
 * that nested path is the actual route WasteItemController exposes
 * (grouped by response type, not URL prefix — see backend controller
 * comment), not /waste-items/category/{id}.
 */
export const wasteItemApi = {
  async list(params: PageParams = {}): Promise<PageResponse<WasteItem>> {
    const { data } = await apiClient.get<ApiResponse<PageResponse<WasteItem>>>("/waste-items", {
      params: buildPageParams(params),
    });
    return data.data as PageResponse<WasteItem>;
  },

  async getById(id: string): Promise<WasteItem> {
    const { data } = await apiClient.get<ApiResponse<WasteItem>>(`/waste-items/${id}`);
    return data.data as WasteItem;
  },

  async search(keyword: string, params: PageParams = {}): Promise<PageResponse<WasteItem>> {
    const { data } = await apiClient.get<ApiResponse<PageResponse<WasteItem>>>(
      "/waste-items/search",
      { params: { keyword, ...buildPageParams(params) } }
    );
    return data.data as PageResponse<WasteItem>;
  },

  async getByCategory(categoryId: string, params: PageParams = {}): Promise<PageResponse<WasteItem>> {
  const { data } = await apiClient.get<ApiResponse<PageResponse<WasteItem>>>(
    `/waste-items/category/${categoryId}`,
    { params: buildPageParams(params) }
  );
  return data.data as PageResponse<WasteItem>;
},
  async create(payload: WasteItemFormValues): Promise<WasteItem> {
    const { data } = await apiClient.post<ApiResponse<WasteItem>>("/waste-items", payload);
    return data.data as WasteItem;
  },

  async update(id: string, payload: WasteItemFormValues): Promise<WasteItem> {
    const { data } = await apiClient.put<ApiResponse<WasteItem>>(`/waste-items/${id}`, payload);
    return data.data as WasteItem;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/waste-items/${id}`);
  },
};
