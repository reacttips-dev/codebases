import type { MailboxInfo } from 'owa-client-ids';
import type ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { action } from 'satcheljs';

export const tryPrefetchMeetingMessage = action(
    'tryPrefetchMeetingMessage',
    (mailboxInfo: MailboxInfo, listViewType: ReactListViewType, shouldDelayPrefetch: boolean) => ({
        mailboxInfo: mailboxInfo,
        listViewType: listViewType,
        shouldDelayPrefetch: shouldDelayPrefetch,
    })
);

export const removeMeetingMessagesFromStore = action(
    'removeMeetingMessagesFromStore',
    (itemIds: string[]) => ({
        itemIds: itemIds,
    })
);
