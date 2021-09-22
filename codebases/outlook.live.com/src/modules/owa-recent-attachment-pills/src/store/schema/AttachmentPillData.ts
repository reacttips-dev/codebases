import type AttachmentId from 'owa-service/lib/contract/AttachmentId';

export enum AttachmentPillViewStatus {
    Show,
    Hide,
    Pending,
}

export interface AttachmentPillData {
    /**
     * Attachment Id
     */
    attachmentId: AttachmentId | undefined;

    /**
     * Each pill has it's own state. When the user click on a pill, we should hide it.
     * in case of a failure to upload - we will change the state to 'Show'.
     */
    attachmentPillViewStatus: AttachmentPillViewStatus;
}
