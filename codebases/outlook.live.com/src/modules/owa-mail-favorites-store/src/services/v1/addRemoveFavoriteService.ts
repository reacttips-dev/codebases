import type { MailFolder } from 'owa-graph-schema';
import type UpdateFavoriteFolderResponse from 'owa-service/lib/contract/UpdateFavoriteFolderResponse';
import UpdateFavoriteOperationType from 'owa-service/lib/contract/UpdateFavoriteOperationType';
import folder from 'owa-service/lib/factory/folder';
import folderId from 'owa-service/lib/factory/folderId';
import updateFavoriteFolderRequest from 'owa-service/lib/factory/updateFavoriteFolderRequest';
import updateFavoriteFolderOperation from 'owa-service/lib/operation/updateFavoriteFolderOperation';

/**
 * Configure the request body for updateFavoriteFolderOperation
 * @param currentFolder the current folder to be updated
 * @param isAdd whether the operation is an add or remove operation
 */
function configureRequest(currentFolder: MailFolder, isAdd: boolean) {
    const targetFolderId = folderId({
        Id: currentFolder.FolderId.Id,
        ChangeKey: currentFolder.FolderId.ChangeKey,
    });

    const request = updateFavoriteFolderRequest({
        Folder: folder({
            FolderId: targetFolderId,
            DisplayName: currentFolder.DisplayName,
        }),
        Operation: isAdd ? UpdateFavoriteOperationType.Add : UpdateFavoriteOperationType.Remove,
    });

    return request;
}

/**
 * Sends out the service request to add or remove the a favorite in favorite store
 * @param currentFolder the current folder to be updated
 * @param isAdd whether the operation is an add or remove operation
 * @return a promise that contains UpdateFavoriteFolderResponse
 */
export default function addRemoveFavoriteService(
    currentFolder: MailFolder,
    isAdd: boolean
): Promise<UpdateFavoriteFolderResponse> {
    const requestBody = configureRequest(currentFolder, isAdd);

    // TODO: Task 314: Make this not throw an HTTP 500 error on the server
    return updateFavoriteFolderOperation({
        request: requestBody,
    }).then(response => {
        return response;
    });
}
