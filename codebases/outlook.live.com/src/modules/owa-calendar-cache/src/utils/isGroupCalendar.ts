import type { CalendarEntry } from 'owa-graph-schema';

export default function isGroupCalendar(calendarEntry: CalendarEntry): boolean {
    return !!calendarEntry && calendarEntry.IsGroupMailboxCalendar;
}
