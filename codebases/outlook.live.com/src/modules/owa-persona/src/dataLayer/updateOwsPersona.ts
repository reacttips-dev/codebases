import updatePersonaOperation from 'owa-service/lib/operation/updatePersonaOperation';
import updatePersonaRequest from 'owa-service/lib/factory/updatePersonaRequest';
import type UpdatePersonaRequest from 'owa-service/lib/contract/UpdatePersonaRequest';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import itemId from 'owa-service/lib/factory/itemId';
import personaPropertyUpdate from 'owa-service/lib/factory/personaPropertyUpdate';
import propertyUri from 'owa-service/lib/factory/propertyUri';
import type PersonaType from 'owa-service/lib/contract/PersonaType';

export interface UpdateProperty {
    name: string;
    oldValue: string;
    newValue: string;
}

/**
 * This function returns the update request expected by OWS.
 * For each property that was changed we need to specify both the new value and the old value.
 * We ignore properties that have not changed.
 * @param personaId Id of persona
 * @param properties Properties to update
 */
function buildRequest(personaId: string, properties: UpdateProperty[]): UpdatePersonaRequest {
    const request = updatePersonaRequest({
        PersonaId: itemId({ Id: personaId }),
        PersonTypeString: 'Person',
        PropertyUpdates: [],
    });

    if (properties && properties.length > 0) {
        properties.forEach((property: UpdateProperty) => {
            if (property.newValue !== property.oldValue) {
                request.PropertyUpdates.push(
                    personaPropertyUpdate({
                        Path: propertyUri({ FieldURI: property.name }),
                        OldValue: property.oldValue,
                        NewValue: property.newValue,
                    })
                );
            }
        });
    }

    return request;
}

export function updateOwsPersona(
    personaId: string,
    properties: UpdateProperty[]
): Promise<PersonaType> {
    return updatePersonaOperation({
        request: {
            Header: getJsonRequestHeader(),
            Body: buildRequest(personaId, properties),
        },
    });
}
