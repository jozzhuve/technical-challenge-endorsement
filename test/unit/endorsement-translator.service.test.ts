import { describe, expect, it } from 'vitest';
import { EndorsementTemplateRepository } from '../../src/application/ports/endorsement-template.repository';
import { EndorsementTranslatorService } from '../../src/application/services/endorsement-translator.service';
import { EndorsementInput } from '../../src/domain/model/endorsement-input';
import { EndorsementTemplate } from '../../src/domain/model/endorsement-template';

/** Repositorio en memoria utilizado únicamente para aislar las pruebas del caso de uso. */
class InMemoryTemplateRepository implements EndorsementTemplateRepository {
  public constructor(private readonly template: EndorsementTemplate | null) {}

  /** Devuelve la plantilla configurada por la prueba. */
  public async findActive(): Promise<EndorsementTemplate | null> {
    return this.template;
  }
}

const input: EndorsementInput = {
  policyNumber: '08200000049',
  idEnvio: 5984,
  frecuencia: 'Semestral',
  tipoEndoso: 'CambioFrecuencia',
  producto: 'Rumbo',
  plan: 'PlanRumbo',
  moneda: 'Nuevo Sol',
  usuario: 'interface.servicios',
  fechaSolicitud: '2025-08-27',
  fechaCliente: '2025-08-27',
  fechaEfectiva: '2025-09-01',
};

const template: EndorsementTemplate = {
  id: 'template-1',
  product: 'Rumbo',
  endorsementType: 'CambioFrecuencia',
  version: 1,
  eventDescription: 'SolicitarEndoso',
  riskUnitNumber: '1',
  insuranceObjectNumber: '1',
  fields: [
    { label: 'NombreUsuario', sourceField: 'usuario', defaultValue: null, required: true, order: 2 },
    { label: 'ProductosVida', sourceField: 'producto', defaultValue: null, required: true, order: 1 },
    { label: 'ResponsableAtencion', sourceField: null, defaultValue: 'SAC', required: true, order: 3 },
  ],
  appliedEvents: [
    { description: 'AprobarEndoso', orderEvent: 2 },
    { description: 'SolicitarEndoso', orderEvent: 1 },
  ],
};

describe('EndorsementTranslatorService', () => {
  it('traduce y respeta el orden definido en la plantilla', async () => {
    const service = new EndorsementTranslatorService(new InMemoryTemplateRepository(template));

    const result = await service.translate(input);

    expect(result.eventEntity.dynamicData).toEqual([
      { etiqueta: 'ProductosVida', value: 'Rumbo' },
      { etiqueta: 'NombreUsuario', value: 'interface.servicios' },
      { etiqueta: 'ResponsableAtencion', value: 'SAC' },
    ]);
    expect(result.eventAppliedEntities).toEqual([
      { description: 'SolicitarEndoso', orderEvent: 1 },
      { description: 'AprobarEndoso', orderEvent: 2 },
    ]);
  });

  it('retorna error controlado cuando no existe una plantilla activa', async () => {
    const service = new EndorsementTranslatorService(new InMemoryTemplateRepository(null));

    await expect(service.translate(input)).rejects.toMatchObject({
      code: 'TEMPLATE_NOT_FOUND',
      statusCode: 404,
    });
  });
});
