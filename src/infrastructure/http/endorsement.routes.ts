import { Server, ServerRoute } from '@hapi/hapi';
import { EndorsementController } from './endorsement.controller';
import { endorsementPayloadSchema } from './endorsement.schema';

/**
 * Registra las rutas de traducción de endosos. Se conserva la ruta pedida por el reto y se
 * expone adicionalmente una ruta versionada para demostrar evolución compatible del API.
 *
 * @param server Servidor Hapi sobre el que se registran las rutas.
 * @param controller Controlador encargado de atender las solicitudes.
 */
export function registerEndorsementRoutes(
  server: Server,
  controller: EndorsementController,
): void {
  const buildRoute = (path: string): ServerRoute => ({
    method: 'POST',
    path,
    options: {
      validate: {
        payload: endorsementPayloadSchema,
        failAction: (_request, _h, error) => {
          throw error;
        },
      },
      tags: ['api', 'endorsement'],
    },
    handler: controller.translate.bind(controller),
  });

  server.route([
    buildRoute('/endorse/translate'),
    buildRoute('/api/v1/endorsements/translate'),
  ]);
}
