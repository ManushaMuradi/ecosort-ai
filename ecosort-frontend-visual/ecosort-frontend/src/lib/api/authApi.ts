import { apiClient } from "@/lib/api/axiosClient";
import type { ApiResponse } from "@/types/api.types";
import type { JwtResponse, LoginRequest, RegisterRequest, User } from "@/types/auth.types";

/**
 * One function per backend endpoint, each returning the already-
 * unwrapped `data` payload (not the raw ApiResponse envelope) — callers
 * (AuthContext, forms) work with plain typed objects and never touch
 * `.data.data` unwrapping themselves. This is the "reusable API service
 * layer" requirement: every component that needs auth goes through
 * this file, never calls axios directly.
 */
export const authApi = {
  async register(payload: RegisterRequest): Promise<User> {
    const { data } = await apiClient.post<ApiResponse<User>>("/auth/register", payload);
    return data.data as User;
  },

  async login(payload: LoginRequest): Promise<JwtResponse> {
    const { data } = await apiClient.post<ApiResponse<JwtResponse>>("/auth/login", payload);
    return data.data as JwtResponse;
  },

  async refresh(refreshToken: string): Promise<JwtResponse> {
    const { data } = await apiClient.post<ApiResponse<JwtResponse>>("/auth/refresh", {
      refreshToken,
    });
    return data.data as JwtResponse;
  },

  async logout(refreshToken: string): Promise<void> {
    await apiClient.post("/auth/logout", { refreshToken });
  },

  async getCurrentUser(): Promise<User> {
    const { data } = await apiClient.get<ApiResponse<User>>("/auth/me");
    return data.data as User;
  },
};
