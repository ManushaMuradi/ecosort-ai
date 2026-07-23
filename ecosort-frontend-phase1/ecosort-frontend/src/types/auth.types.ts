/** Mirrors JwtResponse from the backend. */
export interface JwtResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInSeconds: number;
}

/** Mirrors UserResponse from the backend. */
export interface User {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  status: "ACTIVE" | "SUSPENDED";
  roles: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}
