import fetchFavoritePersonaSearchFolder, {
    EXTENDED_PROPERTY_PERSONA_NODE_ID,
    EXTENDED_PROPERTY_QUERY,
} from './fetchFavoritePersonaSearchFolder';
import type { SearchFolderPersona } from '../schemas/SearchFolderPersona';
import {
    createSearchPersonaRestriction,
    EXCLUDED_FOLDERS,
} from '../helpers/createSearchPersonaRestriction';
import type CreateFolderRequest from 'owa-service/lib/contract/CreateFolderRequest';
import type CreateFolderResponse from 'owa-service/lib/contract/CreateFolderResponse';
import type DistinguishedFolderIdName from 'owa-service/lib/contract/DistinguishedFolderIdName';
import type ExtendedPropertyType from 'owa-service/lib/contract/ExtendedPropertyType';
import type FolderType from 'owa-service/lib/contract/Folder';
import type FolderInfoResponseMessage from 'owa-service/lib/contract/FolderInfoResponseMessage';
import createFolderJsonRequest from 'owa-service/lib/factory/createFolderJsonRequest';
import createFolderRequest from 'owa-service/lib/factory/createFolderRequest';
import distinguishedFolderId from 'owa-service/lib/factory/distinguishedFolderId';
import extendedPropertyType from 'owa-service/lib/factory/extendedPropertyType';
import extendedPropertyUri from 'owa-service/lib/factory/extendedPropertyUri';
import folderIdFactory from 'owa-service/lib/factory/folderId';
import searchFolder from 'owa-service/lib/factory/searchFolder';
import searchParametersType from 'owa-service/lib/factory/searchParametersType';
import createFolderOperation from 'owa-service/lib/operation/createFolderOperation';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import { trace } from 'owa-trace';

export const PROPERTY_TAG_HIDDEN = '0x10f4';
const INCLUDED_FOLDERS: DistinguishedFolderIdName[] = ['msgfolderroot'];

function extendedProperties(personaNodeId: string, query: string): ExtendedPropertyType[] {
    return [
        // Add the original query
        extendedPropertyType({
            ExtendedFieldURI: extendedPropertyUri(EXTENDED_PROPERTY_QUERY),
            Value: query,
        }),
        // Add the personaId
        extendedPropertyType({
            ExtendedFieldURI: extendedPropertyUri(EXTENDED_PROPERTY_PERSONA_NODE_ID),
            Value: personaNodeId,
        }),
        // Set the folder to hidden
        extendedPropertyType({
            ExtendedFieldURI: extendedPropertyUri({
                PropertyTag: PROPERTY_TAG_HIDDEN,
                PropertyType: 'Boolean',
            }),
            Value: 'true',
        }),
    ];
}

function defaultRequest(parentFolderId: string, persona: SearchFolderPersona): CreateFolderRequest {
    return {
        ParentFolderId: {
            BaseFolderId: folderIdFactory({ Id: parentFolderId }),
        },
        Folders: [
            searchFolder({
                DisplayName: persona.displayName + '_' + persona.favoriteNodeId,
                ExtendedProperty: extendedProperties(persona.favoriteNodeId, filtersAndVersion()),
                SearchParameters: searchParametersType({
                    Restriction: createSearchPersonaRestriction(persona.allEmailAddresses),
                    Traversal: 'Deep', // Required since we define the search folder on msgfolderroot
                    BaseFolderIds: INCLUDED_FOLDERS.map(folder =>
                        distinguishedFolderId({ Id: folder })
                    ),
                }),
            }),
        ],
    };
}

function processFoldersResponse(response: CreateFolderResponse): Promise<FolderType> {
    const responseMessage: FolderInfoResponseMessage = response.ResponseMessages.Items[0];
    return new Promise((resolve, reject) => {
        if (responseMessage.ResponseClass == 'Success') {
            resolve(fetchFavoritePersonaSearchFolder(responseMessage.Folders[0].FolderId.Id));
        } else if (
            responseMessage.ResponseClass === 'Error' &&
            responseMessage.ResponseCode === 'ErrorFolderExists'
        ) {
            trace.warn('Folder already exists');
            reject('ErrorFolderExists');
        } else {
            trace.warn('Error creating search folder ' + responseMessage.MessageText);
            reject(responseMessage.MessageText);
        }
    });
}

// The search folder is created for "<DisplayName> " [OR From:emailAddress]+ for the IPM tree (msgfolderroot)
export default function createSearchFolderForPersona(
    parentFolderId: string,
    persona: SearchFolderPersona
): Promise<FolderType> {
    return createFolderOperation(
        createFolderJsonRequest({
            Header: getJsonRequestHeader(),
            Body: createFolderRequest(defaultRequest(parentFolderId, persona)),
        })
    ).then(response => {
        return processFoldersResponse(response.Body);
    });
}

// This function is used to add the included and excluded folders, plus a version
// Will be useful for updating search folders if these value change in the future
export function filtersAndVersion(): string {
    return `${INCLUDED_FOLDERS.join('_')}_${EXCLUDED_FOLDERS.join('_')}_v2`;
}
