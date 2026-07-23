package com.ecosort.security.entity;

/**
 * The fixed set of role identities in EcoSort.
 * Note: the ROLE names are fixed (adding a new role type is a deliberate
 * product decision requiring a migration), but the PERMISSIONS attached
 * to each role are data-driven and can change without a code deploy —
 * see the Permission entity and role_permissions join table.
 */
public enum RoleName {
    CITIZEN,
    COLLECTOR,
    RECYCLING_CENTER_ADMIN,
    MUNICIPAL_ADMIN,
    SUPER_ADMIN
}
