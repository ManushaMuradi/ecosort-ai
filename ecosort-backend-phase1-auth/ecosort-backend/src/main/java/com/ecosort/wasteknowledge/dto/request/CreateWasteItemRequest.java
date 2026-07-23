package com.ecosort.wasteknowledge.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

/**
 * Inbound payload for POST /api/v1/waste-items.
 */
public record CreateWasteItemRequest(

        @NotBlank(message = "Item name is required")
        @Size(max = 150, message = "Item name must be at most 150 characters")
        String name,

        @Size(max = 150, message = "Scientific name must be at most 150 characters")
        String scientificName,

        @NotNull(message = "Category id is required")
        UUID categoryId,

        @NotBlank(message = "Disposal method is required")
        String disposalMethod,

        String recyclingInstructions,

        boolean hazardous,

        @Size(max = 500, message = "Image URL must be at most 500 characters")
        String imageUrl
) {}