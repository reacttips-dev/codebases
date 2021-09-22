import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type UpdatePersonaJsonRequest from '../contract/UpdatePersonaJsonRequest';
import type PersonaType from '../contract/PersonaType';
import updatePersonaJsonRequest from '../factory/updatePersonaJsonRequest';

export default function updatePersonaOperation(
    req: { request: UpdatePersonaJsonRequest },
    options?: RequestOptions
): Promise<PersonaType> {
    if (req.request !== undefined && !req.request['__type']) {
        req.request = updatePersonaJsonRequest(req.request);
    }

    return makeServiceRequest<PersonaType>('UpdatePersona', req, options);
}
