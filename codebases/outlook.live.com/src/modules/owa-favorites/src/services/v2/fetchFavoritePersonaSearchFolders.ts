import type FolderType from 'owa-service/lib/contract/Folder';
import type FolderInfoResponseMessage from 'owa-service/lib/contract/FolderInfoResponseMessage';
import type FolderResponseShape from 'owa-service/lib/contract/FolderResponseShape';
import folderId from 'owa-service/lib/factory/folderId';
import folderResponseShape from 'owa-service/lib/factory/folderResponseShape';
import getFolderRequest from 'owa-service/lib/factory/getFolderRequest';
import propertyUri from 'owa-service/lib/factory/propertyUri';
import getFolderOperation from 'owa-service/lib/operation/getFolderOperation';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';

export function searchFolderShape(): FolderResponseShape {
    return folderResponseShape({
        BaseShape: 'IdOnly',
        AdditionalProperties: [
            propertyUri({ FieldURI: 'UnreadCount' }),
            propertyUri({ FieldURI: 'TotalCount' }),
            propertyUri({ FieldURI: 'FolderDisplayName' }),
            propertyUri({ FieldURI: 'ParentFolderId' }),
        ],
    });
}

export default function fetchFavoritePersonaSearchFolders(
    targetFolderIds: string[]
): Promise<FolderType> {
    return getFolderOperation({
        Header: getJsonRequestHeader(),
        Body: getFolderRequest({
            FolderShape: searchFolderShape(),
            FolderIds: targetFolderIds.map(targetFolderId => folderId({ Id: targetFolderId })),
        }),
    }).then(response => {
        const responseItem = response.Body.ResponseMessages.Items[0] as FolderInfoResponseMessage;
        return responseItem.ResponseClass === 'Success' ? responseItem.Folders[0] : null;
    });
}
