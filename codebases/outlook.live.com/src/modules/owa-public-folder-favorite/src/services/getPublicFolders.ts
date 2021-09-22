import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import getFolderOperation from 'owa-service/lib/operation/getFolderOperation';
import type FolderInfoResponseMessage from 'owa-service/lib/contract/FolderInfoResponseMessage';
import folderId from 'owa-service/lib/factory/folderId';
import getFolderRequest from 'owa-service/lib/factory/getFolderRequest';
import folderResponseShape from 'owa-service/lib/factory/folderResponseShape';
import type BaseFolderId from 'owa-service/lib/contract/BaseFolderId';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import type ArrayOfResponseMessages from 'owa-service/lib/contract/ArrayOfResponseMessages';
import propertyUri from 'owa-service/lib/factory/propertyUri';
import getPublicFolderMailboxInfoForSmtpAddress from './utils/getPublicFolderMailboxInfoForSmtpAddress';
import { getMailboxRequestOptions } from 'owa-request-options-types';

export default function getPublicFolders(
    targetFolderId: string[]
): Promise<ArrayOfResponseMessages<FolderInfoResponseMessage>> {
    let folderIds: BaseFolderId[] = [];
    targetFolderId.forEach(element => {
        folderIds.push(folderId({ Id: element }));
    });

    const publicFolderMailbox = getUserConfiguration().SessionSettings.DefaultPublicFolderMailbox;
    if (folderIds.length === 0 || !publicFolderMailbox) {
        return null;
    }

    const mailboxInfo = getPublicFolderMailboxInfoForSmtpAddress(publicFolderMailbox);

    return getFolderOperation(
        {
            Header: getJsonRequestHeader(),
            Body: getFolderRequest({
                FolderShape: folderResponseShape({
                    BaseShape: 'AllProperties',
                    AdditionalProperties: [propertyUri({ FieldURI: 'ReplicaList' })],
                }),
                FolderIds: folderIds,
            }),
        },
        getMailboxRequestOptions(mailboxInfo) //requestOptions
    )
        .then(response => {
            return response.Body.ResponseMessages;
        })
        .catch(() => {
            return null;
        });
}
