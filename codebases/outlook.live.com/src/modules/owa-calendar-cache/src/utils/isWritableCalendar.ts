import type { CalendarEntry, LocalCalendarEntry } from 'owa-graph-schema';

export default function isWritableCalendar(calendarEntry: CalendarEntry | null): boolean {
    return (
        calendarEntry &&
        !(calendarEntry as LocalCalendarEntry).IsReadOnly &&
        calendarEntry.EffectiveRights &&
        calendarEntry.EffectiveRights.CreateContents
    );
}
