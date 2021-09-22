import type CalendarEvent from 'owa-calendar-types/lib/types/CalendarEvent';
import EventScope from 'owa-service/lib/contract/EventScope';
import { assertNever } from 'owa-assert';
import { hasReadRights } from 'owa-calendar-event-capabilities';
import type { ClientItemId } from 'owa-client-ids';
import type { EventsCacheLockId } from 'owa-events-cache';
import { FullItemInfo, FullItemLoadState } from '../../store/schema/FullItemsMruMap';
import { loadCalendarEvent, LoadCalendarEventResponse } from './loadCalendarEvent';
import { logUsage } from 'owa-analytics';
import { MAX_RETRIES_TO_LOAD_CALENDAR_EVENT_FROM_SERVER } from '../../constants';
import { trace, TraceErrorObject } from 'owa-trace';
import {
    getFullItemInfoFromMRU,
    getFullItemInfoForLockMRU,
    getCurrentOrDefaultFullItemResponseShapeType,
    getDefaultFullItemResponseShapeType,
} from '../../selectors/fullItemInfoSelectors';
import {
    getCalendarEventWithKey,
    getCalendarEventWithId,
} from '../../selectors/calendarFolderEventsSelectors';
import {
    fetchingFullCalendarEventForLock,
    fetchingFullCalendarEventForLockFailed,
    fullCalendarEventLoadedForLock,
    fullCalendarEventWasUsed,
    removeCalendarEventsFromEventsCacheMatchingFilter,
} from '../../actions/eventsCacheActions';
import { calendarEventUpdated } from '../../actions/publicActions';
import type { FetchFullCalendarEventCustomData } from '../../types/FetchFullCalendarEventCustomData';
import getEventKey, { getSeriesMasterEventKeyFromInstance } from '../../utils/getEventKey';
import cloneDeep from 'lodash-es/cloneDeep';
import { toJS } from 'mobx';
import type { CalendarEventItemResponseShapeType } from 'owa-calendar-services/lib/schema/CalendarEventItemResponseShapeType';

// The map of ongoing requests to server for fetching a full item.
// This map is maintained so if a request to fetch full item comes
// in while there is an ongoing request to server then we return the
// same promise instead of sending another request to the server.
const fetchingFullItemPromises: { [eventKey: string]: Promise<LoadCalendarEventResponse> } = {};

// TODO VSO 84049: Use request queue for fetchFullCalendarEvent current request tracking
function startedFetchingFullItem(
    eventKey: string,
    itemResponseShapeType: CalendarEventItemResponseShapeType,
    fetchPromise: Promise<LoadCalendarEventResponse>
) {
    const reqKey = getRequestKey(eventKey, itemResponseShapeType);
    fetchingFullItemPromises[reqKey] = fetchPromise;
}

function endedFetchingFullItem(
    eventKey: string,
    itemResponseShapeType: CalendarEventItemResponseShapeType
) {
    const reqKey = getRequestKey(eventKey, itemResponseShapeType);
    delete fetchingFullItemPromises[reqKey];
}

function getRequestKey(
    eventKey: string,
    itemResponseShapeType: CalendarEventItemResponseShapeType
): string {
    return eventKey + itemResponseShapeType;
}

function getPromiseForFetchingFullItem(
    eventKey: string,
    itemResponseShapeType: CalendarEventItemResponseShapeType
): Promise<LoadCalendarEventResponse> {
    const reqKey = getRequestKey(eventKey, itemResponseShapeType);
    return (
        fetchingFullItemPromises[reqKey] ||
        Promise.resolve({
            calendarEvent: null,
            error: 'Could not find full event promise in existing promises',
        })
    );
}

export type GetExistingCalendarEvent = (itemId: ClientItemId) => CalendarEvent | null;

export type FetchFullCalendarEventResult = {
    event: CalendarEvent;
    fullEventPromise: Promise<CalendarEvent>;
} | null;

const enum FullEventPromiseSource {
    Server,
    ExistingPartialEvent,
    ExistingFullEvent,
}

type FetchFullCalendarEventData = {
    promiseSource: FullEventPromiseSource;
    event: CalendarEvent;
    fullEventPromise: Promise<LoadCalendarEventResponse>;
};

/**
 * Returns a full item from cache if available.
 * If not, returns a partial item and kicks off the retrieval to replace it with a full item
 *
 * @param lockId The lock id for which to fetch the full calendar event
 * @param eventId The Id of the item to retrieve
 * @param folderId The folder id of the item
 * @param getExistingCalendarEvent The function that returns calendar event if its already there
 * @param customData data added to the FullCalendarEventLoaded Datapoint when logging
 * @param itemResponseShapeType the itemResponseShapeType of event to fetch.
 */
export function fetchFullCalendarEvent(
    lockId: EventsCacheLockId,
    eventId: ClientItemId,
    folderId: string | null = null,
    getExistingCalendarEvent: GetExistingCalendarEvent,
    customData: FetchFullCalendarEventCustomData = { fetchSource: 'unknown' },
    itemResponseShapeType?: CalendarEventItemResponseShapeType
): FetchFullCalendarEventResult {
    const getCalendarEvent = createGetCalendarEventFunc(folderId, getExistingCalendarEvent);
    if (!itemResponseShapeType) {
        // If itemResponseShapeType is not provided the shape type of loading/loaded event is used, If not provided and the event is not loaded/loading, the default shape is used
        itemResponseShapeType = getCurrentOrDefaultFullItemResponseShapeType(eventId.Id);
    }
    const fullItemInfo = getFullItemInfoFromMRU(eventId.Id, itemResponseShapeType);

    let fetchData: FetchFullCalendarEventData;
    if (fullItemInfo) {
        // If a full item info is already present then that means
        // the full calendar event should also be present so we
        // try to get that
        folderId = folderId || fullItemInfo.folderId;
        fetchData = getFullCalendarEvent(
            folderId,
            eventId,
            fullItemInfo,
            false /**fetchMasterItemFromOccurence */,
            getCalendarEvent,
            itemResponseShapeType
        );
    } else {
        const event = getCalendarEvent(eventId);

        // If we dont have the partial event or if we can read then send a request to server
        // to get the full calendar event
        // this can return null if the service request fails
        const promiseInfo = tryFetchFullCalendarEventFromServerIfCanReadEvent(
            event,
            eventId,
            false /**fetchMasterItemFromOccurence */,
            folderId || event?.ParentFolderId?.Id || null,
            itemResponseShapeType
        );

        fetchData = {
            event,
            ...promiseInfo,
        };
    }
    let result: FetchFullCalendarEventResult = null;
    if (fetchData) {
        folderId = folderId || fetchData.event?.ParentFolderId?.Id || null;

        result = {
            event: fetchData.event,
            fullEventPromise: handleLoadingCalendarEvent(
                fetchData.fullEventPromise,
                fetchData.promiseSource,
                fetchData.event,
                lockId,
                folderId,
                customData,
                eventId.Id,
                false /** fetchMasterItemFromOccurence */,
                itemResponseShapeType
            ),
        };
    }
    return result;
}

/**
 * Returns a full/ partial series master event from cache if available.
 * Kicks off the retrieval to get the series master event.
 *
 * @param lockId The lock id for which to fetch the full calendar event
 * @param instanceEventId The Id of the calendar event instance for which we want to fetch the series master event
 * @param folderId The folder id of the item
 * @param getExistingCalendarEvent The function that returns calendar event instance its already there
 * @param customData data added to the FullCalendarEventLoaded Datapoint when logging
 * @param itemResponseShapeType the itemResponseShapeType of event to fetch.
 */
export function fetchFullSeriesMasterCalendarEventFromEventInstance(
    lockId: EventsCacheLockId,
    instanceEventId: ClientItemId,
    folderId: string | null = null,
    getExistingCalendarEvent: GetExistingCalendarEvent,
    customData: FetchFullCalendarEventCustomData = { fetchSource: 'unknown' },
    itemResponseShapeType?: CalendarEventItemResponseShapeType
): FetchFullCalendarEventResult {
    const getCalendarEvent = createGetCalendarEventFunc(folderId, getExistingCalendarEvent);

    let fetchData: FetchFullCalendarEventData;
    const instanceEvent = getCalendarEvent(instanceEventId);
    folderId = folderId || instanceEvent?.ParentFolderId?.Id;
    /** Notice that in this case the eventKey is not guarenteed to be defined before we start
     * fetching. This is because we are using the occurrence id to fetch the series master item.
     * So, unless we have previously fetched the occurrence (in which case we will know the SeriesMasterItemId),
     * we will not know the eventKey untill request finishes
     */
    const eventKey = instanceEvent && getSeriesMasterEventKeyFromInstance(instanceEvent);
    if (!itemResponseShapeType) {
        // If itemResponseShapeType is not provided the shape type of loading/loaded event is used, If not provided and the event is not loaded/loading, the default shape is used
        itemResponseShapeType = eventKey
            ? getCurrentOrDefaultFullItemResponseShapeType(eventKey)
            : getDefaultFullItemResponseShapeType();
    }
    fetchData = getSeriesMasterFullCalendarEvent(
        folderId,
        instanceEventId,
        itemResponseShapeType,
        eventKey,
        instanceEvent
    );
    let result: FetchFullCalendarEventResult = null;
    if (fetchData) {
        folderId = folderId || fetchData.event?.ParentFolderId?.Id || null;

        result = {
            event: fetchData.event,
            fullEventPromise: handleLoadingCalendarEvent(
                fetchData.fullEventPromise,
                fetchData.promiseSource,
                fetchData.event,
                lockId,
                folderId,
                customData,
                eventKey,
                true /** fetchMasterItemFromOccurence */,
                itemResponseShapeType
            ),
        };
    }

    return result;
}

function createGetCalendarEventFunc(
    folderId: string | null,
    getExistingCalendarEvent: GetExistingCalendarEvent
) {
    return (eventId: ClientItemId) => {
        const event: CalendarEvent = getCalendarEventWithId(eventId.Id, folderId);

        return event || getExistingCalendarEvent?.(eventId);
    };
}

function getFullCalendarEvent(
    folderId: string,
    itemId: ClientItemId,
    fullItemInfo: FullItemInfo,
    fetchMasterItemFromOccurence: boolean,
    getExistingCalendarEvent: GetExistingCalendarEvent,
    itemResponseShapeType: CalendarEventItemResponseShapeType
): FetchFullCalendarEventData {
    const event: CalendarEvent = getExistingCalendarEvent(itemId);
    switch (fullItemInfo.loadState) {
        case FullItemLoadState.Loaded:
            // As the full item is already loaded so return that directly
            return {
                event,
                fullEventPromise: Promise.resolve({ calendarEvent: event, error: null }),
                promiseSource: FullEventPromiseSource.ExistingFullEvent,
            };
        case FullItemLoadState.Loading:
            // The full item is currently loading so return the same promise
            return {
                event,
                fullEventPromise: getPromiseForFetchingFullItem(itemId.Id, itemResponseShapeType),
                promiseSource: FullEventPromiseSource.Server,
            };
        case FullItemLoadState.Error:
            // There was error in previous request to fetch full item so fetch it again
            // If we dont have the partial event or if we can read then send a request to server
            // to get the full calendar event
            const promiseInfo = tryFetchFullCalendarEventFromServerIfCanReadEvent(
                event,
                itemId,
                fetchMasterItemFromOccurence,
                folderId,
                itemResponseShapeType
            );

            return {
                event,
                ...promiseInfo,
            };
        default:
            return assertNever(fullItemInfo.loadState);
    }
}

/**
 * Get the `FetchFullCalendarEvent` data for the series master calendar events,
 * when we have information about the instance
 *
 * @param folderId folderId of the instance event
 * @param instanceItemId itemId of the instance calendar event
 * @param eventKey the event key used to store the series master item in the cache,
 * this should be the .SeriesMasterId.Id of the instance event
 * @param instanceEvent the instance event from which we want to get the series master
 * @returns FetchFullCalendarEvent
 *
 * If the series master event is loaded:
 * event: series master calendar event
 * fullEventPromise:a promise that resolves with that event.
 *
 * If the series master event is loading, it returns:
 * event: series master calendar event OR a copy of the instance calendar event with the itemId of the SeriesMasterItemId.
 * fullEventPromise: existing promise
 *
 * If the series master event is not loaded, it returns:
 * event: A copy of the instance calendar event with the itemId of the SeriesMasterItemId, or undefined if we do not have this item
 * fullEventPromise: a new promise to get the series master event
 */
function getSeriesMasterFullCalendarEvent(
    folderId: string,
    instanceItemId: ClientItemId,
    itemResponseShapeType: CalendarEventItemResponseShapeType,
    eventKey?: string,
    instanceEvent?: CalendarEvent
): FetchFullCalendarEventData {
    // Get the full item info for the series master based on instance key
    const fullItemInfo = eventKey && getFullItemInfoFromMRU(eventKey, itemResponseShapeType);

    if (fullItemInfo && fullItemInfo.loadState === FullItemLoadState.Loaded) {
        // As we know that full item is already loaded so get it directly from cache
        const event = getCalendarEventWithKey(eventKey, folderId);
        return {
            event: event,
            fullEventPromise: Promise.resolve({ calendarEvent: event, error: null }),
            promiseSource: FullEventPromiseSource.ExistingFullEvent,
        };
    } else if (fullItemInfo && fullItemInfo.loadState === FullItemLoadState.Loading) {
        // The request to fetch full item is ongoing so we return the same promise
        const event =
            getCalendarEventWithKey(eventKey, folderId) ||
            getSeriesMasterLocalLieFromInstance(instanceEvent);
        return {
            event: event,
            fullEventPromise: getPromiseForFetchingFullItem(eventKey, itemResponseShapeType),
            promiseSource: FullEventPromiseSource.Server,
        };
    } else {
        // Fetch the full calendar event for series master from server
        return {
            // As we are fetching a the series master we clone existing event and return so it later can be updated with full series master event.
            event: getSeriesMasterLocalLieFromInstance(instanceEvent),
            fullEventPromise: fetchFullCalendarEventFromServer(
                instanceItemId,
                true /**fetchMasterItemFromOccurence */,
                folderId,
                itemResponseShapeType
            ),
            promiseSource: FullEventPromiseSource.Server,
        };
    }
}

/**
 * Gets a copy of the instance calendar event with the series master item id,
 * which can be used as a local lie while the full series master calendar event is loading.
 *
 * @param instanceEvent instance of a series
 */
function getSeriesMasterLocalLieFromInstance(instanceEvent: CalendarEvent): CalendarEvent {
    // note that neither cloneDeep nor toJS are sufficient alone for this. toJS does not actually clone properties that are not mobx observables,
    // leaving some properties between instance and local lie to share same object reference. cloneDeep will break some mobx properties like observable
    // arrays. Combining both keeps everything functional
    return (
        instanceEvent && {
            ...cloneDeep(toJS(instanceEvent)),
            ItemId: { ...instanceEvent?.SeriesMasterItemId },
            CalendarItemType: 'RecurringMaster',
        }
    );
}

function tryFetchFullCalendarEventFromServerIfCanReadEvent(
    event: CalendarEvent,
    itemId: ClientItemId,
    fetchMasterItemFromOccurence: boolean,
    folderId: string,
    itemResponseShapeType: CalendarEventItemResponseShapeType
): Pick<FetchFullCalendarEventData, 'fullEventPromise' | 'promiseSource'> {
    // If the Effective rights is undefined it means we are unsure of the rights and hence make the server call anyways.
    return !event || !event.EffectiveRights || hasReadRights(event)
        ? {
              fullEventPromise: fetchFullCalendarEventFromServer(
                  itemId,
                  fetchMasterItemFromOccurence,
                  folderId,
                  itemResponseShapeType
              ),
              promiseSource: FullEventPromiseSource.Server,
          }
        : {
              fullEventPromise: Promise.resolve({ calendarEvent: event, error: null }),
              promiseSource: FullEventPromiseSource.ExistingPartialEvent,
          };
}

/**
 * handles the logging, loading state changes, and cache updates that
 * take place when we load a full item.
 *
 * @param loadCalendarEventPromise promise to load the calendar event
 * @param loadCalendarEventPromiseSource promise source
 * @param existingEvent existing calendar event
 * @param lockId lockId
 * @param folderId folder id of the event
 * @param customData customData
 * @param eventKey the event key which the item will be cached under, if none is provided, the calendar item id
 * will be used when the request completes
 * @param fetchMasterItemFromOccurence flag to indicate whether we are fetching the series master calendar event from an
 * occurrence.
 */
export async function handleLoadingCalendarEvent(
    loadCalendarEventPromise: Promise<LoadCalendarEventResponse>,
    loadCalendarEventPromiseSource: FullEventPromiseSource,
    existingEvent: CalendarEvent | null,
    lockId: EventsCacheLockId,
    folderId: string | null,
    customData: FetchFullCalendarEventCustomData,
    eventKey: string | undefined,
    fetchMasterItemFromOccurence: boolean,
    itemResponseShapeType: CalendarEventItemResponseShapeType
): Promise<CalendarEvent> {
    let fullItemInfo = getFullItemInfoForLockMRU(lockId, eventKey, itemResponseShapeType);
    let calendarEvent = null;
    let error = null;
    let responseCode = null;
    try {
        trace.info(
            `[fetchFullCalendarEvent] Handling loading full calendar event Key: ${eventKey}, Lock: ${lockId}`
        );

        if (folderId && (!fullItemInfo || fullItemInfo.loadState !== FullItemLoadState.Loaded)) {
            // We only call the fetching full calendar event if the full item is not present,
            // if its not already loaded or if it was not already locked by the current lock
            // EventKey can be undefined in the case where we do not know the itemId of the item we are fetching.
            // (i.e. when we fetch a series master calendar event from the id of an instance event, and the instance event not cached)
            // Notice, in these cases the event is not ever set to the loading state.
            if (eventKey) {
                trace.info(
                    `[fetchFullCalendarEvent] Loading full calendar event Key: ${eventKey}, Lock: ${lockId}`
                );
                startedFetchingFullItem(eventKey, itemResponseShapeType, loadCalendarEventPromise);
                fetchingFullCalendarEventForLock(
                    lockId,
                    folderId,
                    eventKey,
                    itemResponseShapeType,
                    existingEvent
                );
            }
        }

        // if the fullEvent is already present in the MRU but not for this lock, then we will be trying to fetch again from a resolved promise.
        // However in that case, we do not want to await on the promise, as awaiting on it can lead to race conditions where another fetch call comes for the same event
        // and even before the await is finished, it tries to look up for that event when its in loading state and does not find any pending promise.
        if (loadCalendarEventPromiseSource == FullEventPromiseSource.ExistingFullEvent) {
            calendarEvent = existingEvent;
        } else {
            const loadCalendarEventResponse = await loadCalendarEventPromise;
            calendarEvent = loadCalendarEventResponse?.calendarEvent;
            error = loadCalendarEventResponse?.error;
            responseCode = loadCalendarEventResponse?.responseCode;
            if (eventKey === undefined) {
                /**
                 * If the eventKey is undefined, we set it to the calendar event id
                 */
                eventKey = getEventKey(loadCalendarEventResponse.calendarEvent);
            }
        }

        if (!calendarEvent) {
            // A null event returned from loadCalendarEvent represents that fetching full calendar
            // event failed so we throw error here. It will be handled properly (in the catch section) by marking
            // the full item info as failed so that next time a request for fetchFullCalendarEvent comes
            // it will fetch from server. The promise returned back to the caller will also throw so it can be handled
            // properly by client.
            const traceError: TraceErrorObject = new Error(
                `[fetchFullCalendarEvent] Action source:${
                    customData.fetchSource
                } with response code: ${responseCode ?? '<null>'} and error: ${error}`
            );
            if (responseCode) {
                traceError.responseCode = responseCode;
                traceError.fetchErrorType = 'ServerFailure';
            }
            traceError.diagnosticInfo = JSON.stringify({ responseCode, eventKey });
            throw traceError;
        }

        const calendarEventFolderId = folderId || calendarEvent.ParentFolderId.Id;

        // Get the full item info again as the previous fetched `fullItemInfo` might
        // be invalid because it was before the await so it might have
        // changed by now
        const prevFullItemInfo = fullItemInfo;
        fullItemInfo = getFullItemInfoForLockMRU(lockId, eventKey, itemResponseShapeType);

        if (
            calendarEventFolderId &&
            (!fullItemInfo || fullItemInfo.loadState !== FullItemLoadState.Loaded)
        ) {
            trace.info(
                `[fetchFullCalendarEvent] Loaded full calendar event Key: "${eventKey}", Lock: "${lockId}", FolderId: "${calendarEventFolderId}"`
            );

            logUsage('FullCalendarEventLoaded', {
                eventKey,
                lockId,
                prevFullItemLoadState: prevFullItemInfo ? prevFullItemInfo.loadState : null,
                fullItemLoadState: fullItemInfo ? fullItemInfo.loadState : null,
                isFullItem: calendarEvent.RequiredAttendees !== undefined,
                isSameAsExistingEvent: existingEvent === calendarEvent,
                eventScope: fetchMasterItemFromOccurence
                    ? EventScope.AllInstancesInSeries
                    : EventScope.Default,
                errorMessage: null,
                ...customData,
            });

            // As the event can be a full event returned from server we need to force override
            // all the properties returned from the server even though they might be undefined so that
            // no properties from the partial event lingers e.g. in case of master full item we use
            // the instance item as partial and we don't want any of its properties to be part of
            // master item when it gets loaded.
            const forceOverrideAllPropertiesForEventIfAvailable =
                loadCalendarEventPromiseSource === FullEventPromiseSource.Server;
            fullCalendarEventLoadedForLock(
                lockId,
                calendarEventFolderId,
                eventKey,
                itemResponseShapeType,
                calendarEvent,
                fetchMasterItemFromOccurence /** hasEventsDatesChanged is true when fetchMasterItemFromOccurence because in this case fetchingFullCalendarEventForLock
                is called with an instance of the series with the series master id (and the series master can have different dates then the instance).
                So we pass the correct flag here so that cache can update accordingly if the the time has been changed. */,
                forceOverrideAllPropertiesForEventIfAvailable
            );
        } else {
            trace.info(
                `[fetchFullCalendarEvent] Full calendar event already loaded. EventKey: "${eventKey}", Lock: "${lockId}", FolderId: "${calendarEventFolderId}"`
            );
            fullCalendarEventWasUsed(lockId, eventKey);
        }

        const eventWithKey = getCalendarEventWithKey(eventKey, folderId);

        if (eventWithKey) {
            calendarEventUpdated(eventWithKey);
        }

        return eventWithKey;
    } catch (error) {
        const prevFullItemInfo = fullItemInfo;
        fullItemInfo = getFullItemInfoForLockMRU(lockId, eventKey, itemResponseShapeType);
        logUsage('FullCalendarEventLoaded', {
            eventKey,
            lockId,
            prevFullItemLoadState: prevFullItemInfo ? prevFullItemInfo.loadState : null,
            fullItemLoadState: fullItemInfo ? fullItemInfo.loadState : null,
            isFullItem: false,
            isSameAsExistingEvent: false,
            eventScope: fetchMasterItemFromOccurence
                ? EventScope.AllInstancesInSeries
                : EventScope.Default,
            errorMessage: error.toString(),
            ...customData,
        });

        if (folderId) {
            if (error.responseCode === 'ErrorItemNotFound') {
                removeCalendarEventsFromEventsCacheMatchingFilter(
                    folderId,
                    event => getEventKey(event) === eventKey
                );
            } else {
                fetchingFullCalendarEventForLockFailed(
                    lockId,
                    folderId,
                    eventKey,
                    itemResponseShapeType
                );
            }
        }
        throw error;
    } finally {
        endedFetchingFullItem(eventKey, itemResponseShapeType);
    }
}

function fetchFullCalendarEventFromServer(
    itemId: ClientItemId,
    fetchMasterItemFromOccurence: boolean,
    parentFolderId: string,
    itemResponseShapeType: CalendarEventItemResponseShapeType
) {
    const fullEventPromise = (() => {
        return loadCalendarEventWithRetries(
            MAX_RETRIES_TO_LOAD_CALENDAR_EVENT_FROM_SERVER,
            itemId,
            fetchMasterItemFromOccurence,
            parentFolderId,
            itemResponseShapeType
        );
    })();

    return fullEventPromise;
}

async function loadCalendarEventWithRetries(
    maxRetries: number,
    itemId: ClientItemId,
    fetchMasterItemFromOccurence: boolean,
    parentFolderId: string,
    itemResponseShapeType: CalendarEventItemResponseShapeType
): Promise<LoadCalendarEventResponse> {
    let currentTry = 0;

    while (currentTry < maxRetries) {
        try {
            const response = await loadCalendarEvent(
                itemId,
                parentFolderId,
                itemResponseShapeType,
                fetchMasterItemFromOccurence
            );
            currentTry++;
            if (!response.error || currentTry >= maxRetries) {
                // If there is some response returned then return that immediately
                // or if we have exceeded the retries then just return
                return response;
            }
        } catch (error) {
            trace.warn(
                `[fetchFullCalendarEvent] Received error when trying to load calendar event from server for "${
                    itemId.Id
                }" with try ${currentTry}: Error ${error.toString()}`
            );

            currentTry++;
            if (currentTry >= maxRetries || error.responseCode === 'ErrorItemNotFound') {
                // If we have exceeded the retries or the item DNE server side then we re-throw the error
                throw error;
            }
        }
    }

    // We should not reach here, we should always return before this.
    return {
        calendarEvent: null,
        error: 'Error: Unable to fetch event',
    };
}
