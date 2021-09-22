import type { ClientAttachmentId, ClientItemId } from 'owa-client-ids';
import type AttachmentType from 'owa-service/lib/contract/AttachmentType';
import { action } from 'satcheljs';

// IMPORTANT: Do not add any other code here. This is only to define the action. Any orchestrator should be in a different place.

/**
 * Action called whenever an attachment is deleted
 * @param parentItemId The id of the parent item from which attachment is deleted
 * @param attachmentId The id of the deleted attachment
 * @param attachment The attachment that was deleted
 * @param shouldTriggerAddInAttachmentsChangedCallback If we should trigger attachment event changed or not
 */
export default action(
    'ON_ATTACHMENT_DELETED',
    (
        parentItemId: ClientItemId,
        attachmentId: ClientAttachmentId,
        attachment: AttachmentType,
        shouldTriggerAddInAttachmentsChangedCallback: boolean = true
    ) => {
        return {
            parentItemId,
            attachmentId,
            attachment,
            shouldTriggerAddInAttachmentsChangedCallback,
        };
    }
);
