import getAttachment from '../selectors/getAttachment';
import type AttachmentModel from '../store/schema/AttachmentModel';
import type { ClientAttachmentId } from 'owa-client-ids';
import { action } from 'satcheljs/lib/legacy';

export default action('setAttachmentOriginalUrl')(function setAttachmentOriginalUrl(
    attachmentId: ClientAttachmentId,
    attachmentOriginalUrl: string
) {
    const attachment: AttachmentModel = getAttachment(attachmentId);
    attachment.model.AttachmentOriginalUrl = attachmentOriginalUrl;
});
