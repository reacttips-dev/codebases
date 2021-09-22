import type AttachmentState from '../schema/AttachmentState';
import AttachmentStateType from '../schema/AttachmentStateType';
import type InlineAttachmentState from '../schema/InlineAttachmentState';

export default function isInlineAttachmentStateType(
    attachment: AttachmentState
): attachment is InlineAttachmentState {
    return attachment.attachmentType === AttachmentStateType.InlineAttachment;
}
