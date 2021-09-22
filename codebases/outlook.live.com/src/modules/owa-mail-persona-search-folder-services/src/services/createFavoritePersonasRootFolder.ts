import type CreateFolderJsonResponse from 'owa-service/lib/contract/CreateFolderJsonResponse';
import type FolderInfoResponseMessage from 'owa-service/lib/contract/FolderInfoResponseMessage';
import createFolderRequest from 'owa-service/lib/factory/createFolderRequest';
import distinguishedFolderId from 'owa-service/lib/factory/distinguishedFolderId';
import folder from 'owa-service/lib/factory/folder';
import targetFolderId from 'owa-service/lib/factory/targetFolderId';
import createFolderOperation from 'owa-service/lib/operation/createFolderOperation';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import * as trace from 'owa-trace';

export default function createFavoritePersonasRootFolder(): Promise<string> {
    return createFolderOperation({
        Header: getJsonRequestHeader(),
        Body: createFolderRequest({
            ParentFolderId: targetFolderId({
                BaseFolderId: distinguishedFolderId({ Id: 'root' }),
            }),
            Folders: [
                folder({
                    DisplayName: 'FavoritePersonas',
                    FolderClass: 'IPF.Note',
                }),
            ],
        }),
    }).then((response: CreateFolderJsonResponse) => {
        const responseMessage = response.Body.ResponseMessages
            .Items[0] as FolderInfoResponseMessage;

        if (
            responseMessage.ResponseClass === 'Error' &&
            responseMessage.ResponseCode === 'ErrorFolderExists'
        ) {
            trace.trace.warn('Folder "FavoritePersonas" already exists');
            throw new Error('ErrorFolderExists');
        } else if (responseMessage.ResponseClass !== 'Success') {
            trace.errorThatWillCauseAlert(
                'Error creating "FavoritePersonas" ' + responseMessage.MessageText
            );
            throw responseMessage.MessageText;
        }

        return responseMessage.Folders[0].FolderId.Id;
    });
}
