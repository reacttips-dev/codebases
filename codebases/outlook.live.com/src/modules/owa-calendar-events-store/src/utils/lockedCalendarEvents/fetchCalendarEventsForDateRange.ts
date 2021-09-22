import { getCalendarEventsForDateRange } from './getCalendarEventsForDateRange';
import {
    calendarEventsInDateRangeLoadedForLock,
    mergeEnhancedEventsIntoCache,
} from '../../actions/eventsCacheActions';
import { loadingCalendarEvents } from '../../actions/publicActions';
import { MAX_RETRIES_TO_LOAD_EVENTS_FOR_DATERANGE } from '../../constants';
import type { CalendarEventsLoadingState } from '../../types/CalendarEventsLoadingState';
import {
    getCalendarIdByFolderId,
    getCalculatedFolderIdForDefaultCalendar,
} from 'owa-calendar-cache';
import { logCacheUpdateForDiagnosticsAsync } from 'owa-calendar-cache-diagnostics';
import type CalendarEvent from 'owa-calendar-types/lib/types/CalendarEvent';
import { containsDateRange, DateRange, dateRangesOverlap } from 'owa-datetime-utils';
import { EventsCacheLockId, getEventsFromCache } from 'owa-events-cache';
import {
    loadCalendarEventsInDateRange,
    LoadingStateChangedCallback,
} from '../../services/loadCalendarEventsInDateRange';
import {
    getEventsCacheLockInfo,
    getAllLockedDateRanges,
    getEventsCache,
} from '../../selectors/eventsCacheSelectors';
import { isEnhancedDateRange, addToEnhancedDateRanges } from '../../store/EnhancedItemsMap';
import { trace } from 'owa-trace';
import type { LoadCalendarEventsInDateRangePromises } from '../../types/LoadCalendarEventsInDateRangePromises';
import { filterSeriesMasters } from '../filterSeriesMasters';
import type { CalendarId } from 'owa-graph-schema';

interface FetchingCalendarEventsInfo {
    dateRange: DateRange;
    requestPromises: LoadCalendarEventsInDateRangePromises;
    lockIds: string[];
}

const fetchingCalendarEventsInfoMap: { [folderId: string]: FetchingCalendarEventsInfo[] } = {};

function tryInitializeInfoList(folderId: string) {
    if (!fetchingCalendarEventsInfoMap[folderId]) {
        fetchingCalendarEventsInfoMap[folderId] = [];
    }
}
type FindFetchingCalendarEventsInfo =
    | { index: -1; info: null }
    | { index: number; info: FetchingCalendarEventsInfo };

function findFetchingCalendarEventsInfo(
    folderId: string,
    filter: (info: FetchingCalendarEventsInfo) => boolean
): FindFetchingCalendarEventsInfo {
    tryInitializeInfoList(folderId);

    const infoList = fetchingCalendarEventsInfoMap[folderId];
    for (let i = 0; i < infoList.length; i++) {
        if (filter(infoList[i])) {
            return { index: i, info: infoList[i] };
        }
    }

    return { index: -1, info: null };
}

function findFetchingCalendarEventsInfoForDateRange(
    folderId: string,
    dateRange: DateRange
): FindFetchingCalendarEventsInfo {
    return findFetchingCalendarEventsInfo(folderId, info =>
        containsDateRange(info.dateRange, dateRange, true /* inclusive */)
    );
}

function findFetchingCalendarEventsInfoForLock(
    folderId: string,
    lockId: string
): FindFetchingCalendarEventsInfo {
    return findFetchingCalendarEventsInfo(folderId, info => info.lockIds.indexOf(lockId) > -1);
}

function startedFetchingCalendarEvents(
    folderId: string,
    dateRange: DateRange,
    calendarViewRequests: LoadCalendarEventsInDateRangePromises
) {
    const { index, info } = findFetchingCalendarEventsInfoForDateRange(folderId, dateRange);
    if (index !== -1) {
        info.requestPromises = calendarViewRequests;
    }
}

function beforeStartFetchingCalendarEvents(lockId: string, folderId: string, dateRange: DateRange) {
    tryInitializeInfoList(folderId);

    fetchingCalendarEventsInfoMap[folderId].push({
        dateRange: dateRange,
        requestPromises: null,
        lockIds: [lockId],
    });
}

function endedFetchingCalendarEvents(folderId: string, dateRange: DateRange) {
    const { index } = findFetchingCalendarEventsInfoForDateRange(folderId, dateRange);

    if (index !== -1) {
        fetchingCalendarEventsInfoMap[folderId].splice(index, 1);
    }
}

export function getDateRangesBeingFetchedForFolder(folderId: string) {
    tryInitializeInfoList(folderId);

    return fetchingCalendarEventsInfoMap[folderId].map(info => info.dateRange);
}

export function fetchCalendarEventsForDateRange(
    lockId: EventsCacheLockId,
    folderId: string,
    dateRange: DateRange
): {
    fetchPromise: Promise<CalendarEvent[]>;
    enhancedFetchPromise?: Promise<Partial<CalendarEvent>[]>;
    events?: CalendarEvent[] | null;
} {
    const lockInfo = getEventsCacheLockInfo(lockId, folderId);
    if (dateRange === null) {
        // TODO VSO 61683: Investigate fetchCalendarEventsForDateRange getting called with null date range
        return {
            fetchPromise: new Promise<CalendarEvent[]>(async resolve => resolve([])),
        };
    }
    cancelExistingEnhancedRequestsForLock(folderId, dateRange, lockId);
    const { info: currentFetchingCalendarEventsInfo } = findFetchingCalendarEventsInfoForDateRange(
        folderId,
        dateRange
    );
    if (
        !lockInfo ||
        !lockInfo.lockedDateRange ||
        !containsDateRange(lockInfo.lockedDateRange, dateRange, true /* inclusive */)
    ) {
        const eventsFromCache = getEventsInDateRangeFromCacheIfExists(folderId, dateRange);

        // Events are in the cache, but not locked by our lock
        // If events are in the the cache, this means that the GCV++ events are loading,
        // OR they are already loaded, so we handle both of these cases.
        if (eventsFromCache) {
            // Events for the requested daterange were present in the cache from another lock
            const promise = handleCalendarEventsLoaded(
                lockId,
                folderId,
                dateRange,
                Promise.resolve(eventsFromCache),
                'existing'
            );

            // Detail (not necessarily relevant to big picture): This is DIFFERENT than the handling for the GCV events, notice how handleCalendarEventsLoaded is called above, but
            // we do not call handleEnhancedCalendarEventsLoaded here. The reason we have to call this handling code in the
            // GCV case but not the GCV++ case is because when we populate the data in the GCV case, we are updating the locked date
            // range for lockId. In the GCV++ case, we do a lock-agnostic update of items already in the cache,  meaning, it does not
            // make updates to the date range locked by a particular lock. Because of this, we do not have to do this
            // extra handling in this case
            let enhancedPromise = loadEnhancedEvents(
                eventsFromCache,
                folderId,
                dateRange,
                currentFetchingCalendarEventsInfo
            );

            promise?.then(result => {
                const calendarId = getCalendarIdByFolderId(folderId);
                loadingCalendarEvents(lockId, calendarId, 'Loaded');
            });

            return {
                fetchPromise: promise,
                enhancedFetchPromise: enhancedPromise,
                events: eventsFromCache,
            };
        }

        // If the lock does not have any events date range locked or the range
        // doesn't contain the requested date range or if there are no other locks
        // which are a superset of requested range, then fetch more from server.
        // If there is an existing request for the date range the enhanced promised
        // is guaranteed to be in a loading state so we only have to handle this case here
        if (currentFetchingCalendarEventsInfo?.requestPromises) {
            const {
                fetchPromise,
                enhancedFetchPromise,
            } = currentFetchingCalendarEventsInfo.requestPromises;
            // If there is already a request going for the same date range
            // then return the same request
            // add the lockId to the list of locks that are currently requesting info for the
            // folderId/ date range
            currentFetchingCalendarEventsInfo.lockIds.push(lockId);
            const promise = handleCalendarEventsLoaded(
                lockId,
                folderId,
                dateRange,
                fetchPromise?.then(events =>
                    // We filter the events to only ones that overlap with the requested
                    // date range because the existing request might have date range
                    // equal or bigger than the currently one existed.
                    events
                        ? events.filter(
                              ({ Start, End }) =>
                                  dateRangesOverlap(
                                      dateRange,
                                      { start: Start, end: End },
                                      true /* inclusive */
                                  ) == 0
                          )
                        : []
                ),
                'new'
            );

            const enhancedPromise = enhancedFetchPromise?.then(t =>
                filterEventsForDateRange(dateRange)(t)
            );

            return { fetchPromise: promise, enhancedFetchPromise: enhancedPromise, events: null };
        }
        // Add the data to the request info map before fetching, because we need this data to be populated before
        // onLoadStateChanged is triggered
        beforeStartFetchingCalendarEvents(lockId, folderId, dateRange);
        const fetchCalendarEventsFromServerRequest = fetchCalendarEventsFromServer(
            folderId,
            dateRange,
            onLoadStateChanged(folderId, dateRange)
        );

        const fetchPromise = fetchCalendarEventsFromServerRequest?.fetchPromise;
        const enhancedFetchPromise = fetchCalendarEventsFromServerRequest?.enhancedFetchPromise;

        // Add the promise to the request info map
        startedFetchingCalendarEvents(folderId, dateRange, fetchCalendarEventsFromServerRequest);

        const promise = handleCalendarEventsLoaded(
            lockId,
            folderId,
            dateRange,
            fetchPromise,
            'new'
        );

        // GCV++ events loading from the server handling
        const enhancedPromise = handleEnhancedCalendarEventsLoaded(
            folderId,
            dateRange,
            enhancedFetchPromise,
            promise
        );
        return { fetchPromise: promise, enhancedFetchPromise: enhancedPromise, events: null };
    } else {
        // The date range requested already exists in the cache so return that
        // Items are in the cache AND locked by our instance.
        const calendarId = getCalendarIdByFolderId(folderId);
        loadingCalendarEvents(lockId, calendarId, 'Loaded');
        const eventsForDateRange = getCalendarEventsForDateRange(lockId, folderId, dateRange);

        let enhancedPromise = loadEnhancedEvents(
            eventsForDateRange,
            folderId,
            dateRange,
            currentFetchingCalendarEventsInfo
        );

        return {
            fetchPromise: Promise.resolve(eventsForDateRange),
            enhancedFetchPromise: enhancedPromise,
            events: eventsForDateRange,
        };
    }
}

function loadEnhancedEvents(
    eventsFromCache: CalendarEvent[],
    folderId: string,
    dateRange: DateRange,
    currentFetchingCalendarEventsInfo: FetchingCalendarEventsInfo
) {
    let enhancedPromise = null;

    // Only fetching calendarView++ events for primary calendar until below support is added
    // https://outlookweb.visualstudio.com/Outlook%20Web/_workitems/edit/62868
    if (folderId === getCalculatedFolderIdForDefaultCalendar()) {
        // We need to check `eventsFromCache` below because the enhanced data date range map can be stale and therefor not representative of the events
        // we have in the cache. This check can be removed once we complete TODO VSO 86974: [GCV++ - CalendarCache] Cleanup the date ranges in enhancedItemsMap once they are released from a lock.
        if (isEnhancedDateRange(folderId, dateRange) && eventsFromCache) {
            // If the GCV++ events are loaded, return the items from the cache
            enhancedPromise = Promise.resolve(eventsFromCache);
        } else if (currentFetchingCalendarEventsInfo?.requestPromises?.enhancedFetchPromise) {
            // If the GCV ++ events are not loaded, but GCV events are loaded this should mean that
            // the GCV++ events are loading
            const { enhancedFetchPromise } = currentFetchingCalendarEventsInfo.requestPromises;
            enhancedPromise = enhancedFetchPromise.then(filterEventsForDateRange(dateRange));
        } else {
            trace.warn(
                '[loadEnhancedEvents] - Failed to load GetCalendarView++ events on an existing lock.'
            );
        }
    }

    return enhancedPromise;
}

function onLoadStateChanged(folderId: string, dateRange: DateRange) {
    return (calendarId: CalendarId, loadingState: CalendarEventsLoadingState) => {
        const { index, info } = findFetchingCalendarEventsInfoForDateRange(folderId, dateRange);

        if (index !== -1) {
            // dispatch a loadingCalendarEvents actions for each lock that has requested data to
            // notify them of load state change
            info.lockIds.forEach(lockId => {
                loadingCalendarEvents(lockId, calendarId, loadingState);
            });
        }
    };
}

function fetchCalendarEventsFromServer(
    folderId: string,
    dateRange: DateRange,
    onLoadStateChangedCallback: LoadingStateChangedCallback
): {
    fetchPromise: Promise<CalendarEvent[]>;
    enhancedFetchPromise: Promise<Partial<CalendarEvent>[]>;
} {
    const promises = loadCalendarEventsInDateRange(
        dateRange,
        folderId,
        onLoadStateChangedCallback,
        MAX_RETRIES_TO_LOAD_EVENTS_FOR_DATERANGE
    );
    const fetchPromise = (async () => {
        try {
            // disabling tslint rule as we need to await here
            // for the finally block to work properly
            // https://github.com/palantir/tslint/issues/3933
            // tslint:disable-next-line:no-return-await
            return await promises?.fetchPromise;
        } finally {
            endedFetchingCalendarEvents(folderId, dateRange);
        }
    })();
    return { fetchPromise: fetchPromise, enhancedFetchPromise: promises?.enhancedFetchPromise };
}

async function handleCalendarEventsLoaded(
    lockId: EventsCacheLockId,
    folderId: string,
    dateRange: DateRange,
    fetchPromise: Promise<CalendarEvent[]>,
    diagnosticMessageSuffix: 'existing' | 'new'
): Promise<CalendarEvent[]> {
    const result = await fetchPromise;

    // Log to diagnostics panel
    const diagnosticMessageItemsLength = result ? result.length : 'no';
    logCacheUpdateForDiagnosticsAsync({
        lockId: lockId,
        updateMessage: `Fetched ${diagnosticMessageItemsLength} ${diagnosticMessageSuffix} items for date range: ${dateRange.start} - ${dateRange.end}`,
    });

    if (result) {
        calendarEventsInDateRangeLoadedForLock(lockId, folderId, dateRange, result);
    }

    return result;
}

// NOTE: this is lock agnostic, and it can be lock agnostic, because we are updating previously locked data here.
async function handleEnhancedCalendarEventsLoaded(
    folderId: string,
    dateRange: DateRange,
    enhancedFetchPromise: Promise<Partial<CalendarEvent>[]>,
    fetchPromiseHandler: Promise<CalendarEvent[]>
) {
    // We wait for the fetch promise handler for regular events to finish before handling the promise for enhanced events
    // to ensure that calendar events are in the cache before trying to merge in GCV++ results.
    const [enhancedEvents] = await Promise.all([enhancedFetchPromise, fetchPromiseHandler]);

    if (enhancedEvents) {
        // We have ++ events for this date range
        addToEnhancedDateRanges(folderId, dateRange);
        mergeEnhancedEventsIntoCache(enhancedEvents);
    }

    return enhancedEvents;
}

function getEventsInDateRangeFromCacheIfExists(folderId: string, dateRange: DateRange) {
    const allDateRanges = getAllLockedDateRanges(folderId);
    const cache = getEventsCache(folderId);
    const dateRangePresentInCache = allDateRanges.some(dateRangeEntry =>
        containsDateRange(dateRangeEntry, dateRange, true)
    );

    if (dateRangePresentInCache && cache) {
        return (
            // return a copy of the events here, so that exists events are not modified
            filterSeriesMasters(getEventsFromCache(dateRange, cache.events)).map(event => ({
                ...event,
            }))
        );
    } else {
        return null;
    }
}

function filterEventsForDateRange(dateRange: DateRange) {
    return (events: Partial<CalendarEvent>[]) =>
        events
            ? events.filter(({ Start, End }) =>
                  Start && End
                      ? dateRangesOverlap(
                            dateRange,
                            { start: Start, end: End },
                            true /* inclusive */
                        ) == 0
                      : false
              )
            : [];
}

/**
 * This function finds if there is an existing request out for the specified lockId/ folderId with
 * a different date range and cancels the request. We do not cancel the request if it overlaps with the
 * current request or if another lock consumer has locked the date range.
 *
 * @param folderId
 * @param dateRange
 * @param lockId
 */
function cancelExistingEnhancedRequestsForLock(
    folderId: string,
    dateRange: DateRange,
    lockId: string
) {
    const { info: currentLockFetchingInfo } = findFetchingCalendarEventsInfoForLock(
        folderId,
        lockId
    );
    if (currentLockFetchingInfo) {
        const isLockedByOnlyOneConsumer = currentLockFetchingInfo.lockIds.length == 1;
        const currentRequestedDateRangeContainsNewDateRange = containsDateRange(
            currentLockFetchingInfo.dateRange,
            dateRange,
            true /* inclusive */
        );
        if (isLockedByOnlyOneConsumer && !currentRequestedDateRangeContainsNewDateRange) {
            currentLockFetchingInfo.requestPromises?.cancelEnhancedFetchPromise?.();
        }
    }
}
