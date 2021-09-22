import { WarningAttachmentsCanNotBeDeleted } from 'owa-locstrings/lib/strings/warningattachmentscannotbedeleted.locstring.json';
import loc, { format } from 'owa-localize';
import { onSmimeModeEnabled } from '../actions/smimeActions';
import type { ComposeViewState } from 'owa-mail-compose-store';
import upConvertHelper from '../utils/onUpconvertHelper';
import isAttachmentPartOfItem from 'owa-attachment-full-data/lib/utils/isAttachmentPartOfItem';
import type { ClientAttachmentId } from 'owa-attachment-model-store';
import { default as deleteAttachmentFromStore } from 'owa-attachment-model-store/lib/actions/deleteAttachment';
import { exportedHelperFunctions as deleteAttachmentHelperFunctions } from 'owa-attachment-well-data/lib/actions/deleteAttachment';
import { getUserMailboxInfo } from 'owa-client-ids';
import itemId from 'owa-service/lib/factory/itemId';
import addInfoBarMessage from 'owa-info-bar/lib/actions/addInfoBarMessage';

import * as trace from 'owa-trace';
import { orchestrator } from 'satcheljs';
import {
    AttachmentState,
    AttachmentType,
    lazyGetAllValidAttachments,
} from 'owa-attachment-well-data';
import {
    lazyCreateSmimeAttachmentsViaSmimeQueueManager,
    lazyInitializeAttachmentStateForSmimeAttachments,
} from 'owa-smime';

/**
 * Updates SmimeViewState with admin/user settings in new compose.
 */
export default orchestrator(onSmimeModeEnabled, async actionMessage => {
    const { composeViewState } = actionMessage;
    const attachments: AttachmentState[] = (await lazyGetAllValidAttachments.import())(
        composeViewState.attachmentWell,
        composeViewState.content,
        composeViewState.bodyType,
        false /*filterSmimeAttachment */
    );
    composeViewState.isInlineCompose && upConvertHelper(composeViewState, window);

    // Don't create queue if attachments are not present
    if (!attachments.length) {
        return;
    }
    try {
        const initializeAttachmentStateForSmimeAttachments = await lazyInitializeAttachmentStateForSmimeAttachments.import();
        initializeAttachmentStateForSmimeAttachments(composeViewState.attachmentWell, attachments);
        const createSmimeAttachmentsViaSmimeQueueManager = await lazyCreateSmimeAttachmentsViaSmimeQueueManager.import();
        /**
         * itemId/composeId is used as a key in a hash-table for SmimeAttachmentDownloadQueueManager.
         * The hash-table is required because we can have multiple instances of queue managers for different compose forms that are open.
         * We need a key to associate the queue manager with the compose form.
         */
        const parentItemId = composeViewState.itemId || itemId({ Id: composeViewState.composeId });
        createSmimeAttachmentsViaSmimeQueueManager(
            composeViewState.attachmentWell,
            { ...parentItemId, mailboxInfo: getUserMailboxInfo() },
            composeViewState,
            attachments,
            (attachment: AttachmentType) =>
                tryDeleteAttachmentsOnDownloadSuccess(attachment, composeViewState)
        );
    } catch (error) {
        trace.errorThatWillCauseAlert('SmimeTraceError: onSmimeModeEnabled failed' + error.message);
    }
});

async function tryDeleteAttachmentsOnDownloadSuccess(
    attachment: AttachmentType,
    viewState: ComposeViewState
): Promise<void> {
    const attachmentToDelete = attachment.AttachmentId as ClientAttachmentId;

    if (!isAttachmentPartOfItem(attachment, viewState.itemId)) {
        /**
         * This occurs for the following conditions:
         * 1. Reply/ReplyAll/Forward a non-S/MIME mail with attachments
         * 2. S/MIME admin/user settings are on
         */
        return;
    }

    // Remove from store
    deleteAttachmentFromStore(attachmentToDelete);

    // Delete from server
    try {
        await deleteAttachmentHelperFunctions.invokeDeleteAttachmentFromDraftMutation(
            attachmentToDelete,
            null // parent item ID needed for Hx resolver only and Monarch does not support SMIME yet
        );
        trace.trace.info('Attachment deleted successfully on toggle of S/MIME mode');
    } catch (error) {
        trace.errorThatWillCauseAlert('SmimeTraceError: ' + error.message);
        addInfoBarMessage(viewState, 'WarningAttachmentCanNotBeDeleted', [
            format(loc(WarningAttachmentsCanNotBeDeleted), attachment.Name),
        ]);
    }
}
