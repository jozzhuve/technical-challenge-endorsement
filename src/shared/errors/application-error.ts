/**
 * Error base de la aplicación. Mantiene un código funcional estable y un estado HTTP
 * sin acoplar la lógica de negocio al framework web.
 */
export class ApplicationError extends Error {
  /**
   * Construye un error controlado de aplicación.
   *
   * @param code Código funcional del error.
   * @param message Mensaje legible para el consumidor.
   * @param statusCode Estado HTTP que representa el error.
   */
  public constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = new.target.name;
  }
}
