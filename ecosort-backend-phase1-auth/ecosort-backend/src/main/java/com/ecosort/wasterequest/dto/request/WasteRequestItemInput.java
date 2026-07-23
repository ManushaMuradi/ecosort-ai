package com.ecosort.wasterequest.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.UUID;

/** One line item within a CreateWasteRequestRequest's item list. */
public record WasteRequestItemInput(

        @NotNull(message = "Waste item id is required")
        UUID wasteItemId,

        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be at least 1")
        Integer quantity,

        @NotNull(message = "Estimated weight is required")
        @DecimalMin(value = "0.01", message = "Estimated weight must be greater than 0")
        BigDecimal estimatedWeightKg
) {}
