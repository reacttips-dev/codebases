import createPersonaOperation from 'owa-service/lib/operation/createPersonaOperation';
import createPersonaRequest from 'owa-service/lib/factory/createPersonaRequest';
import type CreatePersonaRequest from 'owa-service/lib/contract/CreatePersonaRequest';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import personaPropertyUpdate from 'owa-service/lib/factory/personaPropertyUpdate';
import propertyUri from 'owa-service/lib/factory/propertyUri';
import type PersonaType from 'owa-service/lib/contract/PersonaType';
import targetFolderId from 'owa-service/lib/factory/targetFolderId';
import distinguishedFolderId from 'owa-service/lib/factory/distinguishedFolderId';
import type DistinguishedFolderIdName from 'owa-service/lib/contract/DistinguishedFolderIdName';

export interface Property {
    name: string;
    newValue: string;
    oldValue: string;
}

function buildRequest(properties: Property[]): CreatePersonaRequest {
    const targetFolderID = targetFolderId({
        BaseFolderId: distinguishedFolderId({ Id: 'contacts' as DistinguishedFolderIdName }),
    });

    const request = createPersonaRequest({
        PersonaId: null,
        PersonTypeString: 'Person',
        PropertyUpdates: [],
        ParentFolderId: targetFolderID,
    });

    if (properties && properties.length > 0) {
        properties.forEach((property: Property) => {
            request.PropertyUpdates.push(
                personaPropertyUpdate({
                    Path: propertyUri({ FieldURI: property.name }),
                    OldValue: property.oldValue,
                    NewValue: property.newValue,
                })
            );
        });
    }

    return request;
}

export function createOwsPersona(properties: Property[]): Promise<PersonaType> {
    return createPersonaOperation({
        request: {
            Header: getJsonRequestHeader(),
            Body: buildRequest(properties),
        },
    });
}
