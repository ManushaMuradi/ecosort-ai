/**
 * Builds query params matching Spring Data's Pageable binding exactly
 * (page, size, sort=field,direction) — every paginated GET endpoint in
 * the backend (categories, waste-items, search, by-category) binds a
 * Pageable the same way, so one helper serves all of them instead of
 * each API module re-deriving the param shape.
 */
export interface PageParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export function buildPageParams({ page = 0, size = 10, sortBy, sortDir = "asc" }: PageParams) {
  const params: Record<string, string | number> = { page, size };
  if (sortBy) params.sort = `${sortBy},${sortDir}`;
  return params;
}
