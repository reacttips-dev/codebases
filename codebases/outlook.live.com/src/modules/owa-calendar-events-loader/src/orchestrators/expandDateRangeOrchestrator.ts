import { orchestrator } from 'satcheljs';
import { updateLoadedDateRange, updateLoadState } from '../actions/internalActions';
import {
    getLoadedDateRange,
    getCalendarEventsLoadStatesKeys,
} from '../selectors/calendarEventsLoaderStoreSelectors';
import { expandDateRange } from '../actions/publicActions';
import { addDays } from 'owa-datetime';
import { loadEventsAndUpdateLoadState } from '../utils/loadEventsAndUpdateLoadState';

export const expandDateRangeOrchestrator = orchestrator(expandDateRange, async actionMessage => {
    const { eventsCacheLockId, numberOfDays } = actionMessage;
    const loadedDateRange = getLoadedDateRange(eventsCacheLockId);
    const expandedDateRange = {
        start: loadedDateRange.start,
        end: addDays(loadedDateRange.end, numberOfDays),
    };
    updateLoadState('Loading', eventsCacheLockId);
    await loadEventsAndUpdateLoadState(
        eventsCacheLockId,
        getCalendarEventsLoadStatesKeys(eventsCacheLockId),
        expandedDateRange
    );
    updateLoadedDateRange(expandedDateRange, eventsCacheLockId);
    updateLoadState('Loaded', eventsCacheLockId);
});
