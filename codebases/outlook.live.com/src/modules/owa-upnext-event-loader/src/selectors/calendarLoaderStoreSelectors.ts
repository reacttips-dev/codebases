import { getUpNextDateRange } from './dateTimeStoreSelectors';
import { selectUpNextEvent } from '../utils/selectUpNextEvent';
import { EventsCacheLockId, getEvents } from 'owa-calendar-events-loader';
import type { CalendarEvent } from 'owa-calendar-types';
import type { ClientItemId } from 'owa-client-ids';
import { isEventInVisualDateRange } from 'owa-calendar-events-visual-date-range';

/** Gets the current up next event given from the events store */
export function getCurrentUpNextEvent(eventsCacheLockId: EventsCacheLockId): CalendarEvent | null {
    const events = getEventsForUpNextDateRange(eventsCacheLockId);
    return selectUpNextEvent(events, true /* areEventsSorted */);
}

export function getCalendarEvent(
    eventsCacheLockId: EventsCacheLockId,
    clientItemId: ClientItemId
): CalendarEvent | null {
    const events = getEventsForUpNextDateRange(eventsCacheLockId);
    const calendarEvent = events.filter(event => event.ItemId.Id === clientItemId.Id)[0];
    return calendarEvent || null;
}

export function getEventsForUpNextDateRange(eventsCacheLockId: EventsCacheLockId): CalendarEvent[] {
    const upNextDateRange = getUpNextDateRange();
    return getEvents(eventsCacheLockId, upNextDateRange).filter(
        isEventInVisualDateRange(upNextDateRange)
    );
}
