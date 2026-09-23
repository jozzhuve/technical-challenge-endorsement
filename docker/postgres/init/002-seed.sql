DO $$
DECLARE
    template_uuid UUID;
BEGIN
    INSERT INTO endorsement_templates (
        product, endorsement_type, version, active, event_description,
        risk_unit_number, insurance_object_number
    )
    VALUES ('Rumbo', 'CambioFrecuencia', 1, TRUE, 'SolicitarEndoso', '1', '1')
    ON CONFLICT (product, endorsement_type, version)
    DO UPDATE SET active = EXCLUDED.active
    RETURNING id INTO template_uuid;

    IF template_uuid IS NULL THEN
        SELECT id INTO template_uuid
        FROM endorsement_templates
        WHERE product = 'Rumbo' AND endorsement_type = 'CambioFrecuencia' AND version = 1;
    END IF;

    INSERT INTO endorsement_template_fields
        (template_id, label, source_field, default_value, required, field_order)
    VALUES
        (template_uuid, 'ProductosVida', 'producto', NULL, TRUE, 1),
        (template_uuid, 'NombreUsuario', 'usuario', NULL, TRUE, 2),
        (template_uuid, 'NumeroPolizaEndoso', 'policyNumber', NULL, TRUE, 3),
        (template_uuid, 'TipoEndosoPol', NULL, 'Endoso Simple', TRUE, 4),
        (template_uuid, 'ResponsableAtencion', NULL, 'SAC', TRUE, 5),
        (template_uuid, 'EndosoModifPrima', NULL, 'Si', TRUE, 6),
        (template_uuid, 'InicioVigenciaEndoso', NULL, 'Default', TRUE, 7),
        (template_uuid, 'TipoVigenciaEndoso', NULL, '', FALSE, 8),
        (template_uuid, 'EndososSimplesSACRumbo', NULL, 'TES008', TRUE, 9),
        (template_uuid, 'FechaSolicitud', 'fechaSolicitud', NULL, TRUE, 10),
        (template_uuid, 'FechaCliente', 'fechaCliente', NULL, TRUE, 11),
        (template_uuid, 'FechaEfectiva', 'fechaEfectiva', NULL, TRUE, 12)
    ON CONFLICT (template_id, field_order) DO NOTHING;

    INSERT INTO endorsement_template_events (template_id, description, order_event)
    VALUES
        (template_uuid, 'SolicitarEndoso', 1),
        (template_uuid, 'AprobarEndoso', 2)
    ON CONFLICT (template_id, order_event) DO NOTHING;
END $$;
