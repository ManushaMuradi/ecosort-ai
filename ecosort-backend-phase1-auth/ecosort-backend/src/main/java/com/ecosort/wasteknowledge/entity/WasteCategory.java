package com.ecosort.wasteknowledge.entity;

import com.ecosort.common.audit.Auditable;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

/**
 * Represents a top-level waste taxonomy category (e.g. "Plastic",
 * "E-Waste", "Biomedical Waste"). Each category defines the disposal
 * bin color and whether items in it are generally recyclable, and owns
 * many {@link WasteItem}s.
 */
@Entity
@Table(name = "waste_categories")
@Getter
@Setter
@NoArgsConstructor
public class WasteCategory extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "bin_color", nullable = false, length = 30)
    private String binColor;

    @Column(nullable = false)
    private boolean recyclable;

    /**
     * Owned side is WasteItem (category_id FK lives there). mappedBy
     * keeps this collection read-only from the JPA relationship's
     * perspective — items are created/removed through WasteItem itself,
     * never by mutating this list directly, which avoids surprising
     * cascade behavior. LAZY because a category listing should never
     * implicitly pull every item into memory.
     */
    @OneToMany(mappedBy = "category", fetch = FetchType.LAZY)
    private List<WasteItem> items = new ArrayList<>();

    public WasteCategory(String name, String description, String binColor, boolean recyclable) {
        this.name = name;
        this.description = description;
        this.binColor = binColor;
        this.recyclable = recyclable;
    }
}