package com.ecosort.wasterequest.dto.request;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record AssignCollectorRequest(
        @NotNull(message = "Collector id is required")
        UUID collectorId
) {}
