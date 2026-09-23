import { ApplicationError } from './application-error';

/**
 * Representa la ausencia de una configuración requerida para procesar la solicitud.
 */
export class NotFoundError extends ApplicationError {
  /**
   * Construye un error de recurso no encontrado.
   *
   * @param code Código funcional del error.
   * @param message Detalle del recurso no encontrado.
   */
  public constructor(code: string, message: string) {
    super(code, message, 404);
  }
}
