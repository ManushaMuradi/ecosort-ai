package com.ecosort.wasterequest.dto.request;

import com.ecosort.wasterequest.entity.WasteRequestStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateStatusRequest(
        @NotNull(message = "Status is required")
        WasteRequestStatus status,

        @Size(max = 1000)
        String remarks
) {}
