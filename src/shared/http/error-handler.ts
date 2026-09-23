import { Request, ResponseToolkit, ResponseObject, Server } from '@hapi/hapi';
import { ApplicationError } from '../errors/application-error';

interface HapiErrorLike extends Error {
  isJoi?: boolean;
  output?: {
    statusCode?: number;
  };
}

/**
 * Registra el manejo homogéneo de errores de aplicación y validación HTTP.
 *
 * @param server Servidor Hapi donde se aplicará el interceptor de respuesta.
 */
export function registerErrorHandler(server: Server): void {
  server.ext('onPreResponse', (request: Request, h: ResponseToolkit): ResponseObject | symbol => {
    const response = request.response;

    if (!(response instanceof Error)) {
      return h.continue;
    }

    if (response instanceof ApplicationError) {
      return h
        .response({
          code: response.code,
          message: response.message,
          traceId: request.info.id,
        })
        .code(response.statusCode);
    }

    const hapiError = response as HapiErrorLike;
    if (hapiError.isJoi) {
      return h
        .response({
          code: 'INVALID_REQUEST',
          message: hapiError.message,
          traceId: request.info.id,
        })
        .code(400);
    }

    const statusCode = hapiError.output?.statusCode ?? 500;
    return h
      .response({
        code: statusCode >= 500 ? 'INTERNAL_ERROR' : 'REQUEST_ERROR',
        message: statusCode >= 500 ? 'Ocurrió un error inesperado.' : hapiError.message,
        traceId: request.info.id,
      })
      .code(statusCode);
  });
}
