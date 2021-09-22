import type { AttachmentData } from '../store/schema/ImageAttachmentsListStore';
import { getStore } from '../store/store';

export function getAttachmentData(attachmentId: string): AttachmentData {
    const listStore = getStore().imageAttachmentsListStore;
    let attachmentData = listStore.imageAttachments.get(attachmentId);
    if (!attachmentData) {
        const recommendedStore = getStore().recommendedAttachmentsStore;
        attachmentData = recommendedStore.recommendedAttachments.get(attachmentId);
    }
    return attachmentData;
}
