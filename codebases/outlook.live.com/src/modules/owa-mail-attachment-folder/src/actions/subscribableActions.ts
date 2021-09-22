import { action } from 'satcheljs';
import type { AttachmentData } from '../store/schema/AttachmentData';

export const onAttachmentLoadFailed = action('ON_ATTACHMENTS_LOAD_FAILED');

export const onAttachmentsRetrieved = action(
    'ON_ATTACHMENTS_Retrieved',
    (attachments: AttachmentData[]) => ({
        attachments: attachments,
    })
);
