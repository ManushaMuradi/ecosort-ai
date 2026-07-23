package com.ecosort.security.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

/**
 * A named role (CITIZEN, MUNICIPAL_ADMIN, ...) composed of a set of
 * Permissions. Users are assigned Roles; Roles carry Permissions.
 * This indirection (User -> Role -> Permission, instead of User ->
 * Permission directly) mirrors how real organizations grant access:
 * you assign someone a job title, and the title's authority can be
 * redefined centrally without touching every individual user.
 */
@Entity
@Table(name = "roles")
@Getter
@Setter
@NoArgsConstructor
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true, length = 50)
    private RoleName name;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "role_permissions",
            joinColumns = @JoinColumn(name = "role_id"),
            inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    private Set<Permission> permissions = new HashSet<>();

    public Role(RoleName name) {
        this.name = name;
    }
}
