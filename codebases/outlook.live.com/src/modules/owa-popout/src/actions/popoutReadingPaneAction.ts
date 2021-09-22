import { action } from 'satcheljs';
import type { MailboxInfo } from 'owa-client-ids';
import type {
    default as PopoutData,
    DeeplinkPopoutData,
} from 'owa-popout-v2/lib/store/schema/PopoutData';

export const popoutReadingPane = action(
    'POPOUT_READING_PANE',
    (
        itemId?: string,
        conversationId?: string,
        mailboxInfo?: MailboxInfo,
        data?: DeeplinkPopoutData | PopoutData
    ) => ({
        itemId,
        conversationId,
        mailboxInfo,
        data,
    })
);

export default popoutReadingPane;
