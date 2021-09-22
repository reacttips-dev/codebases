import type { ComposeViewState } from 'owa-mail-compose-store';
import getAttachment from 'owa-attachment-model-store/lib/selectors/getAttachment';

/**
 * This util will return the
 * Array of names of cloud attachments if present,
 * Empty array otherwise.
 */
export default function getCloudyAttachmentNames(viewState: ComposeViewState): string[] {
    const cloudAttachments: string[] = [];
    if (
        !viewState.attachmentWell ||
        !viewState.attachmentWell.docViewAttachments ||
        viewState.attachmentWell.docViewAttachments.length == 0
    ) {
        return cloudAttachments;
    }

    for (const attachment of viewState.attachmentWell.docViewAttachments) {
        if (attachment.isCloudy) {
            const attachmentData = getAttachment(attachment.attachmentId);
            attachmentData && cloudAttachments.push(attachmentData.model.Name);
        }
    }

    return cloudAttachments;
}
