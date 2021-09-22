import { action } from 'satcheljs';
import type AttachmentId from 'owa-service/lib/contract/AttachmentId';

export const onUpdateRecipientsInCompose = action(
    'onUpdateRecipientsInCompose',
    (
        numberOfRecipients: number,
        recipientName: string,
        composeId: string,
        attachments: AttachmentId[]
    ) => ({
        numberOfRecipients: numberOfRecipients,
        recipientName: recipientName,
        composeId: composeId,
        attachments: attachments,
    })
);
