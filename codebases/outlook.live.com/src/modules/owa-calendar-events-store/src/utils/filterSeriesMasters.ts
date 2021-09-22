import type CalendarEvent from 'owa-calendar-types/lib/types/CalendarEvent';
import { isRecurringMaster } from 'owa-calendar-event-capabilities';

export function filterSeriesMasters(events: CalendarEvent[]) {
    // for functions that get events to display, we never want to display the series master, since the occurrences are all in the cache
    return events.filter(
        // Return all items except the recurring master
        event => !isRecurringMaster(event.CalendarItemType)
    );
}
