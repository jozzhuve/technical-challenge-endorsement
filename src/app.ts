import Hapi, { Server } from '@hapi/hapi';
import { DataSource } from 'typeorm';
import { Environment } from './config/environment';
import { EndorsementTranslatorService } from './application/services/endorsement-translator.service';
import { TypeOrmEndorsementTemplateRepository } from './infrastructure/persistence/typeorm/typeorm-endorsement-template.repository';
import { EndorsementController } from './infrastructure/http/endorsement.controller';
import { registerEndorsementRoutes } from './infrastructure/http/endorsement.routes';
import { registerErrorHandler } from './shared/http/error-handler';

/**
 * Construye la aplicación Hapi y conecta sus adaptadores con los casos de uso.
 *
 * @param environment Configuración validada de ejecución.
 * @param dataSource Datasource PostgreSQL previamente inicializado.
 * @returns Servidor Hapi listo para iniciar.
 */
export function createApp(environment: Environment, dataSource: DataSource): Server {
  const server = Hapi.server({
    port: environment.port,
    host: environment.host,
    routes: {
      cors: true,
    },
  });

  const repository = new TypeOrmEndorsementTemplateRepository(dataSource);
  const service = new EndorsementTranslatorService(repository);
  const controller = new EndorsementController(service);

  registerEndorsementRoutes(server, controller);
  registerErrorHandler(server);

  server.route({
    method: 'GET',
    path: '/health',
    handler: () => ({ status: 'UP' }),
  });

  return server;
}
