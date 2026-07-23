package com.ecosort.wasterequest.entity;

import com.ecosort.address.entity.Address;
import com.ecosort.common.audit.Auditable;
import com.ecosort.security.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * The pickup request lifecycle header. Deliberately holds NO category
 * or weight fields directly — a single request can contain items from
 * multiple categories, so that detail lives entirely in
 * {@link WasteRequestItem}; this entity is the aggregate root, its
 * items are the aggregate's only children (never queried or modified
 * independently of their parent request).
 *
 * All ManyToOne/OneToMany relationships are LAZY — a request listing
 * (e.g. the admin dashboard table) should never implicitly pull in
 * full User/Address/Item object graphs; the service layer fetches
 * exactly what each response DTO needs via explicit JOIN FETCH queries
 * (see WasteRequestRepository), the same discipline already used for
 * WasteItem.category in the wasteknowledge module.
 */
@Entity
@Table(name = "waste_requests")
@Getter
@Setter
@NoArgsConstructor
public class WasteRequest extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "citizen_id", nullable = false)
    private User citizen;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "address_id", nullable = false)
    private Address address;

    @Column(name = "contact_phone", nullable = false, length = 20)
    private String contactPhone;

    /** Null until an admin assigns one (see chk_waste_request_collector_required in V3). */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "collector_id")
    private User collector;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private WasteRequestStatus status = WasteRequestStatus.REQUESTED;

    @Column(name = "preferred_pickup_date")
    private LocalDate preferredPickupDate;

    @Column(name = "pickup_notes", columnDefinition = "TEXT")
    private String pickupNotes;

    /**
     * cascade = ALL + orphanRemoval = true: items have no existence
     * independent of their request (classic order/order-line-item
     * aggregate) — adding to this list persists the child automatically
     * on save, and removing from this list deletes the row, so the
     * service layer never manages WasteRequestItem persistence directly.
     */
    @OneToMany(mappedBy = "wasteRequest", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<WasteRequestItem> items = new ArrayList<>();

    public void addItem(WasteRequestItem item) {
        items.add(item);
        item.setWasteRequest(this);
    }
}
