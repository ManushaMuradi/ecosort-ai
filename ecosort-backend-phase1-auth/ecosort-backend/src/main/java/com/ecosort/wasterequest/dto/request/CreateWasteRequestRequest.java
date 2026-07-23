package com.ecosort.wasterequest.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

/**
 * Inbound payload for POST /api/v1/waste-requests. Bean Validation
 * handles shape (non-empty item list, positive quantities); it can't
 * validate that addressId belongs to the caller or that each
 * wasteItemId actually exists — those are business rules, checked in
 * WasteRequestServiceImpl against the database.
 */
public record CreateWasteRequestRequest(

        @NotNull(message = "Address is required")
        UUID addressId,

        @NotBlank(message = "Contact phone is required")
        @Size(max = 20)
        String contactPhone,

        @FutureOrPresent(message = "Preferred pickup date cannot be in the past")
        LocalDate preferredPickupDate,

        @Size(max = 2000)
        String pickupNotes,

        @NotEmpty(message = "At least one waste item is required")
        @Valid
        List<WasteRequestItemInput> items
) {}
