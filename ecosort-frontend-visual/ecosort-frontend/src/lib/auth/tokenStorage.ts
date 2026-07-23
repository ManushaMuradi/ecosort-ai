/**
 * Centralizes where JWTs live in the browser. Deliberate split:
 *
 * - ACCESS TOKEN: kept ONLY in memory (a module-level variable), never
 *   in localStorage/sessionStorage. It's short-lived (15 min) and if an
 *   XSS payload ever ran on this page, an in-memory value can't be
 *   exfiltrated by reading storage after the fact — it only exists in
 *   this JS heap for the current tab's lifetime. The trade-off: it does
 *   NOT survive a page refresh, which is why the refresh token below
 *   exists — on app load, AuthContext calls /auth/refresh to silently
 *   re-obtain a new access token using it.
 *
 * - REFRESH TOKEN: persisted in localStorage so a refresh doesn't force
 *   a full re-login. This is a real, acknowledged trade-off: localStorage
 *   IS readable by any script on the page, so it's vulnerable to XSS in
 *   a way an httpOnly cookie would not be. The production-grade fix is
 *   a backend that sets the refresh token as an httpOnly cookie (via a
 *   Next.js Route Handler acting as a BFF proxy in front of the Spring
 *   Boot API) so client-side JS never touches it at all. That's flagged
 *   here as a concrete "next hardening step" rather than silently
 *   accepted — see README section on production hardening.
 */

const REFRESH_TOKEN_KEY = "ecosort_refresh_token";

let inMemoryAccessToken: string | null = null;

export const tokenStorage = {
  getAccessToken(): string | null {
    return inMemoryAccessToken;
  },

  setAccessToken(token: string | null): void {
    inMemoryAccessToken = token;
  },

  getRefreshToken(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken(token: string | null): void {
    if (typeof window === "undefined") return;
    if (token) {
      window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
    } else {
      window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    }
  },

  clear(): void {
    inMemoryAccessToken = null;
    tokenStorage.setRefreshToken(null);
  },
};
