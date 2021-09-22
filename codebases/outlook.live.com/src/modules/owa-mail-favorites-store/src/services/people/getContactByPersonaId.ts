import type PersonaType from 'owa-service/lib/contract/PersonaType';
import type GetPersonaJsonResponse from 'owa-service/lib/contract/GetPersonaJsonResponse';
import getPersonaJsonRequest from 'owa-service/lib/factory/getPersonaJsonRequest';
import getPersonaOperation from 'owa-service/lib/operation/getPersonaOperation';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import targetFolderId from 'owa-service/lib/factory/targetFolderId';
import distinguishedFolderId from 'owa-service/lib/factory/distinguishedFolderId';

/**
 * Performs a GetPersona call in the myContacts folder, retrieving the provided personaId
 * It returns "null" if the request fails with ErrorItemNotFound
 */
export default async function getContactByPersonaId(
    personaId: string
): Promise<PersonaType | null> {
    return getPersonaOperation(
        getPersonaJsonRequest({
            Header: getJsonRequestHeader(),
            Body: {
                PersonaId: {
                    Id: personaId,
                },
                ParentFolderId: targetFolderId({
                    BaseFolderId: distinguishedFolderId({
                        Id: 'mycontacts',
                    }),
                }),
            },
        })
    ).then((response: GetPersonaJsonResponse) => {
        // ErrorItemNotFound is "expected": we want to return a "null" Persona and let callers handle it
        if (
            response.Body.ResponseClass === 'Success' ||
            response.Body.ResponseCode === 'ErrorItemNotFound'
        ) {
            return response.Body.Persona;
        }

        throw new Error(
            `GetPersona failed (${response.Body.ResponseCode} ${response.Body.MessageText})`
        );
    });
}
