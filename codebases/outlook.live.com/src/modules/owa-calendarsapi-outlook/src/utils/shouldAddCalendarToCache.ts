import type { CalendarEntry, LinkedCalendarEntry } from 'owa-graph-schema';

import CalendarFolderTypeEnum from 'owa-service/lib/contract/CalendarFolderTypeEnum';
import { isLinkedCalendarEntry } from 'owa-calendar-properties';
import { trace } from 'owa-trace';

export function shouldAddCalendarToCache(
    calendarEntry: CalendarEntry,
    calendarKeys: string[]
): boolean {
    if (calendarEntry.CalendarFolderType == CalendarFolderTypeEnum.SchedulesCalendar) {
        return false;
    } else if (isLinkedCalendarEntry(calendarEntry)) {
        // linked calendar entry
        let linkedCalendarEntry: LinkedCalendarEntry = calendarEntry as LinkedCalendarEntry;

        if (linkedCalendarEntry.IsOwnerEmailAddressInvalid) {
            // If the calendar points to a user that is not valid (i.e. AD lookup failed)
            // We do not create a corresponding folder model.
            trace.info(
                `[getCalendarsService] Ommitting shared calendar with IsOwnerEmailAddressInvalid flag on, OwnerEmailAddress: {1}: ${linkedCalendarEntry.OwnerEmailAddress}`
            );
            return false;
        }

        let calendarKey = linkedCalendarEntry.IsGeneralScheduleCalendar
            ? linkedCalendarEntry.OwnerEmailAddress
            : linkedCalendarEntry.SharedFolderId
            ? linkedCalendarEntry.SharedFolderId.Id
            : null;

        if (!calendarKey) {
            trace.info(
                `[getCalendarsService] Ommitting linked calendar with null SharedFolderId, Id: {1}: ${calendarEntry.calendarId.id}`
            );
            return false;
        }

        if (calendarKeys.includes(calendarKey)) {
            trace.info(
                `[getCalendarsService] Ommitting duplicate shared calendar from Calendar folder list. DuplicateKey: {1}: ${calendarKey}`
            );
            return false;
        } else {
            calendarKeys.push(calendarKey);
        }

        linkedCalendarEntry.OwnerEmailAddress = linkedCalendarEntry.OwnerEmailAddress.toLowerCase();

        if (linkedCalendarEntry.IsGroupMailboxCalendar) {
            return false;
        }
    }

    return true;
}
