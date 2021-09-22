import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetPersonaJsonRequest from '../contract/GetPersonaJsonRequest';
import type GetPersonaJsonResponse from '../contract/GetPersonaJsonResponse';
import getPersonaJsonRequest from '../factory/getPersonaJsonRequest';

export default function getPersonaOperation(
    req: GetPersonaJsonRequest,
    options?: RequestOptions
): Promise<GetPersonaJsonResponse> {
    if (req !== undefined && !req['__type']) {
        req = getPersonaJsonRequest(req);
    }

    return makeServiceRequest<GetPersonaJsonResponse>('GetPersona', req, options);
}
