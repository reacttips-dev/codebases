import { isDateRangeDifferent } from '../utils/isDateRangeDifferent';
import {
    updateCalendarEventLoadStates,
    updateLoadedDateRange,
    updateLoadState,
} from '../actions/internalActions';
import type { EventsCacheLockId } from 'owa-calendar-events-store';
import {
    getLoadedDateRange,
    getCalendarIdsByLoadState,
} from '../selectors/calendarEventsLoaderStoreSelectors';
import type { InitValues } from '../store/schema/InitValues';
import { loadEventsAndUpdateLoadState } from './loadEventsAndUpdateLoadState';
import { onCalendarIdsUpdated } from '../actions/publicActions';
import { updateFolderIdsIfNeeded } from './updateFolderIdsIfNeeded';
import { onBeforeFetchNewDateRange } from './onBeforeFetchNewDateRange';

export async function updateCalendarIdsAndDateRange(
    eventsCacheLockId: EventsCacheLockId,
    initValues: InitValues
) {
    const { calendarIds, dateRange } = initValues;
    updateCalendarEventLoadStates(calendarIds, eventsCacheLockId);
    const newCalendarIds = getCalendarIdsByLoadState(eventsCacheLockId, 'NotLoaded');
    updateFolderIdsIfNeeded(newCalendarIds);
    const loadedDateRange = getLoadedDateRange(eventsCacheLockId);
    if (isDateRangeDifferent(dateRange, loadedDateRange) || newCalendarIds.length !== 0) {
        updateLoadState('Loading', eventsCacheLockId);

        if (isDateRangeDifferent(dateRange, loadedDateRange)) {
            onBeforeFetchNewDateRange(eventsCacheLockId);
        }
        /**
         * if either the loaded folderIds or dateRange is DIFFERENT from the initialization folderIds or dateRange,
         *  re-initialize with the updated calendarIds/dateRange
         **/
        await loadEventsAndUpdateLoadState(eventsCacheLockId, calendarIds, dateRange);
        updateLoadedDateRange(dateRange, eventsCacheLockId);
        updateLoadState('Loaded', eventsCacheLockId);

        onCalendarIdsUpdated(eventsCacheLockId);
    }
}
