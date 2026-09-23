import { EndorsementTemplateRepository } from '../ports/endorsement-template.repository';
import { EndorsementInput } from '../../domain/model/endorsement-input';
import { EndorsementTemplate, TemplateField } from '../../domain/model/endorsement-template';
import { TranslatedEndorsement } from '../../domain/model/translated-endorsement';
import { NotFoundError } from '../../shared/errors/not-found-error';
import { ValidationError } from '../../shared/errors/validation-error';

/**
 * Ejecuta la traducción de un endoso plano al contrato requerido por el core.
 * La estructura dinámica se resuelve desde configuración persistida y no mediante
 * condiciones específicas por producto o tipo de endoso.
 */
export class EndorsementTranslatorService {
  /**
   * Crea el servicio con el puerto de acceso a plantillas.
   *
   * @param templateRepository Repositorio encargado de obtener la configuración activa.
   */
  public constructor(private readonly templateRepository: EndorsementTemplateRepository) {}

  /**
   * Traduce un endoso utilizando la plantilla configurada para producto y tipo.
   *
   * @param input Datos planos recibidos desde el cliente.
   * @returns Contrato estructurado listo para ser consumido por el core.
   * @throws NotFoundError cuando no existe una plantilla activa.
   * @throws ValidationError cuando falta un valor requerido por la plantilla.
   */
  public async translate(input: EndorsementInput): Promise<TranslatedEndorsement> {
    const template = await this.templateRepository.findActive(input.producto, input.tipoEndoso);

    if (!template) {
      throw new NotFoundError(
        'TEMPLATE_NOT_FOUND',
        `No existe una plantilla activa para producto '${input.producto}' y tipo de endoso '${input.tipoEndoso}'.`,
      );
    }

    return this.buildOutput(input, template);
  }

  /**
   * Construye el contrato final preservando el orden configurado para datos dinámicos y eventos.
   *
   * @param input Datos de entrada del endoso.
   * @param template Plantilla activa obtenida desde persistencia.
   * @returns Contrato traducido para el core.
   */
  private buildOutput(
    input: EndorsementInput,
    template: EndorsementTemplate,
  ): TranslatedEndorsement {
    const dynamicData = [...template.fields]
      .sort((left, right) => left.order - right.order)
      .map((field) => ({ etiqueta: field.label, value: this.resolveValue(field, input) }));

    const eventAppliedEntities = [...template.appliedEvents].sort(
      (left, right) => left.orderEvent - right.orderEvent,
    );

    return {
      policyNumber: input.policyNumber,
      idEnvio: input.idEnvio,
      financialPlansEntity: { description: input.frecuencia },
      currency: { description: input.moneda },
      productEntity: { description: input.producto },
      eventEntity: {
        description: template.eventDescription,
        dynamicData,
      },
      eventAppliedEntities,
      riskUnitEntities: [
        {
          insuranceObjectEntities: [
            {
              insuranceObjectNumber: template.insuranceObjectNumber,
              coverageEntities: [],
              participationEntities: [],
            },
          ],
          plansEntity: { description: input.plan },
          riskUnitNumber: template.riskUnitNumber,
          participationEntities: [],
        },
      ],
    };
  }

  /**
   * Resuelve el valor de un campo usando primero el dato recibido y luego el valor por defecto.
   *
   * @param field Configuración del campo dinámico.
   * @param input Datos de entrada disponibles.
   * @returns Valor normalizado como texto.
   * @throws ValidationError cuando el campo es obligatorio y no puede resolverse.
   */
  private resolveValue(field: TemplateField, input: EndorsementInput): string {
    const rawValue = field.sourceField ? input[field.sourceField] : undefined;
    const hasInputValue = rawValue !== undefined && rawValue !== null && rawValue !== '';

    if (hasInputValue) {
      return String(rawValue);
    }

    if (field.defaultValue !== null) {
      return field.defaultValue;
    }

    if (field.required) {
      throw new ValidationError(
        'REQUIRED_TEMPLATE_FIELD_MISSING',
        `No se recibió el campo requerido '${field.sourceField ?? field.label}'.`,
      );
    }

    return '';
  }
}
