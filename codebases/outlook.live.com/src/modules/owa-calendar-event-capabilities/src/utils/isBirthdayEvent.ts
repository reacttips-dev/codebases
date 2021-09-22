import type { CalendarEvent } from 'owa-calendar-types';
import { getCalendarEntryByFolderId } from 'owa-calendar-cache';
import CalendarFolderTypeEnum from 'owa-service/lib/contract/CalendarFolderTypeEnum';

export default function isBirthdayEvent(item: CalendarEvent): boolean {
    if (!item) {
        return false;
    }
    const calendarEntry = getCalendarEntryByFolderId(item.ParentFolderId.Id);
    return (
        calendarEntry && calendarEntry.CalendarFolderType == CalendarFolderTypeEnum.BirthdayCalendar
    );
}
