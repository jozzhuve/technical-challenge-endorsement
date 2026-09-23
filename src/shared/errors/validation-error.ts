import { ApplicationError } from './application-error';

/**
 * Representa un incumplimiento de reglas de validación del caso de uso.
 */
export class ValidationError extends ApplicationError {
  /**
   * Construye un error de validación funcional.
   *
   * @param code Código funcional del error.
   * @param message Detalle de la validación incumplida.
   */
  public constructor(code: string, message: string) {
    super(code, message, 400);
  }
}
