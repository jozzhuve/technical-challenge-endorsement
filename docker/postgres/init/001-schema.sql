CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS endorsement_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product VARCHAR(100) NOT NULL,
    endorsement_type VARCHAR(100) NOT NULL,
    version INTEGER NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    event_description VARCHAR(150) NOT NULL,
    risk_unit_number VARCHAR(20) NOT NULL DEFAULT '1',
    insurance_object_number VARCHAR(20) NOT NULL DEFAULT '1',
    CONSTRAINT uk_endorsement_template_version UNIQUE (product, endorsement_type, version)
);

CREATE UNIQUE INDEX IF NOT EXISTS uk_endorsement_template_active
    ON endorsement_templates (product, endorsement_type)
    WHERE active = TRUE;

CREATE TABLE IF NOT EXISTS endorsement_template_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES endorsement_templates(id) ON DELETE CASCADE,
    label VARCHAR(150) NOT NULL,
    source_field VARCHAR(150),
    default_value TEXT,
    required BOOLEAN NOT NULL DEFAULT FALSE,
    field_order INTEGER NOT NULL,
    CONSTRAINT uk_endorsement_template_field_order UNIQUE (template_id, field_order),
    CONSTRAINT uk_endorsement_template_field_label UNIQUE (template_id, label)
);

CREATE TABLE IF NOT EXISTS endorsement_template_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID NOT NULL REFERENCES endorsement_templates(id) ON DELETE CASCADE,
    description VARCHAR(150) NOT NULL,
    order_event INTEGER NOT NULL,
    CONSTRAINT uk_endorsement_template_event_order UNIQUE (template_id, order_event)
);
