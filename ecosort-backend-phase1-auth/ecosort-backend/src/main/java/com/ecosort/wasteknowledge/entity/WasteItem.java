package com.ecosort.wasteknowledge.entity;

import com.ecosort.common.audit.Auditable;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

/**
 * A single, searchable waste item (e.g. "Plastic Bottle", "Battery")
 * belonging to exactly one {@link WasteCategory}, carrying citizen-
 * facing disposal and recycling guidance.
 */
@Entity
@Table(name = "waste_items")
@Getter
@Setter
@NoArgsConstructor
public class WasteItem extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "scientific_name", length = 150)
    private String scientificName;

    /**
     * Owning side of the relationship (holds the FK column). LAZY is
     * the correct default here: fetching a WasteItem (e.g. in search
     * results) should not force-load its parent category unless the
     * response DTO actually needs category details, in which case the
     * service explicitly fetches it (see WasteItemServiceImpl).
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    private WasteCategory category;

    @Column(name = "disposal_method", nullable = false, columnDefinition = "TEXT")
    private String disposalMethod;

    @Column(name = "recycling_instructions", columnDefinition = "TEXT")
    private String recyclingInstructions;

    @Column(nullable = false)
    private boolean hazardous;

    @Column(name = "image_url", length = 500)
    private String imageUrl;
}