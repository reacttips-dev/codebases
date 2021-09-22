import type { CalendarEvent } from 'owa-calendar-types';
import { isCalendarEventLocalLie } from 'owa-calendar-event-local-lie';
import { isEqual } from 'owa-datetime';

export default function isOriginalTime(originalEvent: CalendarEvent, event: CalendarEvent) {
    return (
        originalEvent &&
        event &&
        !isCalendarEventLocalLie(originalEvent) &&
        isEqual(event.Start, originalEvent.Start) &&
        isEqual(event.End, originalEvent.End) &&
        event.IsAllDayEvent == originalEvent.IsAllDayEvent
    );
}
