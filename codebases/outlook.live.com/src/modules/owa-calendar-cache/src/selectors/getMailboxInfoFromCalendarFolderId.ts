import { getCalendarIdByFolderId } from './calendarsCacheSelectors';

export default function getMailboxInfoFromCalendarFolderId(calendarFolderId: string) {
    const calendarId = getCalendarIdByFolderId(calendarFolderId);
    return calendarId ? calendarId.mailboxInfo : null;
}
