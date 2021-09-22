import type CalendarEvent from 'owa-calendar-types/lib/types/CalendarEvent';
import { calendarEventsInEventsCacheReloaded } from '../../actions/eventsCacheActions';
import type { DateRange } from 'owa-datetime-utils';
import { getAllLockedDateRanges, getAllLockIds } from '../../selectors/eventsCacheSelectors';
import { getDateRangesBeingFetchedForFolder } from '../lockedCalendarEvents/fetchCalendarEventsForDateRange';
import { loadCalendarEventsInDateRange } from '../../services/loadCalendarEventsInDateRange';
import { loadingCalendarEvents } from '../../actions/publicActions';
import { MAX_RETRIES_TO_LOAD_EVENTS_FOR_DATERANGE } from '../../constants';
import { mergeAllOverlappingDateRanges } from '../mergeAllOverlappingDateRanges';
import type { CalendarId } from 'owa-graph-schema';
import type { CalendarEventsLoadingState } from '../../types/CalendarEventsLoadingState';
import { uniqBy } from '../uniqBy';
import { getExistingFullCalendarEventFromServer } from '../../utils/getExistingFullCalendarEventFromServer';

import assign from 'object-assign';

/**
 * reloads the calendar events cache
 *
 * @param folderId folderId to reload
 * @param forceReplace if forceReplace is true, we replace the items in the cache with the reloaded items.
 * If forceReplace is false, we upsert the reloaded items. forceReplace should be true when the cache could contain events that have since been removed.
 */
export async function reloadCalendarEventsCache(
    folderId: string,
    forceReplace: boolean = false
): Promise<CalendarEvent[]> {
    const dateRangesToReload = getAllDateRangesForFolderIdToBeReloaded(folderId);

    const allPromises = dateRangesToReload.map(dateRange =>
        loadCalendarEventsInDateRange(
            dateRange,
            folderId,
            onLoadStateChanged(folderId, dateRange),
            MAX_RETRIES_TO_LOAD_EVENTS_FOR_DATERANGE
        )
    );

    let results: CalendarEvent[] = [];
    for (let i = 0; i < allPromises.length; i++) {
        await Promise.all([
            allPromises[i]?.fetchPromise,
            allPromises[i]?.enhancedFetchPromise,
        ]).then(resolvedPromises => {
            let events = resolvedPromises[0];
            const enhancedEvents = resolvedPromises[1];
            /* Merge getCalendarView and GetCalendarView++ events */
            if (events && enhancedEvents) {
                for (let j = 0; j < events.length; j++) {
                    const itemId = events[j].ItemId.Id;
                    let [eventFromRest] = enhancedEvents.filter(
                        event => event.ItemId.Id === itemId
                    );

                    if (eventFromRest) {
                        assign(events[j], eventFromRest);
                    }

                    results.push(events[j]);
                }
            } else if (events) {
                results.push(...events);
            }
        });
    }

    if (results.length > 0) {
        // We raise the action that events were reloaded only if the reload result is not empty.
        // Empty result is indication of service call failure and we want to avoid surface going blank in that case
        const fullEventPromises = results.map(item => getExistingFullCalendarEventFromServer(item));

        await Promise.all(fullEventPromises).then(resolvedFullEventPromises => {
            for (let i = 0; i < resolvedFullEventPromises.length; i++) {
                const fullItem = resolvedFullEventPromises[i];
                if (fullItem) {
                    assign(results[i], fullItem);
                }
            }
        });

        const loadedCalendarEvents = results.reduce<CalendarEvent[]>((agg, loadedEvent) => {
            // if one of the fetch promises returned null, then the reduce function fails and hence this null check is required.
            if (loadedEvent) {
                agg.push(loadedEvent);
            }
            return agg;
        }, []);
        /** While the date ranges do not overlap, some events can appear in multiple date ranges,
         * so we filter out the dupes here.
         */
        const dedupeLoadedCalendarEvents = uniqBy(loadedCalendarEvents, event => event.ItemId.Id);
        calendarEventsInEventsCacheReloaded(
            folderId,
            dedupeLoadedCalendarEvents,
            dateRangesToReload,
            forceReplace
        );

        return dedupeLoadedCalendarEvents;
    } else {
        return null;
    }

    return null;
}

function onLoadStateChanged(folderId: string, dateRange: DateRange) {
    return (calendarId: CalendarId, loadingState: CalendarEventsLoadingState) => {
        /** Never show loading spinner in UI during reload of calendars */
        if (loadingState !== 'Loading') {
            // dispatch a loadingCalendarEvents actions for each lock that has a lock on the folderId/ dateRange to
            // notify them of load state change
            getAllLockIds(folderId, dateRange).forEach(lockId => {
                loadingCalendarEvents(lockId, calendarId, loadingState);
            });
        }
    };
}

function getAllDateRangesForFolderIdToBeReloaded(folderId: string): DateRange[] {
    // TODO VSO 61683: Investigate fetchCalendarEventsForDateRange getting called with null date range
    const dateRangesBeingFetchedForFolder = getDateRangesBeingFetchedForFolder(folderId);
    const dateRangesBeingFetched = dateRangesBeingFetchedForFolder?.filter(
        dateRange => dateRange !== null
    );
    const lockedDateRanges = getAllLockedDateRanges(folderId);
    const allDateRanges = [...dateRangesBeingFetched, ...lockedDateRanges];
    const mergedLockedDateRanges = mergeAllOverlappingDateRanges(allDateRanges);

    return mergedLockedDateRanges;
}
