package com.ecosort.wasterequest.dto.response;

import com.ecosort.security.entity.User;

import java.util.UUID;

/**
 * A deliberately small nested summary (not the full UserResponse) —
 * a request listing needs to show "who requested this" / "who's
 * assigned", not a user's roles/status/phone. Mirrors the
 * CategorySummary-inside-WasteItemResponse pattern already established
 * in the wasteknowledge module.
 */
public record UserSummaryResponse(UUID id, String fullName, String email) {
    public static UserSummaryResponse from(User user) {
        return new UserSummaryResponse(user.getId(), user.getFullName(), user.getEmail());
    }
}
