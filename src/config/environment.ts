import Joi from 'joi';

export interface Environment {
  nodeEnv: string;
  port: number;
  host: string;
  logLevel: string;
  database: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
  };
}

const schema = Joi.object({
  NODE_ENV: Joi.string().default('development'),
  PORT: Joi.number().port().default(8080),
  HOST: Joi.string().default('0.0.0.0'),
  LOG_LEVEL: Joi.string().valid('fatal', 'error', 'warn', 'info', 'debug', 'trace').default('info'),
  DATABASE_HOST: Joi.string().default('localhost'),
  DATABASE_PORT: Joi.number().port().default(5432),
  DATABASE_NAME: Joi.string().default('endorsement'),
  DATABASE_USER: Joi.string().default('endorsement'),
  DATABASE_PASSWORD: Joi.string().default('endorsement')
}).unknown(true);

/**
 * Carga y valida las variables de entorno requeridas por el servicio.
 *
 * @returns Configuración tipada y validada para iniciar la aplicación.
 * @throws Error cuando una variable de entorno no cumple el contrato esperado.
 */
export function loadEnvironment(): Environment {
  const { value, error } = schema.validate(process.env, { abortEarly: false });

  if (error) {
    throw new Error(`Configuración inválida: ${error.message}`);
  }

  return {
    nodeEnv: value.NODE_ENV as string,
    port: value.PORT as number,
    host: value.HOST as string,
    logLevel: value.LOG_LEVEL as string,
    database: {
      host: value.DATABASE_HOST as string,
      port: value.DATABASE_PORT as number,
      name: value.DATABASE_NAME as string,
      user: value.DATABASE_USER as string,
      password: value.DATABASE_PASSWORD as string
    }
  };
}
