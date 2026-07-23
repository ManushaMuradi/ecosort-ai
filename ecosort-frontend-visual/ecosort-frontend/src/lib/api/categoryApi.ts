import { apiClient } from "@/lib/api/axiosClient";
import { buildPageParams, type PageParams } from "@/lib/api/pageParams";
import type { ApiResponse, PageResponse } from "@/types/api.types";
import type { Category, CategoryFormValues } from "@/types/category.types";

/**
 * One function per backend endpoint (WasteCategoryController), each
 * returning the already-unwrapped payload — mirrors authApi.ts exactly.
 * No component ever imports apiClient directly for category data.
 */
export const categoryApi = {
  async list(params: PageParams = {}): Promise<PageResponse<Category>> {
    const { data } = await apiClient.get<ApiResponse<PageResponse<Category>>>("/categories", {
      params: buildPageParams(params),
    });
    return data.data as PageResponse<Category>;
  },

  async getById(id: string): Promise<Category> {
    const { data } = await apiClient.get<ApiResponse<Category>>(`/categories/${id}`);
    return data.data as Category;
  },

  async create(payload: CategoryFormValues): Promise<Category> {
    const { data } = await apiClient.post<ApiResponse<Category>>("/categories", payload);
    return data.data as Category;
  },

  async update(id: string, payload: CategoryFormValues): Promise<Category> {
    const { data } = await apiClient.put<ApiResponse<Category>>(`/categories/${id}`, payload);
    return data.data as Category;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/categories/${id}`);
  },
};
