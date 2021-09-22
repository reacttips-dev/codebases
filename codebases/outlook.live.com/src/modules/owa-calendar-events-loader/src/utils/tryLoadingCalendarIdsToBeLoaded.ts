import { loadEventsAndUpdateLoadState } from './loadEventsAndUpdateLoadState';
import { updateLoadState } from '../actions/internalActions';
import {
    getAllScenariosWithNotLoadCalendarIds,
    getLoadedDateRange,
} from '../selectors/calendarEventsLoaderStoreSelectors';

/**
 * When a scenario updates calendarIds/ initializes the `owa-calendar-events-loader`, it is not guaranteed that
 * that the calendar cache is initialized/ updated. When we are updating/ initializing a scenario, and the calendar cache is
 * not initialized, or the folder ids are not updated, we set the calendarEventsLoadState to `NotLoaded`.
 *
 * When the calendar cache is initialized, or the folder ids have been updated for a calendar, there is a chance that some of
 * our calendarIds in a `NotLoaded` can now be loaded, so we try to make these updates.
 */
export function tryLoadingCalendarIdsToBeLoaded() {
    getAllScenariosWithNotLoadCalendarIds().forEach(async scenario => {
        const { eventsCacheLockId, calendarIds } = scenario;
        // VSO 59602 Verify owa-calendar-events-loader for user scenario where connected account initializes after primary account
        const loadedDateRange = getLoadedDateRange(eventsCacheLockId);
        if (loadedDateRange) {
            updateLoadState('Loading', eventsCacheLockId);
            await loadEventsAndUpdateLoadState(eventsCacheLockId, calendarIds, loadedDateRange);
            updateLoadState('Loaded', eventsCacheLockId);
        }
    });
}
