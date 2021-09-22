import { createRemovePredicateByFolderId } from './createRemovePredicateByFolderId';
import { removeCalendarEventsFromEventsCacheMatchingFilter } from '../actions/eventsCacheActions';
import { getAllCalendarEvents } from '../selectors/eventsCacheSelectors';
import { getCalendarEventsOverlappingDateRanges } from '../utils/getCalendarEventsOverlappingDateRanges';
import type { DateRange } from 'owa-datetime-utils';

/**
 * For calendar entries loaded by folderId (e.g. linked calendar entries), we cannot correctly
 * upsert events due to unstable ItemIds.
 *
 * Specifically, the events returned by the backing `GetUserAvailabilityInternal` API call
 * each have ItemId.Id set to a randomly generated GUID per API call. Since ItemId.Id is used
 * as the client-side Key for event cache purposes, this can result in storing duplicate events
 * when a new date range is loaded that partially overlaps the existing date range.
 *
 * To avoid storing duplicate events, we need to first remove the previously-cached events in the
 * overlapping date range before adding any of the loaded events (since the internal upsert operation
 * will not be able to correctly reconcile events in the overlapping date range).
 *
 * IMPORTANT: This util removes all events in the overlapping date range for the folderId, **regardless
 * of locks**. Although we bypass the typical lock checks, this is a safe operation since it is triggered
 * prior to all handling of the events returned by the service call, which will restore the cache to a
 * working state for all consumers. Essentially, this util causes upsert operations to become add operations
 * for linked calendar entries since we cannot make the same cache guarantees as for standard calendar entries.
 */
export function removeCalendarEventsInLoadedDateRange(
    folderId: string,
    loadedDateRange: DateRange
) {
    // clean up cache by removing events that overlap the loaded date range
    const eventsInFolder = getAllCalendarEvents(folderId);
    if (eventsInFolder?.length) {
        const { eventsOverlapping } = getCalendarEventsOverlappingDateRanges(eventsInFolder, [
            loadedDateRange,
        ]);
        removeCalendarEventsFromEventsCacheMatchingFilter(
            folderId,
            createRemovePredicateByFolderId(folderId, eventsOverlapping, true)
        );
    }
}
