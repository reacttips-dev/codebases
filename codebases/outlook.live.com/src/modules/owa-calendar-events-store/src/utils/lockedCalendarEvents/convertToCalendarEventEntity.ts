import type CalendarEvent from 'owa-calendar-types/lib/types/CalendarEvent';
import type { CalendarEventEntity } from '../../store/schema/CalendarEventEntity';
import type { EventEntity } from 'owa-events-cache';

import assign from 'object-assign';

export function convertToCalendarEventEntity(
    key: string,
    calendarEvent: CalendarEvent
): CalendarEventEntity {
    // We create the object and later assign is so that
    // if there is a change to EventEntity object then it
    // will have to be changed here as well as compiler will catch
    // it.
    const eventEntity: EventEntity = {
        Key: key,
        Start: calendarEvent.Start,
        End: calendarEvent.End,
    };

    assign(calendarEvent, eventEntity);

    return calendarEvent as CalendarEventEntity;
}
