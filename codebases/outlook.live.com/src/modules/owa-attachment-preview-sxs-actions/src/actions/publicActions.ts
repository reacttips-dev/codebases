import type { ClientItemId } from 'owa-client-ids';
import type { PerformanceDatapoint } from 'owa-analytics';
import { action } from 'satcheljs';

export const loadItemAttachment = action(
    'loadItemAttachment',
    (itemAttachmentId: ClientItemId, perfDatapoint: PerformanceDatapoint) => ({
        itemAttachmentId,
        perfDatapoint,
    })
);
