package com.ecosort.wasteknowledge.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Inbound payload for POST /api/v1/categories.
 */
public record CreateCategoryRequest(

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