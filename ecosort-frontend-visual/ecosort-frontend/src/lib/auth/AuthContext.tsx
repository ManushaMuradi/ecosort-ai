"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { authApi } from "@/lib/api/authApi";
import { tokenStorage } from "@/lib/auth/tokenStorage";
import type { LoginRequest, RegisterRequest, User } from "@/types/auth.types";

interface AuthContextValue {
  user: User | null;
  /** True only while the initial session-restore check is running. */
  isInitializing: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // On first load, the in-memory access token is always empty (a full
  // page load clears JS memory). If a refresh token survived in
  // localStorage, silently exchange it for a new access token and
  // fetch the profile — this is what makes "stay logged in across a
  // refresh" work despite the access token being memory-only.
  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      const refreshToken = tokenStorage.getRefreshToken();
      if (!refreshToken) {
        setIsInitializing(false);
        return;
      }

      try {
        const jwt = await authApi.refresh(refreshToken);
        tokenStorage.setAccessToken(jwt.accessToken);
        tokenStorage.setRefreshToken(jwt.refreshToken);

        const me = await authApi.getCurrentUser();
        if (!cancelled) setUser(me);
      } catch {
        tokenStorage.clear();
      } finally {
        if (!cancelled) setIsInitializing(false);
      }
    }

    restoreSession();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (payload: LoginRequest) => {
    const jwt = await authApi.login(payload);
    tokenStorage.setAccessToken(jwt.accessToken);
    tokenStorage.setRefreshToken(jwt.refreshToken);
    const me = await authApi.getCurrentUser();
    setUser(me);
  }, []);

  const register = useCallback(async (payload: RegisterRequest) => {
    await authApi.register(payload);
    // Registration deliberately does NOT auto-login (mirrors the
    // backend: POST /auth/register returns a UserResponse, not tokens
    // — see AuthController). The user logs in explicitly afterward.
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = tokenStorage.getRefreshToken();
    try {
      if (refreshToken) await authApi.logout(refreshToken);
    } finally {
      tokenStorage.clear();
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isInitializing,
      isAuthenticated: user !== null,
      login,
      register,
      logout,
    }),
    [user, isInitializing, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
