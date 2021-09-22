import {
    lazyDeleteAttachmentsViaQueueManager,
    onAttachmentDeleted,
} from 'owa-attachment-well-data';
import type { ClientAttachmentId, ClientItemId } from 'owa-client-ids';
import type { ComposeViewState } from 'owa-mail-compose-store';
import { getCurrentTableMailboxInfo } from 'owa-mail-mailboxinfo';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';

export default function removeInlineAttachmentsFromWell(viewState: ComposeViewState) {
    let inlineAttachments = viewState?.attachmentWell?.inlineAttachments;

    if (inlineAttachments.length > 0) {
        lazyDeleteAttachmentsViaQueueManager.import().then(deleteAttachmentViaQueueManager => {
            const parentItemId: ClientItemId = {
                ...viewState.itemId,
                mailboxInfo: getCurrentTableMailboxInfo(),
            };

            const onAttachmentDeletedCallback = (
                parentItemId: ClientItemId,
                attachmentId: ClientAttachmentId,
                attachment: AttachmentType
            ) => {
                onAttachmentDeleted(parentItemId, attachmentId, attachment);
            };

            inlineAttachments.forEach(attachmentState => {
                deleteAttachmentViaQueueManager(
                    viewState.attachmentWell,
                    attachmentState,
                    parentItemId,
                    viewState,
                    onAttachmentDeletedCallback
                );
            });
        });
    }
}
