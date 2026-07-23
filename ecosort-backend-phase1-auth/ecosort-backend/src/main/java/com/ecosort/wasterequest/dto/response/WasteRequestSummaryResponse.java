package com.ecosort.wasterequest.dto.response;

import com.ecosort.security.entity.User;
import com.ecosort.wasterequest.entity.WasteRequestStatus;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Deliberately lean: no item list, just a count. List views (My
 * Requests, Assigned Pickups, Admin dashboard table) don't need full
 * per-item detail — only the single-request detail page does, via
 * WasteRequestResponse. Keeping items out of this projection is what
 * lets the repository paginate with a real SQL LIMIT/OFFSET instead of
 * Hibernate silently loading every matching row into memory (which is
 * exactly what happens if you paginate a query with a JOIN FETCH on a
 * collection — a real, easy-to-miss Hibernate pitfall).
 */
public record WasteRequestSummaryResponse(
        UUID id,
        UserSummaryResponse citizen,
        String addressCity,
        UserSummaryResponse collector,
        String status,
        LocalDate preferredPickupDate,
        Long itemCount,
        Instant createdAt,
        Instant updatedAt
) {
    /**
     * Secondary constructor whose parameter types match the JPQL
     * "SELECT NEW ...(...)" expression in WasteRequestRepository
     * exactly (entities/scalars as selected, not the record's own
     * canonical component types) — this is where entity-to-summary
     * mapping actually happens for the projection.
     */
     public WasteRequestSummaryResponse(
        UUID id,
        User citizen,
        String addressCity,
        User collector,
        WasteRequestStatus status,
        LocalDate preferredPickupDate,
        long itemCount,
        Instant createdAt,
        Instant updatedAt
){
        this(
        id,
        UserSummaryResponse.from(citizen),
        addressCity,
        collector != null ? UserSummaryResponse.from(collector) : null,
        status.name(),
        preferredPickupDate,
        itemCount,
        createdAt,
        updatedAt
        );
    }
}
