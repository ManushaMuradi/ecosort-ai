package com.ecosort.wasterequest.repository;

import com.ecosort.wasterequest.entity.RequestStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface RequestStatusHistoryRepository extends JpaRepository<RequestStatusHistory, UUID> {

    /**
     * JOIN FETCH changedBy so RequestStatusHistoryResponse.from() can
     * safely read the actor's name without a LazyInitializationException
     * — the timeline is read-only and always small (at most 5 rows,
     * one per lifecycle transition), so no pagination-vs-fetch-join
     * concern here.
     */
    @Query("""
            SELECT h FROM RequestStatusHistory h
            JOIN FETCH h.changedBy
            WHERE h.wasteRequest.id = :requestId
            ORDER BY h.changedAt ASC
            """)
    List<RequestStatusHistory> findByWasteRequestIdOrderByChangedAtAsc(@Param("requestId") UUID requestId);
}
