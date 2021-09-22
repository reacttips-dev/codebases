import { getEventsReader } from './calendarEventsLockedStoreSelectors';
import { getShowDeclinedMeetingsEnabled } from './userConfigSelectors';
import type { EventsLoadState, ScenarioLoadState } from '../store/schema/LoadState';
import { EventsLoadedData, getEventsLoadedStore } from '../store/store';
import type { EventsCacheLockId } from 'owa-calendar-events-store';
import type { CalendarEvent } from 'owa-calendar-types';
import type { DateRange } from 'owa-datetime-utils';
import { getFolderIdByCalendarID } from './calendarCacheSelectors';
import { canFetchEvents, calendarIsInCache } from '../selectors/calendarCacheSelectors';
import { aggCalendarIds, hasLoadState } from '../utils/eventsLoadStateEntryUtils';
import { getCalendarFolderIdUpdateLoadState } from 'owa-calendarsapi-outlook';
import { logUsage } from 'owa-analytics';
import { ObservableMap } from 'mobx';

export function getEventLockCacheId(eventsCacheLockId: EventsCacheLockId): EventsCacheLockId {
    return getScenarioData(eventsCacheLockId).eventsCacheLockId;
}

/**
 * Gets the calendar events load state for an eventsCacheLockId
 *
 * @param eventsCacheLockId eventsCacheLockId
 * @param calendarId calendarId
 */
export function getLoadStateForCalendar(
    eventsCacheLockId: EventsCacheLockId,
    calendarId: string
): EventsLoadState | undefined {
    if (!calendarIsInCache(calendarId)) {
        return 'Loading';
    }
    return canFetchEvents(calendarId)
        ? getCalendarEventsLoadStates(eventsCacheLockId).get(calendarId)
        : getCalendarFolderIdUpdateLoadState(calendarId);
}

/**
 * Gets a list of the individual calendar events load states for all calendars being loaded for a scenario
 *
 * @param eventsCacheLockId eventsCacheLockId
 */
export function getLoadStatesForCalendars(eventsCacheLockId: EventsCacheLockId): EventsLoadState[] {
    return getCalendarEventsLoadStatesKeys(eventsCacheLockId).map(calendarId =>
        getLoadStateForCalendar(eventsCacheLockId, calendarId)
    );
}

/**
 * Gets the combined load state of all calendars for a scenario
 *
 * @param eventsCacheLockId - The eventsCacheLockId to get the LoadState for
 * @returns The LoadState of the events.
 */
export function getLoadState(eventsCacheLockId: EventsCacheLockId): ScenarioLoadState {
    if (!getEventsLoadedStore().scenarios.has(eventsCacheLockId)) {
        return 'DoesNotExist';
    }
    return getScenarioData(eventsCacheLockId).scenarioLoadState;
}

/**
 * Gets the loaded date range for a scenario.
 *
 * @param eventsCacheLockId
 * @returns DateRange if data is loaded, otherwise null. IMPORTANT: When we are loading a new DateRange
 * this will return null while the new DateRange is loading.
 */
export function getLoadedDateRange(eventsCacheLockId: EventsCacheLockId): DateRange | null {
    return getScenarioData(eventsCacheLockId).loadedDateRange;
}

export function getCalendarIdsByLoadState(
    eventsCacheLockId: EventsCacheLockId,
    loadState: EventsLoadState
): string[] {
    return getCalendarEventsLoadStatesEntries(eventsCacheLockId).reduce(
        aggCalendarIds(hasLoadState(loadState)),
        []
    );
}

// Gets the folderIds that we can fetch events from for a scenario
export function getAllLoadedFolderIds(eventsCacheLockId: EventsCacheLockId): string[] {
    return getCalendarEventsLoadStatesKeys(eventsCacheLockId)
        .filter(canFetchEvents)
        .map(getFolderIdByCalendarID);
}

export function getScenarioData(eventsCacheLockId: EventsCacheLockId): EventsLoadedData {
    const scenarioData = getEventsLoadedStore().scenarios.get(eventsCacheLockId);
    if (!scenarioData) {
        logUsage('GetScenarioDataError', {
            eventsCacheLockId: eventsCacheLockId,
        });
        return {
            eventsCacheLockId: eventsCacheLockId,
            loadedDateRange: null,
            scenarioLoadState: 'DoesNotExist',
            calendarEventsLoadState: new ObservableMap({}),
            isInitializingCalendarEventsLoader: false,
        };
    }
    return scenarioData;
}

export function isInitializingCalendarEventsLoader(eventsCacheLockId: EventsCacheLockId): boolean {
    return getScenarioData(eventsCacheLockId).isInitializingCalendarEventsLoader;
}

interface CalendarIdsToUpdate {
    eventsCacheLockId: EventsCacheLockId;
    calendarIds: string[];
}
/**
 * Gets all the scenarios with calendarIds in a `NotLoaded` state.
 * @returns a list tuples which contain scenarioIds and lists of calendarIds that are in
 * a `NotLoaded` state for that scenario.
 */
export function getAllScenariosWithNotLoadCalendarIds(): CalendarIdsToUpdate[] {
    const storeEntries = [...getEventsLoadedStore().scenarios.entries()];
    return storeEntries.reduce(
        (
            updateScenarios: CalendarIdsToUpdate[],
            [eventsCacheLockId, scenarioData]: [EventsCacheLockId, EventsLoadedData]
        ) => {
            const calendarEventsLoadStateEntries = getCalendarEventsLoadStatesEntries(
                eventsCacheLockId
            );
            const calendarIdsToUpdate = calendarEventsLoadStateEntries.reduce(
                aggCalendarIds(hasLoadState('NotLoaded')),
                []
            );
            if (calendarIdsToUpdate && calendarIdsToUpdate.length > 0) {
                updateScenarios.push({
                    eventsCacheLockId: eventsCacheLockId,
                    calendarIds: calendarIdsToUpdate,
                });
            }
            return updateScenarios;
        },
        []
    );
}

export function getEvents(
    eventsCacheLockId: EventsCacheLockId,
    dateRange?: DateRange
): CalendarEvent[] {
    const eventsDateRange = dateRange ? dateRange : getLoadedDateRange(eventsCacheLockId);
    const folderIds = getAllLoadedFolderIds(eventsCacheLockId);
    const lockId = getEventLockCacheId(eventsCacheLockId);

    let events = folderIds
        ? getEventsReader(lockId).getOrderedEvents(folderIds, eventsDateRange)
        : [];

    if (!getShowDeclinedMeetingsEnabled(eventsCacheLockId)) {
        events = events.filter(event => event.ResponseType !== 'Decline');
    }

    return events;
}

export function getCalendarEventsLoadStates(eventsCacheLockId: EventsCacheLockId) {
    return getScenarioData(eventsCacheLockId).calendarEventsLoadState;
}

export function getCalendarEventsLoadStatesEntries(eventsCacheLockId: EventsCacheLockId) {
    return [...getCalendarEventsLoadStates(eventsCacheLockId).entries()];
}

export function getCalendarEventsLoadStatesKeys(eventsCacheLockId: EventsCacheLockId): string[] {
    return [...getCalendarEventsLoadStates(eventsCacheLockId).keys()];
}

/**
 * Checks if an events store lock id is being stored in our store
 * @param lockId a calendar events store lock id
 * @returns { value: true, eventsCacheLockId: string } if the lock id is in our store, where eventsCacheLockId
 * is the loader's scenario id
 *  { value: false } if eventsCacheLockId is not in out store
 */
export function isCalendarEventsLoaderLockId(
    lockId: string
): { value: false } | { value: true; eventsCacheLockId: EventsCacheLockId } {
    const scenarios = [...getEventsLoadedStore().scenarios.entries()].filter(
        ([key, loaderScenario]) => loaderScenario.eventsCacheLockId === lockId
    );
    return scenarios.length > 0
        ? { value: true, eventsCacheLockId: scenarios[0][0] }
        : { value: false };
}
