import getPersonaRequest from 'owa-service/lib/factory/getPersonaRequest';
import type GetPersonaRequest from 'owa-service/lib/contract/GetPersonaRequest';
import type GetPersonaJsonResponse from 'owa-service/lib/contract/GetPersonaJsonResponse';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import itemId from 'owa-service/lib/factory/itemId';
import type PersonaType from 'owa-service/lib/contract/PersonaType';
import getPersonaOperation from 'owa-service/lib/operation/getPersonaOperation';

export function getOwsPersona(personaId: string): Promise<PersonaType> {
    const request: GetPersonaRequest = getPersonaRequest({
        PersonaId: itemId({ Id: personaId }),
    });

    return getPersonaOperation({
        Header: getJsonRequestHeader(),
        Body: request,
    }).then((response: GetPersonaJsonResponse) => {
        if (response.Body && response.Body.ResponseCode === 'NoError') {
            return response.Body.Persona;
        } else {
            throw new Error('GetPersona failed');
        }
    });
}
