import deleteFolderRequest from 'owa-service/lib/factory/deleteFolderRequest';
import folderId from 'owa-service/lib/factory/folderId';
import deleteFolderOperation from 'owa-service/lib/operation/deleteFolderOperation';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';

export default function deleteFolders(
    folderIdsToDelete: string[],
    permanentlyDelete?: boolean
): Promise<void> {
    if (
        folderIdsToDelete.length === 0 ||
        folderIdsToDelete.filter(id => id !== undefined).length === 0
    ) {
        return Promise.resolve();
    }
    return deleteFolderOperation({
        Header: getJsonRequestHeader(),
        Body: deleteFolderRequest({
            DeleteType: permanentlyDelete ? 'SoftDelete' : 'MoveToDeletedItems',
            FolderIds: folderIdsToDelete
                .filter(id => id !== undefined)
                .map(folderIdToDelete => folderId({ Id: folderIdToDelete })),
        }),
    }).then(response => {
        const responseItem = response.Body.ResponseMessages.Items[0];
        if (responseItem.ResponseClass == 'Success') {
            return Promise.resolve();
        } else {
            return Promise.reject('Delete folder failed: ' + responseItem.ResponseClass);
        }
    });
}
