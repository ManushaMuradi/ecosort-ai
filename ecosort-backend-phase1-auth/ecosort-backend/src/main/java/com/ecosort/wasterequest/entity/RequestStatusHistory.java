package com.ecosort.wasterequest.entity;

import com.ecosort.security.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.UUID;

/**
 * One append-only row per status transition. Never updated or deleted
 * after creation — this IS the citizen-facing timeline UI's data
 * source, and the audit trail an admin would need to answer "who
 * changed this and when." Has its own createdAt-equivalent (changedAt)
 * rather than extending Auditable, since "updatedAt" has no meaning for
 * an immutable log row.
 */
@Entity
@Table(name = "request_status_history")
@Getter
@Setter
@NoArgsConstructor
public class RequestStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "waste_request_id", nullable = false)
    private WasteRequest wasteRequest;

    @Enumerated(EnumType.STRING)
    @Column(name = "from_status", length = 20)
    private WasteRequestStatus fromStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "to_status", nullable = false, length = 20)
    private WasteRequestStatus toStatus;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "changed_by", nullable = false)
    private User changedBy;

    @Column(columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "changed_at", nullable = false, updatable = false)
    private Instant changedAt = Instant.now();

    public RequestStatusHistory(WasteRequest wasteRequest, WasteRequestStatus fromStatus,
                                 WasteRequestStatus toStatus, User changedBy, String remarks) {
        this.wasteRequest = wasteRequest;
        this.fromStatus = fromStatus;
        this.toStatus = toStatus;
        this.changedBy = changedBy;
        this.remarks = remarks;
    }
}
