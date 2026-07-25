import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { tokenStorage } from "@/lib/auth/tokenStorage";
import type { ApiResponse } from "@/types/api.types";
import type { JwtResponse } from "@/types/auth.types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "https://ecosort-backend-d8hp.onrender.com";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// A second, bare axios instance (not apiClient) specifically for the
// refresh call — using apiClient here would recursively trigger its
// own response interceptor and risk an infinite refresh loop.
const refreshClient = axios.create({ baseURL: BASE_URL });

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Queues concurrent requests that fail with 401 while a single refresh
 * is in flight, instead of firing one refresh call per failed request.
 * Without this, 3 simultaneous requests hitting an expired token would
 * trigger 3 parallel /auth/refresh calls, and (since refresh tokens are
 * rotated server-side — see AuthServiceImpl.refresh) the 2nd and 3rd
 * would fail because the 1st already invalidated the token they all
 * still held.
 */
let isRefreshing = false;
let pendingQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error || !token) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  pendingQueue = [];
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    const isUnauthorized = error.response?.status === 401;
    const isAuthEndpoint = originalRequest?.url?.includes("/auth/");

    if (!isUnauthorized || isAuthEndpoint || !originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) {
      redirectToLogin();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // Another request already triggered a refresh — wait for it
      // instead of starting a second one.
      return new Promise((resolve, reject) => {
        pendingQueue.push({
          resolve: (newToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(apiClient(originalRequest));
          },
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const { data } = await refreshClient.post<ApiResponse<JwtResponse>>("/api/v1/auth/refresh", {
        refreshToken,
      });

      const jwt = data.data;
      if (!jwt) throw new Error("Empty refresh response");

      tokenStorage.setAccessToken(jwt.accessToken);
      tokenStorage.setRefreshToken(jwt.refreshToken);

      processQueue(null, jwt.accessToken);

      originalRequest.headers.Authorization = `Bearer ${jwt.accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      tokenStorage.clear();
      redirectToLogin();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

function redirectToLogin() {
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}
