import 'reflect-metadata';
import pino from 'pino';
import { createApp } from './app';
import { loadEnvironment } from './config/environment';
import { createDataSource } from './infrastructure/persistence/typeorm/data-source';

/**
 * Inicializa dependencias, conexión a base de datos y servidor HTTP.
 */
async function start(): Promise<void> {
  const environment = loadEnvironment();
  const logger = pino({ level: environment.logLevel });
  const dataSource = createDataSource(environment);

  await dataSource.initialize();
  const server = createApp(environment, dataSource);
  await server.start();

  logger.info({ port: environment.port, environment: environment.nodeEnv }, 'Servicio iniciado');

  const shutdown = async (): Promise<void> => {
    logger.info('Cerrando servicio');
    await server.stop({ timeout: 5000 });
    await dataSource.destroy();
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

start().catch((error: unknown) => {
  const logger = pino();
  logger.fatal({ error }, 'No fue posible iniciar el servicio');
  process.exit(1);
});
