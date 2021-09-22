import type { CalendarEvent } from 'owa-calendar-types';
import CalendarFolderTypeEnum from 'owa-service/lib/contract/CalendarFolderTypeEnum';
import canModify from './canModify';
import { getCalendarEntryByFolderId } from 'owa-calendar-cache';
import { isCalendarEventLocalLie } from 'owa-calendar-event-local-lie';

/**
 * Determines if the categories menu is to be shown
 * @param item Calendar event object
 */
export default (item: CalendarEvent): boolean => {
    const calendarEntry = getCalendarEntryByFolderId(item.ParentFolderId.Id);
    const calendarType: CalendarFolderTypeEnum = calendarEntry
        ? calendarEntry.CalendarFolderType
        : undefined;

    return (
        (isCalendarEventLocalLie(item) || canModify(item)) &&
        /* Group and shared calendars don't have a calendarType returned by the server, so skipping the entries here that
           don't have a calendarType. */
        (!calendarType ||
            calendarType == CalendarFolderTypeEnum.DefaultCalendar ||
            calendarType == CalendarFolderTypeEnum.BirthdayCalendar ||
            calendarType == CalendarFolderTypeEnum.PublicCalendarFolder)
    );
};
