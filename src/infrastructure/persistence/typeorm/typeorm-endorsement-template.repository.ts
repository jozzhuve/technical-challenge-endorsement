import { DataSource } from 'typeorm';
import { EndorsementTemplateRepository } from '../../../application/ports/endorsement-template.repository';
import { EndorsementTemplate } from '../../../domain/model/endorsement-template';
import { EndorsementTemplateEntity } from './entities/endorsement-template.entity';

/**
 * Adaptador TypeORM que recupera las plantillas activas desde PostgreSQL.
 */
export class TypeOrmEndorsementTemplateRepository implements EndorsementTemplateRepository {
  /**
   * Crea el repositorio con el datasource inicializado de la aplicación.
   *
   * @param dataSource Conexión TypeORM hacia PostgreSQL.
   */
  public constructor(private readonly dataSource: DataSource) {}

  /**
   * Busca la versión activa más reciente para el producto y tipo de endoso solicitados.
   *
   * @param product Producto recibido.
   * @param endorsementType Tipo de endoso recibido.
   * @returns Plantilla de dominio o null si no existe configuración activa.
   */
  public async findActive(
    product: string,
    endorsementType: string,
  ): Promise<EndorsementTemplate | null> {
    const repository = this.dataSource.getRepository(EndorsementTemplateEntity);
    const entity = await repository.findOne({
      where: { product, endorsementType, active: true },
      relations: { fields: true, appliedEvents: true },
      order: { version: 'DESC' },
    });

    if (!entity) {
      return null;
    }

    return {
      id: entity.id,
      product: entity.product,
      endorsementType: entity.endorsementType,
      version: entity.version,
      eventDescription: entity.eventDescription,
      riskUnitNumber: entity.riskUnitNumber,
      insuranceObjectNumber: entity.insuranceObjectNumber,
      fields: entity.fields.map((field) => ({
        label: field.label,
        sourceField: field.sourceField,
        defaultValue: field.defaultValue,
        required: field.required,
        order: field.order,
      })),
      appliedEvents: entity.appliedEvents.map((event) => ({
        description: event.description,
        orderEvent: event.orderEvent,
      })),
    };
  }
}
