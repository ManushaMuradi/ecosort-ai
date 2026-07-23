-- V1: Authentication & RBAC schema
-- Owned by the Auth module. Every future migration is additive/versioned —
-- never edit this file once it has run against any shared environment.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";  -- provides gen_random_uuid()

CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(150) NOT NULL,
    phone           VARCHAR(20),
    status          VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE roles (
    id      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name    VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE permissions (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

CREATE TABLE role_permissions (
    role_id       UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

CREATE TABLE refresh_tokens (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token       VARCHAR(512) NOT NULL UNIQUE,
    expiry_date TIMESTAMPTZ NOT NULL,
    revoked     BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Explicit indexes: foreign keys are NOT auto-indexed in Postgres
-- (unlike some other RDBMSs), so these are deliberate, not optional.
CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
CREATE INDEX idx_users_email ON users(email);

-- Seed the fixed role set.
INSERT INTO roles (name) VALUES
    ('CITIZEN'),
    ('COLLECTOR'),
    ('RECYCLING_CENTER_ADMIN'),
    ('MUNICIPAL_ADMIN'),
    ('SUPER_ADMIN');

-- Seed an initial permission set (Waste Collection module will add more
-- in its own migration when that module is built).
INSERT INTO permissions (name, description) VALUES
    ('WASTE_REQUEST_CREATE',  'Create a waste pickup request'),
    ('WASTE_REQUEST_VIEW_OWN','View own waste pickup requests'),
    ('WASTE_REQUEST_VIEW_ALL','View all waste pickup requests'),
    ('WASTE_REQUEST_UPDATE_STATUS', 'Update the status of an assigned request'),
    ('RECYCLING_CENTER_MANAGE', 'Create/update recycling center details'),
    ('USER_MANAGE', 'Manage user accounts and role assignments'),
    ('ANALYTICS_VIEW_REGIONAL', 'View regional analytics dashboards'),
    ('ANALYTICS_VIEW_GLOBAL', 'View platform-wide analytics dashboards');

-- Wire permissions to roles.
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'CITIZEN' AND p.name IN ('WASTE_REQUEST_CREATE', 'WASTE_REQUEST_VIEW_OWN');

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'COLLECTOR' AND p.name IN ('WASTE_REQUEST_VIEW_ALL', 'WASTE_REQUEST_UPDATE_STATUS');

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'RECYCLING_CENTER_ADMIN' AND p.name IN ('RECYCLING_CENTER_MANAGE');

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'MUNICIPAL_ADMIN' AND p.name IN
    ('WASTE_REQUEST_VIEW_ALL', 'RECYCLING_CENTER_MANAGE', 'ANALYTICS_VIEW_REGIONAL', 'USER_MANAGE');

INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'SUPER_ADMIN'; -- gets every permission
