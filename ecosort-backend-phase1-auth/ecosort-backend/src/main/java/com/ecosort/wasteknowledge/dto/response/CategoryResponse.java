package com.ecosort.wasteknowledge.dto.response;

import com.ecosort.wasteknowledge.entity.WasteCategory;

import java.time.Instant;
import java.util.UUID;

/**
 * Outbound representation of a WasteCategory. Deliberately does not
 * include the full list of items — GET /categories/{id}/waste-items
 * is the dedicated, paginated endpoint for that, so this response stays
 * lightweight and safe to return in list views without risking an
 * accidental N+1 (or one category serializing hundreds of items inline).
 */
public record CategoryResponse(
        UUID id,
        String name,
        String description,
        String binColor,
        boolean recyclable,
        Instant createdAt,
        Instant updatedAt
) {
    public static CategoryResponse from(WasteCategory category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.getBinColor(),
                category.isRecyclable(),
                category.getCreatedAt(),
                category.getUpdatedAt()
        );
    }
}
