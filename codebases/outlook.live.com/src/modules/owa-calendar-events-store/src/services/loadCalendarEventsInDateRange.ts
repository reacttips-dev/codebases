import type { CalendarEntry, CalendarId, LocalCacheForRemoteCalendarEntry } from 'owa-graph-schema';
import {
    getCalendarEntryByCalendarId,
    getCalendarEntryByFolderId,
    getCalendarIdByFolderId,
    getCalculatedFolderIdForDefaultCalendar,
    isLocalCalendarEntry,
    isValidCalendarEntry,
} from 'owa-calendar-cache';

import type CalendarEvent from 'owa-calendar-types/lib/types/CalendarEvent';
import type { CalendarEventsLoadingState } from '../types/CalendarEventsLoadingState';
import CalendarFolderTypeEnum from 'owa-service/lib/contract/CalendarFolderTypeEnum';
import type { DateRange } from 'owa-datetime-utils';
import type { LoadCalendarEventsInDateRangePromises } from '../types/LoadCalendarEventsInDateRangePromises';
import { calendarEvent, calendarEventFromBirthdayEvent } from 'owa-calendar-event-converter';
import getBirthdayCalendarViewService from 'owa-calendar-services/lib/services/getBirthdayCalendarViewService';
import getCalendarViewService from 'owa-calendar-services/lib/services/getCalendarViewService';
import getTeamsCalendarViewService from 'owa-calendar-services/lib/services/getTeamsCalendarViewService';
import { getUserAvailabilityService } from 'owa-availability-service';
import { isFeatureEnabled } from 'owa-feature-flags';
import { isLinkedCalendarEntry, extractTrueProperty } from 'owa-calendar-properties';
import { lazyGetCalendarEventsFromRest } from '../index';
import { removeCalendarEventsInLoadedDateRange } from '../utils/removeCalendarEventsInLoadedDateRange';
import { syncSurfaceStoreWithCache } from '../utils/syncSurfaceStoreWithCache';
import { trace } from 'owa-trace';
import { updateCalendarWorkingHours } from '../mutators/calendarWorkingHoursMutator';
import { loadCalendarEventsInDateRangeV2 } from './loadCalendarEventsInDateRangeV2';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import { getUserConfiguration } from 'owa-session-store';
import { getEwsRequestString } from 'owa-datetime';

export type LoadingStateChangedCallback = (
    calendarId: CalendarId,
    loadingState: CalendarEventsLoadingState
) => void;

export function loadCalendarEventsInDateRange(
    dateRange: DateRange,
    folderId: string,
    onLoadingStateChanged: LoadingStateChangedCallback,
    retryCount: number = 0
): LoadCalendarEventsInDateRangePromises {
    if (isFeatureEnabled('mon-cal-loadEventsViaGql')) {
        return loadCalendarEventsInDateRangeV2(
            dateRange,
            folderId,
            onLoadingStateChanged,
            retryCount
        );
    }
    const gcvPromise = getCalendarViewEventsInDateRange(
        dateRange,
        folderId,
        onLoadingStateChanged,
        retryCount
    );

    return {
        fetchPromise: gcvPromise,
        ...getEnhancedData(folderId, dateRange),
    };
}

function getEnhancedData(folderId: string, dateRange: DateRange) {
    if (
        isFeatureEnabled('cal-mf-noPeekJump') &&
        folderId == getCalculatedFolderIdForDefaultCalendar()
    ) {
        const getCalendarEventsFromRestPromise = lazyGetCalendarEventsFromRest.importAndExecute(
            dateRange
        );
        return {
            enhancedFetchPromise: getCalendarEventsFromRestPromise.then(response => {
                return response.requestPromise;
            }),
            cancelEnhancedFetchPromise: () => {
                getCalendarEventsFromRestPromise.then(response => {
                    response.cancel();
                });
            },
        };
    }
    return { enhancedFetchPromise: null, cancelEnhancedFetchPromise: null };
}

async function getCalendarViewEventsInDateRange(
    dateRange: DateRange,
    folderId: string,
    onLoadingStateChanged: LoadingStateChangedCallback,
    retryCount: number = 0
): Promise<CalendarEvent[]> {
    const calendarId = getCalendarIdByFolderId(folderId);
    onLoadingStateChanged(calendarId, 'Loading');

    if (isLocalCalendarEntry(folderId)) {
        let calendarEntry: CalendarEntry = getCalendarEntryByFolderId(folderId);
        if (calendarEntry.CalendarFolderType == CalendarFolderTypeEnum.BirthdayCalendar) {
            // invoke getBirthdayCalendarView
            return getBirthdayCalendarView(
                dateRange,
                calendarId,
                folderId,
                onLoadingStateChanged,
                retryCount
            );
        } else {
            // Invoke the service to get the data for local calendars
            return getCalendarView(
                dateRange,
                calendarId,
                folderId,
                onLoadingStateChanged,
                null,
                retryCount
            );
        }
    } else {
        // Invoke the service to get the data for linked calendars
        let calendarEntry: LocalCacheForRemoteCalendarEntry = getCalendarEntryByCalendarId(
            calendarId.id
        ) as LocalCacheForRemoteCalendarEntry;

        if (isValidCalendarEntry(calendarEntry)) {
            // if the calendarFolder is valid here, it means we already went through the calendarFolderConfiguration process and cached it
            return loadCalendarEventsUsingFolderId(
                folderId,
                calendarEntry,
                dateRange,
                calendarId,
                onLoadingStateChanged,
                retryCount
            );
        }

        onLoadingStateChanged(calendarId, 'Failed');
        return null;
    }
}

async function loadCalendarEventsUsingFolderId(
    folderId: string,
    calendarEntry: LocalCacheForRemoteCalendarEntry,
    dateRange: DateRange,
    calendarId: CalendarId,
    onLoadingStateChanged: LoadingStateChangedCallback,
    retryCount: number = 0
): Promise<CalendarEvent[]> {
    if (
        /* A linked calendar entry who has shared their primary calendar */
        (!calendarEntry.FolderId && isLinkedCalendarEntry(calendarEntry)) ||
        /* A non- group linked calendar entry for whom one does not have permissions to access */
        (calendarEntry.hasOwnProperty('OwnerEmailAddress') &&
            !calendarEntry.IsGroupMailboxCalendar &&
            !calendarEntry.EffectiveRights) ||
        ((!calendarEntry.EffectiveRights || !calendarEntry.EffectiveRights.Read) &&
            calendarEntry.IsGeneralScheduleCalendar)
    ) {
        while (retryCount >= 0) {
            try {
                const response = await getUserAvailabilityService(
                    getEwsRequestString(dateRange.start),
                    getEwsRequestString(dateRange.end),
                    [calendarEntry.OwnerEmailAddress],
                    'DetailedMerged',
                    null,
                    calendarId.mailboxInfo
                );
                if (response.ResponseCode != 'NoError') {
                    retryCount--;
                } else {
                    onLoadingStateChanged(calendarId, 'Loaded');

                    // Due to existing limitations in `getUserAvailabilityService`, we need to remove existing items for
                    // the loaded date range to avoid incorrect cache upsert operations that can lead to duplicate items
                    removeCalendarEventsInLoadedDateRange(folderId, dateRange);

                    // REMOVE AFTER VSO #30430
                    // clean up surface store by removing events that are no longer in the cache
                    syncSurfaceStoreWithCache(folderId);

                    const { WorkingHours, Items } = response.Responses[0].CalendarView;

                    updateCalendarWorkingHours(folderId, WorkingHours);

                    const calendarEvents = Items?.map(calendarItem =>
                        calendarEvent(calendarItem, calendarId.mailboxInfo)
                    );
                    return calendarEvents;
                }
            } catch (error) {
                trace.warn(
                    `[loadCalendarEventsInDateRange:loadCalendarEventsUsingFolderId: Exception occured: ${error}`
                );
                // if response code corresponds to ErrorTooManyObjectsOpened or ErrorApiQuarantined, then mark loadingState as "Throttled" and return
                if (
                    error.message &&
                    (error.message.indexOf('ErrorApiQuarantined') >= 0 ||
                        error.message.indexOf('ErrorTooManyObjectsOpened') >= 0)
                ) {
                    onLoadingStateChanged(calendarId, 'Throttled');
                    return null;
                } else {
                    retryCount--;
                }
            }
        }
        onLoadingStateChanged(calendarId, 'Failed');
        return null;
    } else {
        let folderId = calendarEntry.FolderId
            ? calendarEntry.FolderId.Id
            : calendarEntry.SharedFolderId.Id;

        return getCalendarView(
            dateRange,
            calendarId,
            folderId,
            onLoadingStateChanged,
            !calendarEntry.IsGroupMailboxCalendar ? calendarEntry.OwnerEmailAddress : null, // For non-group linked calendars, pass the explicitLogonEmail otherwise for group calendars, the CalendarId.mailboxInfo will take care of it.
            retryCount
        );
    }
}

// exported for testing
export async function getCalendarView(
    dateRange: DateRange,
    calendarId: CalendarId,
    folderId: string,
    onLoadingStateChanged: LoadingStateChangedCallback,
    explicitLogonEmail?: string,
    retryCount: number = 0
): Promise<CalendarEvent[]> {
    while (retryCount >= 0) {
        try {
            let response;
            if (calendarId.mailboxInfo && calendarId.mailboxInfo.type == 'TeamsMailbox') {
                // In the case of TeamsMailbox, we need to send the actual folder Id
                // instead of the customized folder Id present in the cache.
                // extractTrueProperty() helps us to do that operation.
                response = await getTeamsCalendarViewService(
                    getEwsRequestString(dateRange.start),
                    getEwsRequestString(dateRange.end),
                    extractTrueProperty(folderId),
                    calendarId.id,
                    getUserConfiguration().UserOptions.TimeZone
                );
                if (response) {
                    response = response.Body;
                }
            } else {
                response = await getCalendarViewService(
                    getEwsRequestString(dateRange.start),
                    getEwsRequestString(dateRange.end),
                    folderId ?? folderNameToId('calendar'),
                    calendarId,
                    explicitLogonEmail,
                    isFeatureEnabled('cal-surface-declinedMeetings')
                );
            }

            if (response.ResponseCode != 'NoError') {
                retryCount--;
            } else {
                onLoadingStateChanged(calendarId, 'Loaded');
                let calendarEvents = response.Items?.map(calendarItem => {
                    if (calendarId.mailboxInfo && calendarId.mailboxInfo.type == 'TeamsMailbox') {
                        calendarItem.ParentFolderId.Id = folderId;
                    }
                    return calendarEvent(calendarItem, calendarId.mailboxInfo);
                });
                return calendarEvents;
            }
        } catch (error) {
            trace.warn(
                `[loadCalendarEventsInDateRange:getCalendarView: Exception occured: ${error}`
            );
            // if response code corresponds to ErrorTooManyObjectsOpened or ErrorApiQuarantined, then mark loadingState as "Throttled" and return
            if (
                error.message &&
                (error.message.indexOf('ErrorApiQuarantined') >= 0 ||
                    error.message.indexOf('ErrorTooManyObjectsOpened') >= 0)
            ) {
                onLoadingStateChanged(calendarId, 'Throttled');
                return null;
            } else {
                retryCount--;
            }
        }
    }
    onLoadingStateChanged(calendarId, 'Failed');
    return null;
}

async function getBirthdayCalendarView(
    dateRange: DateRange,
    calendarId: CalendarId,
    folderId: string,
    onLoadingStateChanged: LoadingStateChangedCallback,
    retryCount: number = 0
): Promise<CalendarEvent[]> {
    while (retryCount >= 0) {
        try {
            const response = await getBirthdayCalendarViewService(
                getEwsRequestString(dateRange.start),
                getEwsRequestString(dateRange.end),
                calendarId
            );
            if (response.ResponseCode != 'NoError') {
                retryCount--;
            } else {
                onLoadingStateChanged(calendarId, 'Loaded');
                let calendarEvents = response.BirthdayEvents.map(event =>
                    calendarEventFromBirthdayEvent(
                        event,
                        folderId,
                        dateRange,
                        calendarId.mailboxInfo
                    )
                );
                return calendarEvents;
            }
        } catch (error) {
            trace.warn(
                `[loadCalendarEventsInDateRange:getBirthdayCalendarView: Exception occured: ${error}`
            );
            // if response code corresponds to ErrorTooManyObjectsOpened or ErrorApiQuarantined, then mark loadingState as "Throttled" and return
            if (
                error.message &&
                (error.message.indexOf('ErrorApiQuarantined') >= 0 ||
                    error.message.indexOf('ErrorTooManyObjectsOpened') >= 0)
            ) {
                onLoadingStateChanged(calendarId, 'Throttled');
                return null;
            } else {
                retryCount--;
            }
        }
    }
    onLoadingStateChanged(calendarId, 'Failed');
    return null;
}
