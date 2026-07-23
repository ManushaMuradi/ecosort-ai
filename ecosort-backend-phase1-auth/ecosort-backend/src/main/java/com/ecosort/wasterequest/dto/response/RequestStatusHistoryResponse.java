package com.ecosort.wasterequest.dto.response;

import com.ecosort.wasterequest.entity.RequestStatusHistory;

import java.time.Instant;
import java.util.UUID;

public record RequestStatusHistoryResponse(
        UUID id,
        String fromStatus,
        String toStatus,
        UserSummaryResponse changedBy,
        String remarks,
        Instant changedAt
) {
    public static RequestStatusHistoryResponse from(RequestStatusHistory history) {
        return new RequestStatusHistoryResponse(
                history.getId(),
                history.getFromStatus() != null ? history.getFromStatus().name() : null,
                history.getToStatus().name(),
                UserSummaryResponse.from(history.getChangedBy()),
                history.getRemarks(),
                history.getChangedAt()
        );
    }
}
