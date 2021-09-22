import type FindFolderResponseMessage from 'owa-service/lib/contract/FindFolderResponseMessage';
import findFolderOperation from 'owa-service/lib/operation/findFolderOperation';
import findFolderRequest from 'owa-service/lib/factory/findFolderRequest';
import folderId from 'owa-service/lib/factory/folderId';
import folderResponseShape from 'owa-service/lib/factory/folderResponseShape';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import distinguishedFolderId from 'owa-service/lib/factory/distinguishedFolderId';
import propertyUri from 'owa-service/lib/factory/propertyUri';
import getFolderRequest from 'owa-service/lib/factory/getFolderRequest';
import getFolderOperation from 'owa-service/lib/operation/getFolderOperation';
import type FolderInfoResponseMessage from 'owa-service/lib/contract/FolderInfoResponseMessage';
import getPublicFolderMailboxInfoForSmtpAddress from 'owa-public-folder-favorite/lib/services/utils/getPublicFolderMailboxInfoForSmtpAddress';
import { getMailboxRequestOptions } from 'owa-request-options-types';
import type { MailboxInfo } from 'owa-client-ids';

export interface FindPublicFolderResponseMessage {
    findFolderResponseMessage: FindFolderResponseMessage;
    mailboxInfo: MailboxInfo;
}

export default async function findPublicFolders(
    rootFolderId: string
): Promise<FindPublicFolderResponseMessage> {
    const publicFolderMailbox = getUserConfiguration().SessionSettings.DefaultPublicFolderMailbox;
    if (!publicFolderMailbox) {
        return null;
    }

    let folderIdToUse = rootFolderId;
    const mailboxInfo = getPublicFolderMailboxInfoForSmtpAddress(publicFolderMailbox);

    /**
     * We have seen cases when findFolder's ParentFolder id does not match with the ChildFolders parentFolderId when
     * FindFolders is queried using distinguishedFolderId (publicfoldersroot). Hence we issue GetFolder request first
     * to get the actual id of the publicfolderroot and use it in findFolders.
     */
    if (rootFolderId == 'publicfoldersroot') {
        const getFolderResponse = await getFolderOperation(
            {
                Header: getJsonRequestHeader(),
                Body: getFolderRequest({
                    FolderShape: folderResponseShape({
                        BaseShape: 'IdOnly',
                    }),
                    FolderIds: [distinguishedFolderId({ Id: rootFolderId })],
                    ShapeName: 'Folder',
                }),
            },
            getMailboxRequestOptions(mailboxInfo) // requestOptions
        );

        /**
         * If GetFolder response fails we will still try to fetch the folder hierarchy using distinguished folder id
         */
        if (getFolderResponse?.Body.ResponseMessages.Items) {
            const rootFolderData = (getFolderResponse.Body.ResponseMessages
                .Items[0] as FolderInfoResponseMessage).Folders[0];
            folderIdToUse = rootFolderData.FolderId.Id;
        }
    }

    return findFolderOperation(
        {
            Header: getJsonRequestHeader(),
            Body: findFolderRequest({
                FolderShape: folderResponseShape({
                    BaseShape: 'IdOnly',
                    AdditionalProperties: [propertyUri({ FieldURI: 'ReplicaList' })],
                }),
                Paging: null,
                ParentFolderIds: [
                    folderIdToUse == 'publicfoldersroot'
                        ? distinguishedFolderId({ Id: folderIdToUse })
                        : folderId({ Id: folderIdToUse }),
                ],
                ReturnParentFolder: true,
                ShapeName: 'Folder',
                Traversal: 'Shallow',
            }),
        },
        getMailboxRequestOptions(mailboxInfo) // requestOptions
    )
        .then(response => {
            const findFolderResponse = response.Body.ResponseMessages.Items[0];
            return {
                findFolderResponseMessage: findFolderResponse,
                mailboxInfo: mailboxInfo,
            };
        })
        .catch(() => {
            return null;
        });
}
