package com.ecosort.wasterequest.dto.request;

import jakarta.validation.constraints.Size;

public record CancelRequestRequest(
        @Size(max = 1000)
        String remarks
) {}
