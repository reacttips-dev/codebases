import type FindFolderRequest from 'owa-service/lib/contract/FindFolderRequest';
import type FindFolderResponseMessage from 'owa-service/lib/contract/FindFolderResponseMessage';
import findFolderRequest from 'owa-service/lib/factory/findFolderRequest';
import folderId from 'owa-service/lib/factory/folderId';
import folderResponseShape from 'owa-service/lib/factory/folderResponseShape';
import propertyUri from 'owa-service/lib/factory/propertyUri';
import findFolderOperation from 'owa-service/lib/operation/findFolderOperation';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';

function configureRequestBody(): FindFolderRequest {
    return findFolderRequest({
        FolderShape: folderResponseShape({
            BaseShape: 'IdOnly',
            AdditionalProperties: [
                propertyUri({ FieldURI: 'TotalCount' }),
                propertyUri({ FieldURI: 'UnreadCount' }),
            ],
        }),
        Paging: null,
        ParentFolderIds: [folderId({ Id: folderNameToId('msgfolderroot') })],
        ReturnParentFolder: true,
        ShapeName: null,
        Traversal: 'Deep',
    });
}

// Find folders request to get total and unread counts for all folders
export default function findFoldersCountsOnly(): Promise<FindFolderResponseMessage> {
    const requestBody = configureRequestBody();
    return findFolderOperation({
        Header: getJsonRequestHeader(),
        Body: requestBody,
    }).then(response => {
        return response?.Body?.ResponseMessages?.Items?.[0] as FindFolderResponseMessage;
    });
}
