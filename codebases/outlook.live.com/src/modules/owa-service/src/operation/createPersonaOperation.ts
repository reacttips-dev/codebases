import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type CreatePersonaJsonRequest from '../contract/CreatePersonaJsonRequest';
import type PersonaType from '../contract/PersonaType';
import createPersonaJsonRequest from '../factory/createPersonaJsonRequest';

export default function createPersonaOperation(
    req: { request: CreatePersonaJsonRequest },
    options?: RequestOptions
): Promise<PersonaType> {
    if (req.request !== undefined && !req.request['__type']) {
        req.request = createPersonaJsonRequest(req.request);
    }

    return makeServiceRequest<PersonaType>('CreatePersona', req, options);
}
