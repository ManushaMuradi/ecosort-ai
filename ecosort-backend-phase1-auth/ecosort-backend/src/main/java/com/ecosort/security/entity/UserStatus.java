package com.ecosort.security.entity;

/**
 * Lifecycle status of a user account. ACTIVE users can log in;
 * SUSPENDED accounts are blocked at the authentication layer without
 * deleting any data (an admin action, reversible, and audit-friendly).
 */
public enum UserStatus {
    ACTIVE,
    SUSPENDED
}
