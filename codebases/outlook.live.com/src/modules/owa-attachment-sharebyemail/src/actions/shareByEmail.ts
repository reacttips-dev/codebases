import type { AttachmentFile } from 'owa-attachment-file-types';
import { action } from 'satcheljs';
import { addDatapointConfig } from 'owa-analytics-actions';
import type { ComposeTarget } from 'owa-mail-compose-store';

export const shareByEmail = action(
    'SHARE_BY_EMAIL',
    (attachments: AttachmentFile[], composeTarget: ComposeTarget) =>
        addDatapointConfig(
            {
                name: 'ShareByEmail',
            },
            {
                attachments: attachments,
                composeTarget: composeTarget,
            }
        )
);
