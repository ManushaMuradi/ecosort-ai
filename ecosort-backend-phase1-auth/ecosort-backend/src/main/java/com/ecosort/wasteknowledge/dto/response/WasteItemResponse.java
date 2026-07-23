package com.ecosort.wasteknowledge.dto.response;

import com.ecosort.wasteknowledge.entity.WasteItem;

import java.time.Instant;
import java.util.UUID;

/**
 * Outbound representation of a WasteItem. Embeds a small category
 * summary (id + name) rather than the full CategoryResponse — a
 * citizen viewing an item's disposal instructions needs to know which
 * category it belongs to, but not that category's full description or
 * bin color again; keep the payload focused on what this endpoint is for.
 */
public record WasteItemResponse(
        UUID id,
        String name,
        String scientificName,
        CategorySummary category,
        String disposalMethod,
        String recyclingInstructions,
        boolean hazardous,
        String imageUrl,
        Instant createdAt,
        Instant updatedAt
) {
    public record CategorySummary(UUID id, String name) {}

    public static WasteItemResponse from(WasteItem item) {
        return new WasteItemResponse(
                item.getId(),
                item.getName(),
                item.getScientificName(),
                new CategorySummary(item.getCategory().getId(), item.getCategory().getName()),
                item.getDisposalMethod(),
                item.getRecyclingInstructions(),
                item.isHazardous(),
                item.getImageUrl(),
                item.getCreatedAt(),
                item.getUpdatedAt()
        );
    }
}
