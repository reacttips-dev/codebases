import type { LoadingStateChangedCallback } from './loadCalendarEventsInDateRange';
import { updateCalendarWorkingHours } from '../mutators/calendarWorkingHoursMutator';
import { removeCalendarEventsInLoadedDateRange } from '../utils/removeCalendarEventsInLoadedDateRange';
import { syncSurfaceStoreWithCache } from '../utils/syncSurfaceStoreWithCache';
import type { DateRange } from 'owa-datetime-utils';
import {
    getCalendarEntryByCalendarId,
    getCalendarIdByFolderId,
    getCalendarEntryByFolderId,
    isLocalCalendarEntry,
    isValidCalendarEntry,
    getCalculatedFolderIdForDefaultCalendar,
} from 'owa-calendar-cache';
import type LocalCacheForRemoteCalendarEntry from 'owa-service/lib/contract/LocalCacheForRemoteCalendarEntry';
import { getApolloClient } from 'owa-apollo';
import { isFeatureEnabled } from 'owa-feature-flags';
import { lazyGetCalendarEventsFromRest } from '../index';
import type { LoadCalendarEventsInDateRangePromises } from '../types/LoadCalendarEventsInDateRangePromises';
import type CalendarEvent from 'owa-calendar-types/lib/types/CalendarEvent';
import { CalendarEventsDocument } from 'owa-calendar-events-graphql-documents/lib/graphql/__generated__/CalendarEventsQuery.interface';
import type { LinkedCalendarEntry } from 'owa-graph-schema';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import { getUserConfiguration } from 'owa-session-store';
import { mapGqlCalendarEventToOwaCalendarEvent } from '../utils/mapGqlCalendarEventToOwaCalendarEvent';
import { getISOString } from 'owa-datetime';

export function loadCalendarEventsInDateRangeV2(
    dateRange: DateRange,
    folderId: string,
    onLoadingStateChanged: LoadingStateChangedCallback,
    retryCount: number = 0
): LoadCalendarEventsInDateRangePromises {
    return {
        fetchPromise: fetchCalendarEventsAndUpdateDependencies(
            dateRange,
            folderId,
            onLoadingStateChanged,
            retryCount
        ),
        ...getEnhancedData(folderId, dateRange),
    };
}

async function fetchCalendarEventsAndUpdateDependencies(
    dateRange: DateRange,
    folderId: string,
    onLoadingStateChanged: LoadingStateChangedCallback,
    retryCount: number = 0
): Promise<CalendarEvent[]> {
    const isDefaultCalendar = folderId == getCalculatedFolderIdForDefaultCalendar();
    const calendarId = getCalendarIdByFolderId(folderId);
    let isValidEntry;
    let calendarEntry;
    let events;
    const isLocalEntry = isLocalCalendarEntry(folderId);
    if (isLocalEntry) {
        calendarEntry = getCalendarEntryByFolderId(folderId);
    } else {
        calendarEntry = getCalendarEntryByCalendarId(
            calendarId.id
        ) as LocalCacheForRemoteCalendarEntry;
        isValidEntry = isValidCalendarEntry(calendarEntry);
    }
    onLoadingStateChanged(calendarId, 'Loading');
    if (!folderId) {
        folderId =
            (calendarEntry as LinkedCalendarEntry).SharedFolderId.Id ?? folderNameToId('calendar');
    }
    try {
        const client = getApolloClient();
        events = await client.query({
            query: CalendarEventsDocument,
            variables: {
                input: {
                    dateRange: {
                        start: getISOString(dateRange.start),
                        end: getISOString(dateRange.end),
                    },
                    calendarEntryData: {
                        calendarId: {
                            id: calendarId.id,
                            mailboxInfo: calendarId.mailboxInfo,
                        },
                        folderId: folderId,
                        ownerEmailAddress: calendarEntry.OwnerEmailAddress,
                        isGroupMailboxCalendar: calendarEntry.IsGroupMailboxCalendar,
                        hasEffectiveRights: !!calendarEntry.EffectiveRights,
                        hasReadRights: !!calendarEntry.EffectiveRights?.Read,
                        isGeneralScheduleCalendar: calendarEntry.IsGeneralScheduleCalendar,
                        calendarFolderType: calendarEntry.CalendarFolderType,
                        typename: calendarEntry.__typename,
                        isDefault: isDefaultCalendar,
                        isValidCalendarEntry: isValidEntry,
                        isLocalCalendarEntry: isLocalEntry,
                    },
                    retryCount: retryCount,
                    timeZone: getUserConfiguration().UserOptions.TimeZone,
                    includeDeclinedMeetings: isFeatureEnabled('cal-surface-declinedMeetings'),
                },
            },
        });
        onLoadingStateChanged(calendarId, 'Loaded');
    } catch (error) {
        if (error.fetchErrorType == 'RequestNotComplete') {
            onLoadingStateChanged(calendarId, 'Throttled');
        } else {
            onLoadingStateChanged(calendarId, 'Failed');
        }
        throw error;
    }
    const response = events.data.calendarEvents;
    if (response.forceOverride) {
        removeCalendarEventsInLoadedDateRange(folderId, dateRange);

        // REMOVE AFTER VSO #30430
        // clean up surface store by removing events that are no longer in the cache
        syncSurfaceStoreWithCache(folderId);
    }
    if (response.workingHours) {
        updateCalendarWorkingHours(folderId, response.workingHours);
    }

    return response.events?.map(mapGqlCalendarEventToOwaCalendarEvent);
}

// TODO VSO 108598: Migrate GetCalendarView++ OWS API: Add schema and web resolver
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
