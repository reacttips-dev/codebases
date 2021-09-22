import type { EventsCacheLockId } from 'owa-calendar-events-store';
import type { DateRange } from 'owa-datetime-utils';
import {
    getLoadState,
    isInitializingCalendarEventsLoader,
} from '../selectors/calendarEventsLoaderStoreSelectors';
import {
    initializeScenario,
    updateIsInitializingCalendarEventsLoader,
} from '../actions/internalActions';
import { calendarEventsLoaderInitialized } from '../actions/publicActions';
import { updateCalendarIdsAndDateRange } from './updateCalendarIdsAndDateRange';

/**
 * Initializes and loads the data for events from the folder ids
 * in the dateRange, a calendarEventsLoaderInitialized initialized action
 * is triggered when this is complete.
 *
 * @param eventsCacheLockId - The eventsCacheLockId to initialize
 * @param calendarIds - The data used to get the calendar folder ids used to get events from the events store
 * @param dateRange - The date range to load events from
 */
export async function initializeCalendarEventsLoader(
    eventsCacheLockId: EventsCacheLockId,
    calendarIds: string[],
    dateRange: DateRange
) {
    if (getLoadState(eventsCacheLockId) === 'DoesNotExist') {
        /**
         * if the scenario does not exist in our store trigger a initializeScenario action
         * to initialize it in our store and trigger the initializeCalendarsCache action to begin the
         * initialization of the events data in the store.
         **/
        initializeScenario(eventsCacheLockId);
    } else {
        if (isInitializingCalendarEventsLoader(eventsCacheLockId)) {
            // if the scenario is already initializing, do nothing
            return;
        }
    }

    await updateCalendarIdsAndDateRange(eventsCacheLockId, {
        calendarIds,
        dateRange,
    });

    // trigger a calendarEventsLoaderInitialized action to notify consumers that the scenario is initialized
    calendarEventsLoaderInitialized(eventsCacheLockId);

    updateIsInitializingCalendarEventsLoader(false, eventsCacheLockId);
}
