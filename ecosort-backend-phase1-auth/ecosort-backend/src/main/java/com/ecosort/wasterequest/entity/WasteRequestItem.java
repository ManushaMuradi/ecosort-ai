package com.ecosort.wasterequest.entity;

import com.ecosort.wasteknowledge.entity.WasteItem;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * A single line item within a WasteRequest — references a catalog
 * {@link WasteItem} (not a category directly), so the category is
 * implied per-item; this is what lets one request span multiple
 * categories (e.g. a plastic bottle + a battery in the same pickup).
 * Never queried independently of its parent WasteRequest — see the
 * cascade/orphanRemoval configuration on WasteRequest.items.
 */
@Entity
@Table(name = "waste_request_items")
@Getter
@Setter
@NoArgsConstructor
public class WasteRequestItem {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "waste_request_id", nullable = false)
    private WasteRequest wasteRequest;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "waste_item_id", nullable = false)
    private WasteItem wasteItem;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "estimated_weight_kg", nullable = false, precision = 6, scale = 2)
    private BigDecimal estimatedWeightKg;

    public WasteRequestItem(WasteItem wasteItem, Integer quantity, BigDecimal estimatedWeightKg) {
        this.wasteItem = wasteItem;
        this.quantity = quantity;
        this.estimatedWeightKg = estimatedWeightKg;
    }
}
