import { Request, ResponseToolkit, ResponseObject } from '@hapi/hapi';
import { EndorsementTranslatorService } from '../../application/services/endorsement-translator.service';
import { EndorsementInput } from '../../domain/model/endorsement-input';

/**
 * Controlador HTTP encargado de adaptar la solicitud web al caso de uso de traducción.
 */
export class EndorsementController {
  /**
   * Crea el controlador con el servicio de aplicación requerido.
   *
   * @param translatorService Caso de uso que realiza la traducción.
   */
  public constructor(private readonly translatorService: EndorsementTranslatorService) {}

  /**
   * Atiende la solicitud de traducción y devuelve el contrato generado para el core.
   *
   * @param request Solicitud Hapi validada por la ruta.
   * @param h Toolkit de respuesta Hapi.
   * @returns Respuesta HTTP con el endoso traducido.
   */
  public async translate(request: Request, h: ResponseToolkit): Promise<ResponseObject> {
    const result = await this.translatorService.translate(request.payload as EndorsementInput);
    return h.response(result).code(200);
  }
}
