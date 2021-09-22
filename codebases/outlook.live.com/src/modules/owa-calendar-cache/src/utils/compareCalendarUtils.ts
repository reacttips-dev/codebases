import type { CalendarEntry } from 'owa-graph-schema';

export function isCalendarInAccount(calendar: CalendarEntry, userIdentity: string): boolean {
    return !!calendar && calendar.calendarId.mailboxInfo.userIdentity === userIdentity;
}

export function isCalendarInGroup(calendarEntry: CalendarEntry, groupId: string): boolean {
    return !!calendarEntry && calendarEntry.ParentGroupId === groupId;
}

export function isSameCalendar(cal1: CalendarEntry, cal2: CalendarEntry): boolean {
    return !!cal1 && !!cal2 && cal1.calendarId.id === cal2.calendarId.id;
}

export function compareCalendarsByName(a: CalendarEntry, b: CalendarEntry) {
    return a.CalendarName.localeCompare(b.CalendarName);
}
