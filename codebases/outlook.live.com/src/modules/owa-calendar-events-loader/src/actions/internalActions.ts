import { action } from 'satcheljs';
import type { DateRange } from 'owa-datetime-utils';
import type { ScenarioLoadState } from '../store/schema/LoadState';
import type { EventsCacheLockId } from 'owa-calendar-events-store';

export const updateLoadedDateRange = action(
    'updateLoadedDateRange',
    (dateRange: DateRange | null, eventsCacheLockId: EventsCacheLockId) => ({
        dateRange,
        eventsCacheLockId,
    })
);

export const updateCalendarEventLoadStates = action(
    'updateCalendarEventLoadStates',
    (calendarIds: string[], eventsCacheLockId: EventsCacheLockId) => ({
        calendarIds,
        eventsCacheLockId,
    })
);

/**
 * This resets all of the scenario's calendars' calendar events load states to `NotLoaded`.
 * It is used to null-out any existing load states from the previously loaded date range before we fetch a new date
 * range of events for a scenario.
 */
export const resetCalendarEventLoadStates = action(
    'resetCalendarEventLoadStates',
    (eventsCacheLockId: EventsCacheLockId) => ({
        eventsCacheLockId,
    })
);

export const updateLoadState = action(
    'updateLoadState',
    (loadState: ScenarioLoadState, eventsCacheLockId: EventsCacheLockId) => ({
        eventsCacheLockId,
        loadState,
    })
);

export const initializeScenario = action(
    'initializeScenario',
    (eventsCacheLockId: EventsCacheLockId) => ({
        eventsCacheLockId,
    })
);

export const updateIsInitializingCalendarEventsLoader = action(
    'updateIsInitializingCalendarEventsLoader',
    (isInitializingCalendarEventsLoader: boolean, eventsCacheLockId: EventsCacheLockId) => ({
        eventsCacheLockId,
        isInitializingCalendarEventsLoader,
    })
);
