import changeTotalClassicAttachmentSize from '../actions/changeTotalClassicAttachmentSize';
import type AttachmentWellViewState from '../schema/AttachmentWellViewState';
import deleteAttachment from 'owa-attachment-model-store/lib/actions/deleteAttachment';
import getAttachment from 'owa-attachment-model-store/lib/selectors/getAttachment';
import { action } from 'satcheljs/lib/legacy';
import {
    AttachmentFullViewState,
    AttachmentState,
    AttachmentStateType,
} from 'owa-attachment-full-data';

/**
 * ====== PLEASE READ ======
 * This action needs to be idempotent so that calling it multiple times for
 * the same attachment should not fail.
 */
export default action('removeAttachmentFromWell')(function removeAttachmentFromWell(
    attachmentWell: AttachmentWellViewState,
    attachment: AttachmentState,
    shouldUpdateSize: boolean = true,
    shouldDeleleAttachmentModel: boolean = true
) {
    const attachmentModel = getAttachment(attachment.attachmentId);
    if (!attachmentModel) {
        /**
         * Remove from the attachment well only if the attachment model is present. If it
         * does not exist then it could mean that the attachment might have already been
         * removed and hence we skip removing it again.
         * Example: This can happen in case of downselling which depends upon notification
         * from the server, in case the downsell fails it removes attachment from the well.
         * The attachment queue manager also removes attachment when cancelled. Hence we
         * run into a situation where the action is called for the same attachment.
         */
        return;
    }

    let attachments: AttachmentState[];
    let isInline: boolean = false;

    if (attachment.attachmentType === AttachmentStateType.InlineAttachment) {
        attachments = attachmentWell.inlineAttachments;
        isInline = true;
    } else if (
        attachmentWell.imageViewAttachments.some(
            att => att.attachmentId === attachment.attachmentId
        )
    ) {
        attachments = attachmentWell.imageViewAttachments;
    } else {
        attachments = attachmentWell.docViewAttachments;
    }

    let foundAttachment: boolean = false;
    for (let i = 0; i < attachments.length; i++) {
        if (attachments[i].attachmentId === attachment.attachmentId) {
            attachments.splice(i, 1);
            foundAttachment = true;
            break;
        }
    }

    if (
        shouldUpdateSize &&
        foundAttachment &&
        (isInline || !(<AttachmentFullViewState>attachment).isCloudy)
    ) {
        changeTotalClassicAttachmentSize(attachmentWell, -1 * attachmentModel.model.Size);
    }
    if (shouldDeleleAttachmentModel) {
        deleteAttachment(attachment.attachmentId);
    }
});
