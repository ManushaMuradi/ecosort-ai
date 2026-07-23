package com.ecosort.wasteknowledge.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Inbound payload for PUT /api/v1/categories/{id}.
 * A separate type from CreateCategoryRequest even though the fields
 * are currently identical: the two requests represent different intents
 * (create vs. replace-update) and will likely diverge as the module
 * grows (e.g. update may later support partial fields) — keeping them
 * distinct now avoids an awkward retrofit later.
 */
public record UpdateCategoryRequest(

        @NotBlank(message = "Category name is required")
        @Size(max = 100, message = "Category name must be at most 100 characters")
        String name,

        @Size(max = 2000, message = "Description must be at most 2000 characters")
        String description,

        @NotBlank(message = "Bin color is required")
        @Size(max = 30, message = "Bin color must be at most 30 characters")
        String binColor,

        boolean recyclable
) {}