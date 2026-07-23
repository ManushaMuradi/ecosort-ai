package com.ecosort.wasterequest.dto.response;

import com.ecosort.address.dto.AddressResponse;
import com.ecosort.wasterequest.entity.WasteRequest;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public record WasteRequestResponse(
        UUID id,
        UserSummaryResponse citizen,
        AddressResponse address,
        String contactPhone,
        UserSummaryResponse collector,
        String status,
        LocalDate preferredPickupDate,
        String pickupNotes,
        List<WasteRequestItemResponse> items,
        Instant createdAt,
        Instant updatedAt
) {
    public static WasteRequestResponse from(WasteRequest request) {
        return new WasteRequestResponse(
                request.getId(),
                UserSummaryResponse.from(request.getCitizen()),
                AddressResponse.from(request.getAddress()),
                request.getContactPhone(),
                request.getCollector() != null ? UserSummaryResponse.from(request.getCollector()) : null,
                request.getStatus().name(),
                request.getPreferredPickupDate(),
                request.getPickupNotes(),
                request.getItems().stream().map(WasteRequestItemResponse::from).collect(Collectors.toList()),
                request.getCreatedAt(),
                request.getUpdatedAt()
        );
    }
}
