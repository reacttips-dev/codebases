import type { ComposeViewState } from 'owa-mail-compose-store';
import type { ClientAttachmentId } from 'owa-client-ids';

export default function getAllAttachmentIds(
    composeViewState: ComposeViewState
): ClientAttachmentId[] {
    const attachmentIds: ClientAttachmentId[] = [];
    const attachmentWell = composeViewState.attachmentWell;
    if (attachmentWell) {
        attachmentWell.docViewAttachments.forEach(attachment => {
            attachmentIds.push(attachment.attachmentId);
        });
        attachmentWell.inlineAttachments.forEach(attachment => {
            attachmentIds.push(attachment.attachmentId);
        });
        attachmentWell.imageViewAttachments.forEach(attachment => {
            attachmentIds.push(attachment.attachmentId);
        });
    }
    return attachmentIds;
}
