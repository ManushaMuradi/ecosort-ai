package com.ecosort.wasterequest.entity;

import java.util.EnumSet;
import java.util.Map;
import java.util.Set;

/**
 * The pickup request lifecycle. Legal transitions are encoded directly
 * on the enum (a lightweight State pattern) rather than scattered as
 * if/else checks through the service — WasteRequestServiceImpl asks
 * "is this transition legal?" once, in one place, instead of every
 * method re-deriving the rule. Mirrors the DB-level CHECK constraints
 * in V3__waste_request_workflow.sql (defense in depth: illegal
 * transitions are rejected here with a clear 409 message before they'd
 * ever reach the database's own constraints).
 */
public enum WasteRequestStatus {
    REQUESTED,
    SCHEDULED,
    COLLECTED,
    VERIFIED,
    CANCELLED;

    private static final Map<WasteRequestStatus, Set<WasteRequestStatus>> ALLOWED_TRANSITIONS = Map.of(
            REQUESTED, EnumSet.of(SCHEDULED, CANCELLED),
            SCHEDULED, EnumSet.of(COLLECTED),
            COLLECTED, EnumSet.of(VERIFIED),
            VERIFIED, EnumSet.noneOf(WasteRequestStatus.class),
            CANCELLED, EnumSet.noneOf(WasteRequestStatus.class)
    );

    public boolean canTransitionTo(WasteRequestStatus target) {
        return ALLOWED_TRANSITIONS.getOrDefault(this, Set.of()).contains(target);
    }

    public boolean isTerminal() {
        return this == VERIFIED || this == CANCELLED;
    }
}
