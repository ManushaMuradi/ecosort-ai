package com.ecosort.security.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

/**
 * A single fine-grained authority, e.g. "WASTE_REQUEST_APPROVE" or
 * "USER_MANAGE". Roles are composed of many permissions. Spring
 * Security's @PreAuthorize checks these directly (hasAuthority(...)),
 * NOT the role name — so authorization logic never has to change even
 * if we later reorganize which role includes which permission.
 */
@Entity
@Table(name = "permissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Permission {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    private String description;
}
