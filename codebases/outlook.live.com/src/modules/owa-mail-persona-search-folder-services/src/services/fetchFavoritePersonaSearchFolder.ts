import type ExtendedPropertyUri from 'owa-service/lib/contract/ExtendedPropertyUri';
import type FolderType from 'owa-service/lib/contract/Folder';
import type FolderInfoResponseMessage from 'owa-service/lib/contract/FolderInfoResponseMessage';
import type FolderResponseShape from 'owa-service/lib/contract/FolderResponseShape';
import extendedPropertyUri from 'owa-service/lib/factory/extendedPropertyUri';
import folderId from 'owa-service/lib/factory/folderId';
import folderResponseShape from 'owa-service/lib/factory/folderResponseShape';
import getFolderRequest from 'owa-service/lib/factory/getFolderRequest';
import propertyUri from 'owa-service/lib/factory/propertyUri';
import getFolderOperation from 'owa-service/lib/operation/getFolderOperation';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';

export const PERSONA_NODE_ID_PROPERTY = 'PersonaId';

// This property is created as described at https://msdn.microsoft.com/en-us/library/office/dd633654(v=exchg.80).aspx
// The guid is generted randomly. The value contains a string representation of the query used for the search folder
export const EXTENDED_PROPERTY_QUERY: ExtendedPropertyUri = {
    PropertySetId: '{544b025e-cb61-4562-b021-16f4dcb2a7ac}',
    PropertyName: 'Query',
    PropertyType: 'String',
};

export const EXTENDED_PROPERTY_PERSONA_NODE_ID: ExtendedPropertyUri = {
    PropertySetId: '{1ffa50b8-9483-48df-ab40-de558669a5dc}',
    PropertyName: PERSONA_NODE_ID_PROPERTY,
    PropertyType: 'String',
};

export function searchFolderShape(): FolderResponseShape {
    return folderResponseShape({
        BaseShape: 'IdOnly',
        AdditionalProperties: [
            propertyUri({ FieldURI: 'UnreadCount' }),
            propertyUri({ FieldURI: 'TotalCount' }),
            propertyUri({ FieldURI: 'FolderDisplayName' }),
            propertyUri({ FieldURI: 'ParentFolderId' }),
            extendedPropertyUri(EXTENDED_PROPERTY_QUERY),
            extendedPropertyUri(EXTENDED_PROPERTY_PERSONA_NODE_ID),
        ],
    });
}

export default function fetchFavoritePersonaSearchFolder(
    targetFolderId: string
): Promise<FolderType> {
    return getFolderOperation({
        Header: getJsonRequestHeader(),
        Body: getFolderRequest({
            FolderShape: searchFolderShape(),
            FolderIds: [folderId({ Id: targetFolderId })],
        }),
    }).then(response => {
        return (response.Body.ResponseMessages.Items[0] as FolderInfoResponseMessage)
            .Folders[0] as FolderType;
    });
}

export function fetchMultipleFavoritePersonaSearchFolders(
    targetFolderIds: string[]
): Promise<FolderType[]> {
    return getFolderOperation({
        Header: getJsonRequestHeader(),
        Body: getFolderRequest({
            FolderShape: searchFolderShape(),
            FolderIds: targetFolderIds.map(targetFolderId => folderId({ Id: targetFolderId })),
        }),
    }).then(response => {
        const responseItems = response.Body.ResponseMessages.Items as FolderInfoResponseMessage[];
        const successfulResponses = responseItems.filter(item => item.ResponseClass === 'Success');

        return successfulResponses.map(response => response.Folders[0]) as FolderType[];
    });
}
