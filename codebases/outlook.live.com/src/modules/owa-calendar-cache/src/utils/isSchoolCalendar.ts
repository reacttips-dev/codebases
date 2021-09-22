import type { CalendarEntry, LocalCalendarEntry } from 'owa-graph-schema';

export default function isSchoolCalendar(calendar: CalendarEntry): boolean {
    const calendarEntry: LocalCalendarEntry = calendar as LocalCalendarEntry;
    return calendarEntry?.IsSchoolCalendar;
}
