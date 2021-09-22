import { AttachmentDetails, AddinsSupportedAttachmentType } from 'owa-addins-core';
import {
    AttachmentFileType,
    AttachmentFileAttributes,
    MailItemFile,
    UriFile,
} from 'owa-attachment-file-types';
import { getExtensionFromFileName } from 'owa-file';

export default function createAttachmentFiles(
    attachments: AttachmentDetails[]
): AttachmentFileAttributes[] {
    const attachmentFiles: AttachmentFileAttributes[] = [];
    for (const attachment of attachments) {
        let file: MailItemFile | UriFile = null;
        if (attachment.attachmentType == AddinsSupportedAttachmentType.Item) {
            file = {
                fileType: AttachmentFileType.MailItem,
                name: attachment.name,
                size: attachment.size,
                itemId: attachment.id,
            };
        } else if (attachment.attachmentType == AddinsSupportedAttachmentType.File) {
            file = {
                fileType: AttachmentFileType.Uri,
                name: attachment.name,
                size: attachment.size,
                uri: attachment.id,
                type: getExtensionFromFileName(attachment.id),
            };
        }

        if (file) {
            attachmentFiles.push({ file: file, isInline: attachment.isInline });
        }
    }
    return attachmentFiles;
}
