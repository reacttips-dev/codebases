import addFile from './addFile';
import addItem from './addItem';
import { AttachmentFileAttributes, AttachmentFileType } from 'owa-attachment-file-types';
import type { ComposeViewState } from 'owa-mail-compose-store';
import createAttachments from './createAttachments';
import AttachmentDataProviderType from 'owa-service/lib/contract/AttachmentDataProviderType';
import type { MailboxInfo } from 'owa-client-ids';

export default async function addAttachments(
    viewState: ComposeViewState,
    attachments: AttachmentFileAttributes[]
): Promise<void> {
    if (!attachments) {
        return;
    }
    // if addins need there messages pass isAddins to the attachmentsToUpload
    const shareableFiles = [];
    const attachableFiles = [];
    let mailboxInfo: MailboxInfo;
    for (const attachment of attachments) {
        if (attachment.file.fileType == AttachmentFileType.Uri) {
            await addFile(
                viewState,
                attachment.file.name,
                attachment.file.uri,
                attachment.isInline
            );
        } else if (attachment.file.fileType == AttachmentFileType.MailItem) {
            await addItem(
                viewState,
                attachment.file.name,
                attachment.file.itemId,
                attachment.isInline
            );
        } else if (
            attachment.file.fileType == AttachmentFileType.Cloud ||
            attachment.file.fileType == AttachmentFileType.CloudSuggestion ||
            attachment.file.fileType == AttachmentFileType.ContextualSuggestion
        ) {
            if (attachment.file.providerType === AttachmentDataProviderType.Mailbox) {
                shareableFiles.push(attachment.file);
            } else {
                if (attachment.mailboxInfo) {
                    mailboxInfo = attachment.mailboxInfo;
                }
                attachableFiles.push(attachment.file);
            }
        } else if (
            attachment.file.fileType == AttachmentFileType.AttachmentItem ||
            attachment.file.fileType == AttachmentFileType.AttachmentItemSuggestion
        ) {
            if (attachment.mailboxInfo) {
                mailboxInfo = attachment.mailboxInfo;
            }
            attachableFiles.push(attachment.file);
        }
    }
    shareableFiles.length > 0 &&
        (await createAttachments(
            shareableFiles,
            viewState,
            {
                isInline: false,
                isHiddenInline: false,
                shouldShare: true,
            },
            null
        ));
    attachableFiles.length > 0 &&
        createAttachments(
            attachableFiles,
            viewState,
            {
                isInline: false,
                isHiddenInline: false,
                shouldShare: false,
                mailboxInfo,
            },
            null
        );
}
