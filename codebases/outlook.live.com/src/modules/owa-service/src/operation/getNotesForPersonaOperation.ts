import { makeServiceRequest } from '../ServiceRequest';
import type RequestOptions from '../RequestOptions';
import type GetNotesForPersonaRequest from '../contract/GetNotesForPersonaRequest';
import type GetPersonaNotesResponse from '../contract/GetPersonaNotesResponse';
import getNotesForPersonaRequest from '../factory/getNotesForPersonaRequest';

export default function getNotesForPersonaOperation(
    req: { getNotesForPersonaRequest: GetNotesForPersonaRequest },
    options?: RequestOptions
): Promise<GetPersonaNotesResponse> {
    if (req.getNotesForPersonaRequest !== undefined && !req.getNotesForPersonaRequest['__type']) {
        req.getNotesForPersonaRequest = getNotesForPersonaRequest(req.getNotesForPersonaRequest);
    }

    return makeServiceRequest<GetPersonaNotesResponse>('GetNotesForPersona', req, options);
}
