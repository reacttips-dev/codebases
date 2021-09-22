import type { CalendarEventEntity } from '../../store/schema/CalendarEventEntity';
import {
    internalRemoveCalendarEventsFromEventsCacheMatchingFilter,
    removeFullCalendarEventInfo,
} from '../../actions/eventsCacheActions';
import { calendarEventsRemoved } from '../../actions/publicActions';

export function removeCalendarEventsFromEventsCacheMatchingFilter(
    folderId: string,
    predicate: (event: CalendarEventEntity) => boolean
): CalendarEventEntity[] {
    let eventsRemoved: CalendarEventEntity[] = null;
    internalRemoveCalendarEventsFromEventsCacheMatchingFilter(folderId, predicate, er => {
        eventsRemoved = er;
    });

    if (eventsRemoved) {
        // For the events being removed trigger a corresponding remove of full item info
        // and trigger the action indicating events that got removed
        eventsRemoved.forEach(event => removeFullCalendarEventInfo(folderId, event.Key));
        calendarEventsRemoved(eventsRemoved);
    }
    return eventsRemoved;
}
