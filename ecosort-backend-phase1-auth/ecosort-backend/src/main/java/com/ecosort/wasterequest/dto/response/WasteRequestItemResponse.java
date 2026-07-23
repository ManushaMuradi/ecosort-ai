package com.ecosort.wasterequest.dto.response;

import com.ecosort.wasterequest.entity.WasteRequestItem;

import java.math.BigDecimal;
import java.util.UUID;

public record WasteRequestItemResponse(
        UUID id,
        WasteItemSummary wasteItem,
        Integer quantity,
        BigDecimal estimatedWeightKg
) {
    /** id + name + category name — enough to display a line item, no more. */
    public record WasteItemSummary(UUID id, String name, String categoryName) {}

    public static WasteRequestItemResponse from(WasteRequestItem item) {
        return new WasteRequestItemResponse(
                item.getId(),
                new WasteItemSummary(
                        item.getWasteItem().getId(),
                        item.getWasteItem().getName(),
                        item.getWasteItem().getCategory().getName()
                ),
                item.getQuantity(),
                item.getEstimatedWeightKg()
        );
    }
}
