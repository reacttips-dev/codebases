import getNotesForPersonaOperation from 'owa-service/lib/operation/getNotesForPersonaOperation';
import getNotesForPersonaRequest from 'owa-service/lib/factory/getNotesForPersonaRequest';
import type GetPersonaNotesResponse from 'owa-service/lib/contract/GetPersonaNotesResponse';
import type PersonaType from 'owa-service/lib/contract/PersonaType';

export function getNotesForPersona(personaId: string): Promise<PersonaType> {
    return getNotesForPersonaOperation({
        getNotesForPersonaRequest: getNotesForPersonaRequest({
            PersonaId: personaId,
            MaxBytesToFetch: 512000, // Same as JsMMVM people hub
        }),
    }).then((response: GetPersonaNotesResponse) => response.PersonaWithNotes);
}
