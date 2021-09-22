import { defaultUploadLocationFolderName } from 'owa-locstrings/lib/strings/defaultuploadlocationfoldername.locstring.json';
import loc from 'owa-localize';
import type GetAttachmentUploadFolderPropsResponse from 'owa-service/lib/contract/GetAttachmentUploadFolderPropsResponse';
import { assertNever } from 'owa-assert';

import { isNullOrWhiteSpace } from 'owa-string-utils';
import { UploadFolder, UploadFolderMailboxType } from '../store/schema/UploadFolder';

const DEFAULT_GROUP_UPLOAD_FOLDER_NAME = 'Email attachments';

export default function configureResponse(
    mailboxId: string,
    type: UploadFolderMailboxType,
    response: GetAttachmentUploadFolderPropsResponse
): UploadFolder {
    return {
        mailboxId: mailboxId,
        folderId: response.FolderId,
        folderName: isNullOrWhiteSpace(response.FolderName)
            ? getDefaultFolderName(type)
            : response.FolderName,
    };
}

function getDefaultFolderName(type: UploadFolderMailboxType) {
    switch (type) {
        case UploadFolderMailboxType.Group:
            return DEFAULT_GROUP_UPLOAD_FOLDER_NAME;
        case UploadFolderMailboxType.User:
            return loc(defaultUploadLocationFolderName);
        default:
            return assertNever(type);
    }
}
