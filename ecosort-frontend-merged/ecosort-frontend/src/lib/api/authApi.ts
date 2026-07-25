import { apiClient } from "@/lib/api/axiosClient";
import type { ApiResponse } from "@/types/api.types";
import type { JwtResponse, LoginRequest, RegisterRequest, User } from "@/types/auth.types";

export const authApi = {
  async register(payload: RegisterRequest): Promise<User> {
    const { data } = await apiClient.post<ApiResponse<User>>(
      "/api/v1/auth/register",
      payload
    );
    return data.data as User;
  },

  async login(payload: LoginRequest): Promise<JwtResponse> {
    const { data } = await apiClient.post<ApiResponse<JwtResponse>>(
      "/api/v1/auth/login",
      payload
    );
    return data.data as JwtResponse;
  },

  async refresh(refreshToken: string): Promise<JwtResponse> {
    const { data } = await apiClient.post<ApiResponse<JwtResponse>>(
      "/api/v1/auth/refresh",
      {
        refreshToken,
      }
    );
    return data.data as JwtResponse;
  },

  async logout(refreshToken: string): Promise<void> {
    await apiClient.post("/api/v1/auth/logout", {
      refreshToken,
    });
  },

  async getCurrentUser(): Promise<User> {
    const { data } = await apiClient.get<ApiResponse<User>>(
      "/api/v1/auth/me"
    );
    return data.data as User;
  },
};