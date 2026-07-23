package com.ecosort.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

/**
 * Owns everything related to JWT creation and validation. Isolating this
 * in one class means if we ever change signing algorithm, token
 * structure, or library (e.g. jjwt -> nimbus-jose), exactly one class
 * changes — nothing else in the codebase knows or cares how a JWT is
 * built internally.
 */
@Component
public class JwtTokenProvider {

    private static final Logger log = LoggerFactory.getLogger(JwtTokenProvider.class);

    private final SecretKey signingKey;
    private final long accessTokenValidityMs;

    public JwtTokenProvider(
            @Value("${ecosort.jwt.secret}") String secret,
            @Value("${ecosort.jwt.access-token-validity-ms}") long accessTokenValidityMs
    ) {
        // The secret must be long/random enough for HMAC-SHA256 (>= 256 bits).
        // Loaded from configuration (ultimately an environment variable) —
        // NEVER hardcoded in source, per the architecture's security rules.
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes());
        this.accessTokenValidityMs = accessTokenValidityMs;
    }

    public String generateAccessToken(String userEmail, String userId) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + accessTokenValidityMs);

        return Jwts.builder()
                .subject(userEmail)
                .claim("userId", userId)
                .issuedAt(now)
                .expiration(expiry)
                .signWith(signingKey)
                .compact();
    }

    public long getAccessTokenValiditySeconds() {
        return accessTokenValidityMs / 1000;
    }

    /** Returns the subject (email) if the token is valid and unexpired, else empty. */
    public java.util.Optional<String> validateAndGetSubject(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(signingKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
            return java.util.Optional.of(claims.getSubject());
        } catch (JwtException | IllegalArgumentException ex) {
            // Covers: expired, malformed, unsupported, bad signature.
            // Logged at debug (not error) — an invalid token on a public
            // endpoint is an expected, routine occurrence, not a bug.
            log.debug("JWT validation failed: {}", ex.getMessage());
            return java.util.Optional.empty();
        }
    }
}
