package com.ecosort.security.dto;

/**
 * Returned on successful login/refresh. tokenType is included explicitly
 * ("Bearer") so the frontend never has to hardcode/guess the auth scheme
 * when building the Authorization header.
 */
public record JwtResponse(
        String accessToken,
        String refreshToken,
        String tokenType,
        long expiresInSeconds
) {
    public static JwtResponse of(String accessToken, String refreshToken, long expiresInSeconds) {
        return new JwtResponse(accessToken, refreshToken, "Bearer", expiresInSeconds);
    }
}
