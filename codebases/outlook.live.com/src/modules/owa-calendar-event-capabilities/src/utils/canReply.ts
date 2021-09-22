import { isConnectedAccount } from 'owa-accounts-store';
import type { CalendarEvent } from 'owa-calendar-types';

export default function canReply(item: CalendarEvent): boolean {
    return item.IsMeeting && !isConnectedAccount(item.ParentFolderId.mailboxInfo.userIdentity);
}
