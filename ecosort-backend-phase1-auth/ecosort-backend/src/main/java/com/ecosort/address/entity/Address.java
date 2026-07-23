package com.ecosort.address.entity;

import com.ecosort.common.audit.Auditable;
import com.ecosort.security.entity.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

/**
 * A citizen's saved address. Deliberately its own top-level module (not
 * nested under wasterequest) — it's a reusable entity, not something
 * that belongs to the request workflow; the Recycling Centers feature
 * (Phase 3 roadmap) will reference this same table.
 */
@Entity
@Table(name = "addresses")
@Getter
@Setter
@NoArgsConstructor
public class Address extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 255)
    private String line1;

    @Column(length = 255)
    private String line2;

    @Column(nullable = false, length = 100)
    private String city;

    @Column(length = 100)
    private String state;

    @Column(name = "postal_code", nullable = false, length = 20)
    private String postalCode;

    private Double latitude;

    private Double longitude;
}
