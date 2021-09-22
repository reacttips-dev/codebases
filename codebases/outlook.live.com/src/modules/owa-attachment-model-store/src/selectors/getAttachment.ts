import type AttachmentModel from '../store/schema/AttachmentModel';
import type AttachmentStore from '../store/schema/AttachmentStore';
import getStore from '../store/store';
import type AttachmentId from 'owa-service/lib/contract/AttachmentId';

export default function getAttachment(attachmentId: AttachmentId): AttachmentModel {
    const store: AttachmentStore = getStore();
    const attachment = store.attachments.get(attachmentId.Id);

    return attachment;
}
