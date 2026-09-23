import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Environment } from '../../../config/environment';
import { EndorsementTemplateEntity } from './entities/endorsement-template.entity';
import { EndorsementTemplateFieldEntity } from './entities/endorsement-template-field.entity';
import { EndorsementTemplateEventEntity } from './entities/endorsement-template-event.entity';

/**
 * Construye el datasource PostgreSQL utilizado por los adaptadores de persistencia.
 *
 * @param environment Configuración validada de la aplicación.
 * @returns Datasource configurado sin sincronización automática del esquema.
 */
export function createDataSource(environment: Environment): DataSource {
  return new DataSource({
    type: 'postgres',
    host: environment.database.host,
    port: environment.database.port,
    database: environment.database.name,
    username: environment.database.user,
    password: environment.database.password,
    entities: [
      EndorsementTemplateEntity,
      EndorsementTemplateFieldEntity,
      EndorsementTemplateEventEntity,
    ],
    synchronize: false,
    logging: false,
  });
}
