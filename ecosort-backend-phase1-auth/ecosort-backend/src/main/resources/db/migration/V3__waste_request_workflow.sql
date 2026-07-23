-- V3: Waste Request (Pickup) Workflow schema
-- Owned by the wasterequest module. Additive to V1/V2 — no existing
-- table is altered. Naming ("waste_requests") matches the permissions
-- already seeded in V1 (WASTE_REQUEST_*), which anticipated this
-- exact feature.
--
-- Revised from the original single-category design: a citizen may
-- submit ONE pickup request containing MULTIPLE waste items across
-- DIFFERENT categories (e.g. a plastic bottle + a battery + a
-- newspaper in the same pickup). WasteRequest is now a header row;
-- WasteRequestItem is its line-item child, each referencing the
-- existing waste_items catalog (from the wasteknowledge module).

-- ─────────────────────────────────────────────────────────────
-- addresses — reusable, not embedded on waste_requests, since the
-- Recycling Centers feature (Phase 3 roadmap) will reuse this table.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE addresses (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    line1       VARCHAR(255) NOT NULL,
    line2       VARCHAR(255),
    city        VARCHAR(100) NOT NULL,
    state       VARCHAR(100),
    postal_code VARCHAR(20) NOT NULL,
    latitude    DOUBLE PRECISION,
    longitude   DOUBLE PRECISION,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- CASCADE here (unlike waste_requests below) is deliberate: an address
-- book entry has no meaning independent of its owning user, unlike a
-- waste request, which is a historical record worth preserving.
CREATE INDEX idx_addresses_user_id ON addresses(user_id);

-- ─────────────────────────────────────────────────────────────
-- waste_requests — the pickup-request HEADER. No category or weight
-- column here anymore; those live on waste_request_items instead.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE waste_requests (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    citizen_id           UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    address_id           UUID NOT NULL REFERENCES addresses(id) ON DELETE RESTRICT,
    collector_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    contact_phone        VARCHAR(20),
    preferred_pickup_date DATE,
    pickup_notes         TEXT,
    status               VARCHAR(20) NOT NULL DEFAULT 'REQUESTED',
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_waste_request_status
        CHECK (status IN ('REQUESTED', 'SCHEDULED', 'COLLECTED', 'VERIFIED', 'CANCELLED')),

    -- The database itself refuses an illegal state: no request may sit
    -- at SCHEDULED/COLLECTED/VERIFIED without an assigned collector.
    CONSTRAINT chk_waste_request_collector_required
        CHECK (status IN ('REQUESTED', 'CANCELLED') OR collector_id IS NOT NULL)
);

CREATE INDEX idx_waste_requests_citizen_id ON waste_requests(citizen_id);
CREATE INDEX idx_waste_requests_collector_id ON waste_requests(collector_id);
CREATE INDEX idx_waste_requests_status ON waste_requests(status);
CREATE INDEX idx_waste_requests_collector_status ON waste_requests(collector_id, status);

-- ─────────────────────────────────────────────────────────────
-- waste_request_items — line items. Each references the EXISTING
-- waste_items catalog table (wasteknowledge module) so a request can
-- span multiple categories via multiple distinct catalog items.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE waste_request_items (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    waste_request_id     UUID NOT NULL REFERENCES waste_requests(id) ON DELETE CASCADE,
    waste_item_id        UUID NOT NULL REFERENCES waste_items(id) ON DELETE RESTRICT,
    quantity             INTEGER NOT NULL,
    estimated_weight_kg  NUMERIC(6,2),
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_waste_request_item_quantity CHECK (quantity > 0),

    -- Prevents the same catalog item appearing twice as separate rows
    -- in one request — the service layer rejects duplicates at
    -- creation time (clear 409), and this is the DB-level backstop.
    CONSTRAINT uq_waste_request_item UNIQUE (waste_request_id, waste_item_id)
);
-- CASCADE is correct here: a line item has no meaning without its
-- parent request. waste_item_id stays RESTRICT — a catalog item
-- referenced by historical request line items can't be deleted out
-- from under that history (same rule already applied to waste_items
-- -> waste_categories in V2).
CREATE INDEX idx_waste_request_items_request_id ON waste_request_items(waste_request_id);
CREATE INDEX idx_waste_request_items_waste_item_id ON waste_request_items(waste_item_id);

-- ─────────────────────────────────────────────────────────────
-- request_status_history — append-only audit trail of every status
-- transition, and the data source for the citizen-facing timeline UI.
-- ─────────────────────────────────────────────────────────────
CREATE TABLE request_status_history (
    id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    waste_request_id   UUID NOT NULL REFERENCES waste_requests(id) ON DELETE CASCADE,
    from_status        VARCHAR(20),
    to_status          VARCHAR(20) NOT NULL,
    changed_by         UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    remarks            TEXT,
    changed_at         TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_request_status_history_to_status
        CHECK (to_status IN ('REQUESTED', 'SCHEDULED', 'COLLECTED', 'VERIFIED', 'CANCELLED'))
);
CREATE INDEX idx_request_status_history_request_id ON request_status_history(waste_request_id);

-- ─────────────────────────────────────────────────────────────
-- New permission: assigning a collector is distinct from the
-- WASTE_REQUEST_* permissions already seeded in V1.
-- ─────────────────────────────────────────────────────────────
INSERT INTO permissions (name, description) VALUES
    ('WASTE_REQUEST_ASSIGN', 'Assign a collector to a waste pickup request');

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name IN ('MUNICIPAL_ADMIN', 'SUPER_ADMIN') AND p.name = 'WASTE_REQUEST_ASSIGN';
