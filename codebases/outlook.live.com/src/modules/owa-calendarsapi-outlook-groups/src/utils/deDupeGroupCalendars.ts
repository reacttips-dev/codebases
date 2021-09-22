import { getCalendarEntries } from 'owa-calendar-cache';
import type {
    GetGroupCalendarsServiceResult,
    GroupCalendarResult,
} from '../services/getGroupCalendarsService';

import type { LocalCacheForRemoteCalendarEntry } from 'owa-graph-schema';
import { isLocalCacheForRemoteCalendarEntry } from 'owa-calendar-properties';

export function deDupeGroupCalendars(
    groupCalendarsResult: GetGroupCalendarsServiceResult
): GetGroupCalendarsServiceResult | null {
    // Populate all the new model shared calendar entries
    let remoteCalendarEntries = getCalendarEntries().filter(calendarEntry => {
        return isLocalCacheForRemoteCalendarEntry(calendarEntry);
    });

    if (remoteCalendarEntries.length == 0) {
        return groupCalendarsResult;
    }

    /*
    Family calendar is a consumer only scenario. Due to a family calendar livesite scenario, wherein a
    family group calendar gets upgraded to a new model shared calendar, there is a possibility of a dupe
    amongst family calendars. Filtering logic to verify there are no new model shared calendars mapping
    to a group calendar before listing out the calendar groups.
    */
    const groupCalendars: GroupCalendarResult[] = [];

    for (let i = 0; i < groupCalendarsResult?.groupCalendars?.length; i++) {
        const groupCalendar = groupCalendarsResult.groupCalendars[i];
        const isDupeEntry = remoteCalendarEntries.some(remoteCalendarEntry => {
            const localCalendarEntry = remoteCalendarEntry as LocalCacheForRemoteCalendarEntry;

            // De-dupe logic between family group calendar and shared calendar.
            return (
                localCalendarEntry.OwnerEmailAddress?.toLowerCase() ===
                    groupCalendar.entry.calendarId.mailboxInfo.mailboxSmtpAddress &&
                localCalendarEntry.SharedOwnerMailboxGuid?.toLowerCase() ===
                    groupCalendar.groupMailboxGuid
            );
        });

        if (!isDupeEntry) {
            groupCalendars.push(groupCalendar);
        }
    }

    if (groupCalendars?.length > 0) {
        return {
            groupCalendars: groupCalendars,
            calendarGroup: groupCalendarsResult.calendarGroup,
        };
    }

    return null;
}
