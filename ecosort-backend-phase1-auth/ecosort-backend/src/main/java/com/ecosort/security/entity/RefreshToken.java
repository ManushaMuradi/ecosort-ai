package com.ecosort.security.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

/**
 * A persisted refresh token. Storing this server-side (instead of just
 * issuing a long-lived JWT) is what makes logout and revocation
 * possible: a JWT alone cannot be invalidated before its natural
 * expiry, because validation is done purely by signature check, with
 * no server-side lookup. Persisting the token gives us that lookup.
 */
@Entity
@Table(name = "refresh_tokens")
@Getter
@Setter
@NoArgsConstructor
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, unique = true, length = 512)
    private String token;

    @Column(name = "expiry_date", nullable = false)
    private Instant expiryDate;

    @Column(nullable = false)
    private boolean revoked = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public boolean isExpired() {
        return expiryDate.isBefore(Instant.now());
    }

    public boolean isUsable() {
        return !revoked && !isExpired();
    }
}
