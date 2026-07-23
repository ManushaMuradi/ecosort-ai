-- V2: Waste Knowledge Base schema
-- Owned by the wasteknowledge module. Additive to V1 — no existing
-- table is altered. Seeds the category taxonomy and an initial set of
-- waste items so the module is immediately demoable after migration.

CREATE TABLE waste_categories (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    bin_color   VARCHAR(30) NOT NULL,
    recyclable  BOOLEAN NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE waste_items (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name                    VARCHAR(150) NOT NULL,
    scientific_name         VARCHAR(150),
    category_id             UUID NOT NULL REFERENCES waste_categories(id) ON DELETE RESTRICT,
    disposal_method         TEXT NOT NULL,
    recycling_instructions  TEXT,
    hazardous               BOOLEAN NOT NULL DEFAULT FALSE,
    image_url               VARCHAR(500),
    created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_waste_item_name_category UNIQUE (name, category_id)
);

-- ON DELETE RESTRICT (not CASCADE): deleting a category that still has
-- items attached must fail loudly at the DB level, not silently orphan
-- or wipe out item data. The service layer enforces this too (defense
-- in depth), but the constraint is the ultimate source of truth.

-- Foreign keys are not auto-indexed in Postgres — explicit index required.
CREATE INDEX idx_waste_items_category_id ON waste_items(category_id);

-- Supports GET /waste-items/search?keyword= via ILIKE, and general
-- case-insensitive lookups without a full table scan.
CREATE INDEX idx_waste_items_name ON waste_items(LOWER(name));
CREATE INDEX idx_waste_categories_name ON waste_categories(LOWER(name));

-- ─────────────────────────────────────────────────────────────
-- Seed: category taxonomy
-- ─────────────────────────────────────────────────────────────
INSERT INTO waste_categories (name, description, bin_color, recyclable) VALUES
    ('Wet Waste',        'Biodegradable kitchen and food waste, compostable organic matter.', 'GREEN',  FALSE),
    ('Dry Waste',        'Non-biodegradable household waste that is not otherwise categorized.', 'BLUE', FALSE),
    ('Plastic',          'Plastic packaging, containers, and other plastic-based materials.', 'BLUE', TRUE),
    ('Paper',            'Paper, newsprint, and cardboard products.', 'BLUE', TRUE),
    ('Glass',            'Glass bottles, jars, and other glass materials.', 'BLUE', TRUE),
    ('Metal',            'Metal cans, foil, and scrap metal items.', 'BLUE', TRUE),
    ('E-Waste',          'Electronic and electrical equipment, devices, and accessories.', 'YELLOW', TRUE),
    ('Hazardous Waste',  'Chemically hazardous or flammable household waste requiring special handling.', 'RED', FALSE),
    ('Biomedical Waste', 'Medical, pharmaceutical, and biologically hazardous waste.', 'RED', FALSE);

-- ─────────────────────────────────────────────────────────────
-- Seed: waste items (20+, mapped to the categories above)
-- ─────────────────────────────────────────────────────────────
INSERT INTO waste_items (name, scientific_name, category_id, disposal_method, recycling_instructions, hazardous, image_url)
SELECT 'Plastic Bottle', NULL, id,
       'Rinse and place in the dry/recyclable waste bin.',
       'Remove cap and label if possible, flatten to save space, and place in the plastic recycling stream.',
       FALSE, NULL
FROM waste_categories WHERE name = 'Plastic';

INSERT INTO waste_items (name, scientific_name, category_id, disposal_method, recycling_instructions, hazardous, image_url)
SELECT 'Milk Packet', NULL, id,
       'Rinse thoroughly to remove residue, then place in the dry waste bin.',
       'Accepted by most municipal plastic recycling programs after rinsing; check local guidelines for multi-layer packaging.',
       FALSE, NULL
FROM waste_categories WHERE name = 'Plastic';

INSERT INTO waste_items (name, scientific_name, category_id, disposal_method, recycling_instructions, hazardous, image_url)
SELECT 'Battery', NULL, id,
       'Never place in regular waste bins. Take to a designated e-waste or battery collection point.',
       'Batteries contain heavy metals; must go through certified e-waste recyclers only.',
       TRUE, NULL
FROM waste_categories WHERE name = 'E-Waste';

INSERT INTO waste_items (name, scientific_name, category_id, disposal_method, recycling_instructions, hazardous, image_url)
SELECT 'Mobile Phone', NULL, id,
       'Take to an authorized e-waste collection center; do not discard in household bins.',
       'Contains recoverable metals and rare earth elements; use certified e-waste recyclers or manufacturer take-back programs.',
       TRUE, NULL
FROM waste_categories WHERE name = 'E-Waste';

INSERT INTO waste_items (name, scientific_name, category_id, disposal_method, recycling_instructions, hazardous, image_url)
SELECT 'Laptop', NULL, id,
       'Take to an authorized e-waste collection center; do not discard in household bins.',
       'Data should be wiped before disposal; components are recoverable via certified e-waste recyclers.',
       TRUE, NULL
FROM waste_categories WHERE name = 'E-Waste';

INSERT INTO waste_items (name, scientific_name, category_id, disposal_method, recycling_instructions, hazardous, image_url)
SELECT 'Newspaper', NULL, id,
       'Keep dry and place in the paper recycling bin.',
       'Bundle flat newspapers together; avoid mixing with wet or food-soiled paper.',
       FALSE, NULL
FROM waste_categories WHERE name = 'Paper';

INSERT INTO waste_items (name, scientific_name, category_id, disposal_method, recycling_instructions, hazardous, image_url)
SELECT 'Cardboard Box', NULL, id,
       'Flatten and place in the paper/dry waste bin.',
       'Remove tape and labels where possible; flatten to reduce volume before recycling.',
       FALSE, NULL
FROM waste_categories WHERE name = 'Paper';

INSERT INTO waste_items (name, scientific_name, category_id, disposal_method, recycling_instructions, hazardous, image_url)
SELECT 'Banana Peel', NULL, id,
       'Place in the wet waste/compost bin.',
       'Fully compostable; ideal for home composting or municipal organic waste collection.',
       FALSE, NULL
FROM waste_categories WHERE name = 'Wet Waste';

INSERT INTO waste_items (name, scientific_name, category_id, disposal_method, recycling_instructions, hazardous, image_url)
SELECT 'Glass Bottle', NULL, id,
       'Rinse and place in the glass recycling bin.',
       'Remove caps and lids (recycle separately); avoid mixing colored and clear glass where local rules require separation.',
       FALSE, NULL
FROM waste_categories WHERE name = 'Glass';

INSERT INTO waste_items (name, scientific_name, category_id, disposal_method, recycling_instructions, hazardous, image_url)
SELECT 'Steel Can', NULL, id,
       'Rinse and place in the metal recycling bin.',
       'Remove paper labels where possible; flatten to save space if collection allows.',
       FALSE, NULL
FROM waste_categories WHERE name = 'Metal';

INSERT INTO waste_items (name, scientific_name, category_id, disposal_method, recycling_instructions, hazardous, image_url)
SELECT 'Medicine Strip', NULL, id,
       'Return to a pharmacy take-back program or a biomedical waste collection point; do not flush or place in household bins.',
       'Blister packaging combines plastic and foil and is not household-recyclable; requires pharmaceutical waste handling.',
       TRUE, NULL
FROM waste_categories WHERE name = 'Biomedical Waste';

INSERT INTO waste_items (name, scientific_name, category_id, disposal_method, recycling_instructions, hazardous, image_url)
SELECT 'LED Bulb', NULL, id,
       'Take to an e-waste collection point; do not place in regular glass or household waste.',
       'Contains electronic components distinct from regular glass bulbs; must go through e-waste recycling.',
       TRUE, NULL
FROM waste_categories WHERE name = 'E-Waste';

INSERT INTO waste_items (name, scientific_name, category_id, disposal_method, recycling_instructions, hazardous, image_url)
SELECT 'Paint Can', NULL, id,
       'Take to a hazardous waste collection point; never pour leftover paint down a drain.',
       'Empty, fully dried cans may sometimes be accepted as scrap metal; check local hazardous waste guidelines for wet paint.',
       TRUE, NULL
FROM waste_categories WHERE name = 'Hazardous Waste';

INSERT INTO waste_items (name, scientific_name, category_id, disposal_method, recycling_instructions, hazardous, image_url)
SELECT 'Food Waste', NULL, id,
       'Place in the wet waste/compost bin.',
       'Suitable for composting; avoid mixing with non-organic waste to keep the compost stream clean.',
       FALSE, NULL
FROM waste_categories WHERE name = 'Wet Waste';

INSERT INTO waste_items (name, scientific_name, category_id, disposal_method, recycling_instructions, hazardous, image_url)
SELECT 'Coffee Cup', NULL, id,
       'Place in the dry waste bin unless locally certified as compostable.',
       'Most disposable coffee cups have a plastic lining that prevents standard paper recycling; check for compostable-certified cups.',
       FALSE, NULL
FROM waste_categories WHERE name = 'Dry Waste';

INSERT INTO waste_items (name, scientific_name, category_id, disposal_method, recycling_instructions, hazardous, image_url)
SELECT 'Aluminium Foil', NULL, id,
       'Clean off food residue and place in the metal recycling bin.',
       'Must be reasonably clean of food residue to be accepted by most metal recycling streams; ball up small pieces together.',
       FALSE, NULL
FROM waste_categories WHERE name = 'Metal';

INSERT INTO waste_items (name, scientific_name, category_id, disposal_method, recycling_instructions, hazardous, image_url)
SELECT 'Wire', NULL, id,
       'Take to an e-waste or scrap metal collection point.',
       'Copper and other wire cores are valuable recyclables; separate from other plastic/dry waste where possible.',
       FALSE, NULL
FROM waste_categories WHERE name = 'E-Waste';

INSERT INTO waste_items (name, scientific_name, category_id, disposal_method, recycling_instructions, hazardous, image_url)
SELECT 'Printer Cartridge', NULL, id,
       'Return to manufacturer take-back programs or an e-waste collection point.',
       'Many manufacturers and retailers offer free cartridge refill/recycling programs; avoid regular waste bins.',
       TRUE, NULL
FROM waste_categories WHERE name = 'E-Waste';

INSERT INTO waste_items (name, scientific_name, category_id, disposal_method, recycling_instructions, hazardous, image_url)
SELECT 'Broken Charger', NULL, id,
       'Take to an e-waste collection point; do not discard with household waste.',
       'Contains circuitry and cabling recoverable through certified e-waste recyclers.',
       TRUE, NULL
FROM waste_categories WHERE name = 'E-Waste';

INSERT INTO waste_items (name, scientific_name, category_id, disposal_method, recycling_instructions, hazardous, image_url)
SELECT 'Wood Pieces', NULL, id,
       'Place in the dry waste bin, or a bulk/green waste collection if available locally.',
       'Untreated wood can often be chipped or composted; painted/treated wood should follow dry waste disposal rules.',
       FALSE, NULL
FROM waste_categories WHERE name = 'Dry Waste';