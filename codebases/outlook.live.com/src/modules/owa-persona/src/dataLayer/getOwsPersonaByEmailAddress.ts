import getPersonaRequest from 'owa-service/lib/factory/getPersonaRequest';
import type GetPersonaRequest from 'owa-service/lib/contract/GetPersonaRequest';
import type GetPersonaJsonResponse from 'owa-service/lib/contract/GetPersonaJsonResponse';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import type PersonaType from 'owa-service/lib/contract/PersonaType';
import getPersonaOperation from 'owa-service/lib/operation/getPersonaOperation';

export function getOwsPersonaByEmailAddress(
    emailAddress: string | undefined
): Promise<PersonaType> {
    if (!emailAddress) {
        return Promise.reject(new Error('GetPersonaByEmailAddress failed'));
    }
    const request: GetPersonaRequest = getPersonaRequest({
        EmailAddress: { EmailAddress: emailAddress },
    });

    return getPersonaOperation({
        Header: getJsonRequestHeader(),
        Body: request,
    }).then((response: GetPersonaJsonResponse) => {
        if (response.Body && response.Body.ResponseCode === 'NoError') {
            return response.Body.Persona;
        } else {
            throw new Error('GetPersonaByEmailAddress failed');
        }
    });
}
