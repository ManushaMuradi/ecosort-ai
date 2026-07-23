/** Mirrors AddressResponse. */
export interface AddressResponse {
  id: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string | null;
  postalCode: string;
  latitude: number | null;
  longitude: number | null;
}

/** Mirrors CreateAddressRequest. */
export interface CreateAddressPayload {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
}
