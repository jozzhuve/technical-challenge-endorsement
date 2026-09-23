import Joi from 'joi';

/**
 * Contrato de validación HTTP para la traducción de endosos.
 * Los campos adicionales se permiten porque una plantilla futura puede consumirlos dinámicamente.
 */
export const endorsementPayloadSchema = Joi.object({
  policyNumber: Joi.string().trim().required(),
  idEnvio: Joi.number().integer().required(),
  frecuencia: Joi.string().trim().required(),
  tipoEndoso: Joi.string().trim().required(),
  producto: Joi.string().trim().required(),
  plan: Joi.string().trim().required(),
  moneda: Joi.string().trim().required(),
  usuario: Joi.string().trim().required(),
  fechaSolicitud: Joi.string().isoDate().required(),
  fechaCliente: Joi.string().isoDate().required(),
  fechaEfectiva: Joi.string().isoDate().required(),
}).unknown(true);
