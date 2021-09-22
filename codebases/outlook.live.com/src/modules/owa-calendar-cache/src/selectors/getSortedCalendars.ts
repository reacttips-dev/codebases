import type { CalendarEntry } from 'owa-graph-schema';
import { getDefaultCalendar, getCalendarEntries } from './calendarsCacheSelectors';
import {
    isSameCalendar,
    isCalendarInAccount,
    isCalendarInGroup,
    compareCalendarsByName,
} from '../utils/compareCalendarUtils';

/**
 * Sorts calendars for an account/ group into an ordered list following a logical hierarchy:
 *     -> Default calendar (if any)
 *     -> Other calendars in sorted order by display name
 */
export function getSortedCalendars(account: string, groupId: string): CalendarEntry[] {
    // look up default calendar for account
    const defaultCalendarForAccount = getDefaultCalendar(account);
    const calendarsInAccountGroup = getCalendarEntries()
        .filter(
            calendar =>
                isCalendarInAccount(calendar, account) &&
                isCalendarInGroup(calendar, groupId) &&
                !isSameCalendar(calendar, defaultCalendarForAccount)
        )
        .sort(compareCalendarsByName);

    // if default calendar is in account group, add to front of list
    if (defaultCalendarForAccount && isCalendarInGroup(defaultCalendarForAccount, groupId)) {
        calendarsInAccountGroup.unshift(defaultCalendarForAccount);
    }

    return calendarsInAccountGroup;
}
