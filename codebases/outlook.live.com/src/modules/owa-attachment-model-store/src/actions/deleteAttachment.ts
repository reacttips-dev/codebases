import type AttachmentStore from '../store/schema/AttachmentStore';
import getStore from '../store/store';
import type { ClientAttachmentId } from 'owa-client-ids';
import { action } from 'satcheljs/lib/legacy';

export default action('deleteAttachment')(function deleteAttachment(
    attachmentId: ClientAttachmentId
): void {
    const store: AttachmentStore = getStore();
    store.attachments.delete(attachmentId.Id);
});
