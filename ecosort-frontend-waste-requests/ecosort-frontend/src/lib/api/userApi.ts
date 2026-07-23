import { apiClient } from "@/lib/api/axiosClient";
import type { ApiResponse } from "@/types/api.types";
import type { User } from "@/types/auth.types";

/**
 * Thin wrapper over GET /api/v1/users?role=. Currently has exactly one
 * caller (useCollectorOptions), but kept generic by role rather than a
 * single-purpose "listCollectors" — matches the backend endpoint's own
 * generic-by-role design (see UserController).
 */
export const userApi = {
  async listByRole(role: string): Promise<User[]> {
    const { data } = await apiClient.get<ApiResponse<User[]>>("/users", { params: { role } });
    return data.data as User[];
  },
};
