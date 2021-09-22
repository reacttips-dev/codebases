import type InlineAttachmentState from '../schema/InlineAttachmentState';
import type InlineAttachmentStatus from '../schema/InlineAttachmentStatus';
import { action } from 'satcheljs/lib/legacy';

export default action('setInlineAttachmentStatus')(function setInlineAttachmentStatus(
    inlineAttachmentState: InlineAttachmentState,
    status: InlineAttachmentStatus
) {
    inlineAttachmentState.status = status;
});
