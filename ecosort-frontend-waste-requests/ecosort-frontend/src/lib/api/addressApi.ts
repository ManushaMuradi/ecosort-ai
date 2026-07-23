import { apiClient } from "@/lib/api/axiosClient";
import type { ApiResponse } from "@/types/api.types";
import type { AddressResponse, CreateAddressPayload } from "@/types/address.types";

export const addressApi = {
  async create(payload: CreateAddressPayload): Promise<AddressResponse> {
    const { data } = await apiClient.post<ApiResponse<AddressResponse>>("/addresses", payload);
    return data.data as AddressResponse;
  },

  async listMine(): Promise<AddressResponse[]> {
    const { data } = await apiClient.get<ApiResponse<AddressResponse[]>>("/addresses/me");
    return data.data as AddressResponse[];
  },
};
