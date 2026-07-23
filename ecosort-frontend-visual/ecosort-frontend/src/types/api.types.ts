/**
 * Mirrors com.ecosort.common.dto.ApiResponse<T> exactly — every backend
 * endpoint returns this shape, so the frontend has one predictable
 * envelope to unwrap regardless of which endpoint was called.
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string | null;
  timestamp: string;
}

/**
 * Mirrors com.ecosort.common.dto.PageResponse<T> exactly.
 */
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

/**
 * Field-level validation errors, as returned for HTTP 422 responses
 * (GlobalExceptionHandler.handleValidation) — data is a map of
 * fieldName -> message rather than the usual T.
 */
export type ValidationErrorResponse = ApiResponse<Record<string, string>>;
