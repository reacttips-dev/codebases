import { orchestrator } from 'satcheljs';
import { updateCalendarIds, onCalendarIdsUpdated } from '../actions/publicActions';
import { updateCalendarEventLoadStates, updateLoadState } from '../actions/internalActions';
import {
    getLoadedDateRange,
    getCalendarIdsByLoadState,
} from '../selectors/calendarEventsLoaderStoreSelectors';
import { loadEventsAndUpdateLoadState } from '../utils/loadEventsAndUpdateLoadState';
import { updateFolderIdsIfNeeded } from '../utils/updateFolderIdsIfNeeded';

export const updateCalendarIdsOrchestrator = orchestrator(
    updateCalendarIds,
    async actionMessage => {
        const { calendarIds, eventsCacheLockId } = actionMessage;
        updateCalendarEventLoadStates(calendarIds, eventsCacheLockId);
        const newCalendarIds = getCalendarIdsByLoadState(eventsCacheLockId, 'NotLoaded');
        updateFolderIdsIfNeeded(newCalendarIds);
        const dateRange = getLoadedDateRange(eventsCacheLockId);
        if (newCalendarIds.length !== 0) {
            updateLoadState('Loading', eventsCacheLockId);
            await loadEventsAndUpdateLoadState(eventsCacheLockId, newCalendarIds, dateRange);
            updateLoadState('Loaded', eventsCacheLockId);
            onCalendarIdsUpdated(eventsCacheLockId);
        }
    }
);
