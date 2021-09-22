import { getCalendarEvent, getEventsForUpNextDateRange } from './calendarLoaderStoreSelectors';
import { getUpNextStore } from '../store/store';
import { isConflictingWithUpNextEvent } from '../utils/isConflictingWithUpNextEvent';
import type { EventsCacheLockId } from 'owa-calendar-events-loader';
import type { CalendarEvent } from 'owa-calendar-types';
import type { ClientItemId } from 'owa-client-ids';
import { isEventWithinNow } from '../utils/isEventWithinNow';

/** get the stored up-next event ID from the store */
export function getUpNextCalendarEventId(
    eventsCacheLockId: EventsCacheLockId
): ClientItemId | null {
    return getUpNextStore().scenarios.get(eventsCacheLockId);
}

export function getUpNextCalendarEvent(eventsCacheLockId: EventsCacheLockId): CalendarEvent | null {
    const upNextItemIdForGivenScenario = getUpNextCalendarEventId(eventsCacheLockId);

    // No up-next event exists for the given calendar scenario
    if (!upNextItemIdForGivenScenario) {
        return null;
    }
    return getCalendarEvent(eventsCacheLockId, upNextItemIdForGivenScenario);
}

/**
 * Gets the up next calendar event with the conflicting events.
 * @param eventsCacheLockId the id for calendar scenario
 */
export function getUpNextCalendarEventWithConflicts(
    eventsCacheLockId: EventsCacheLockId
): {
    upNextEvent: CalendarEvent | null;
    conflictingEvents: CalendarEvent[];
} {
    const upNextCalendarEvent = getUpNextCalendarEvent(eventsCacheLockId);
    if (!upNextCalendarEvent) {
        return {
            upNextEvent: null,
            conflictingEvents: [],
        };
    }

    const upNextConflictingEvents = getEventsForUpNextDateRange(eventsCacheLockId).filter(event =>
        isConflictingWithUpNextEvent(upNextCalendarEvent, event)
    );

    return {
        upNextEvent: upNextCalendarEvent,
        conflictingEvents: upNextConflictingEvents,
    };
}

/**
 * Gets the up next calendar event with all the online joinable events in the visual range.
 * @param eventsCacheLockId the id for calendar scenario
 */
export function getUpNextCalendarEventWithOnlineJoinableEvents(
    eventsCacheLockId: EventsCacheLockId
): {
    upNextEvent: CalendarEvent | null;
    eventsWithinUpNextEvent: CalendarEvent[];
} {
    const upNextCalendarEvent = getUpNextCalendarEvent(eventsCacheLockId);
    if (!upNextCalendarEvent) {
        return {
            upNextEvent: null,
            eventsWithinUpNextEvent: [],
        };
    }

    const eventsWithinNow = getEventsForUpNextDateRange(eventsCacheLockId).filter(event =>
        isEventWithinNow(upNextCalendarEvent, event)
    );

    return {
        upNextEvent: upNextCalendarEvent,
        eventsWithinUpNextEvent: eventsWithinNow,
    };
}

export function isUpNextScenarioInitialized(eventsCacheLockId: EventsCacheLockId): boolean {
    return getUpNextStore().scenarios.has(eventsCacheLockId);
}

export function getInitializedScenarioIds(): EventsCacheLockId[] {
    return [...getUpNextStore().scenarios.keys()];
}
