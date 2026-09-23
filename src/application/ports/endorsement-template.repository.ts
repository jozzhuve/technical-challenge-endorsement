import { EndorsementTemplate } from '../../domain/model/endorsement-template';

/**
 * Puerto de salida para obtener la plantilla activa de un producto y tipo de endoso.
 */
export interface EndorsementTemplateRepository {
  /**
   * Busca la versión activa más reciente de la plantilla solicitada.
   *
   * @param product Producto de la póliza.
   * @param endorsementType Tipo de endoso recibido.
   * @returns Plantilla encontrada o null cuando no existe configuración aplicable.
   */
  findActive(product: string, endorsementType: string): Promise<EndorsementTemplate | null>;
}
