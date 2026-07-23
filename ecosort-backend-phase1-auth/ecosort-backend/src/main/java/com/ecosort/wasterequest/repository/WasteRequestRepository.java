package com.ecosort.wasterequest.repository;

import com.ecosort.wasterequest.dto.response.WasteRequestSummaryResponse;
import com.ecosort.wasterequest.entity.WasteRequest;
import com.ecosort.wasterequest.entity.WasteRequestStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface WasteRequestRepository extends JpaRepository<WasteRequest, UUID> {

    /**
     * Fetches the full graph a WasteRequestResponse needs in ONE query
     * — citizen, address, collector, and every item's wasteItem +
     * category. Only used for the single-record detail endpoint, never
     * combined with Pageable: fetch-joining a collection alongside
     * pagination causes Hibernate to paginate in memory (see
     * WasteRequestSummaryResponse's Javadoc) — safe here specifically
     * because this returns at most one row.
     */
    @Query("""
            SELECT DISTINCT r FROM WasteRequest r
            JOIN FETCH r.citizen
            JOIN FETCH r.address
            LEFT JOIN FETCH r.collector
            LEFT JOIN FETCH r.items i
            LEFT JOIN FETCH i.wasteItem wi
            LEFT JOIN FETCH wi.category
            WHERE r.id = :id
            """)
    Optional<WasteRequest> findByIdWithDetails(@Param("id") UUID id);

    /**
     * All three paginated list queries below project directly into
     * WasteRequestSummaryResponse (a lean DTO with an item COUNT, not
     * the item list itself) — no collection fetch join means Spring
     * Data can paginate with a real SQL LIMIT/OFFSET, not an in-memory
     * page slice.
     */
    @Query(value = """
            SELECT NEW com.ecosort.wasterequest.dto.response.WasteRequestSummaryResponse(
    r.id, r.citizen, r.address.city, c, r.status,
    r.preferredPickupDate, SIZE(r.items), r.createdAt, r.updatedAt)
FROM WasteRequest r
LEFT JOIN r.collector c
            WHERE r.citizen.id = :citizenId
            AND (:status IS NULL OR r.status = :status)
            ORDER BY r.createdAt DESC
            """,
           countQuery = """
            SELECT count(r) FROM WasteRequest r
            WHERE r.citizen.id = :citizenId
            AND (:status IS NULL OR r.status = :status)
            """)
    Page<WasteRequestSummaryResponse> findByCitizenId(
            @Param("citizenId") UUID citizenId,
            @Param("status") WasteRequestStatus status,
            Pageable pageable);

    @Query(value = """
            SELECT NEW com.ecosort.wasterequest.dto.response.WasteRequestSummaryResponse(
                r.id, r.citizen, r.address.city, r.collector, r.status,
                r.preferredPickupDate, SIZE(r.items), r.createdAt, r.updatedAt)
            FROM WasteRequest r
            WHERE r.collector.id = :collectorId
            AND (:status IS NULL OR r.status = :status)
            ORDER BY r.preferredPickupDate ASC NULLS LAST
            """,
           countQuery = """
            SELECT count(r) FROM WasteRequest r
            WHERE r.collector.id = :collectorId
            AND (:status IS NULL OR r.status = :status)
            """)
    Page<WasteRequestSummaryResponse> findByCollectorId(
            @Param("collectorId") UUID collectorId,
            @Param("status") WasteRequestStatus status,
            Pageable pageable);

   @Query(value = """
    SELECT NEW com.ecosort.wasterequest.dto.response.WasteRequestSummaryResponse(
        r.id,
        r.citizen,
        r.address.city,
        c,
        r.status,
        r.preferredPickupDate,
        SIZE(r.items),
        r.createdAt,
        r.updatedAt
    )
    FROM WasteRequest r
    LEFT JOIN r.collector c
    WHERE (:status IS NULL OR r.status = :status)
    ORDER BY r.createdAt DESC
    """,
    countQuery = """
    SELECT COUNT(r)
    FROM WasteRequest r
    WHERE (:status IS NULL OR r.status = :status)
    """)
Page<WasteRequestSummaryResponse> findAllForAdmin(      
        @Param("status") WasteRequestStatus status,
        Pageable pageable);
    long countByStatus(WasteRequestStatus status);
}
