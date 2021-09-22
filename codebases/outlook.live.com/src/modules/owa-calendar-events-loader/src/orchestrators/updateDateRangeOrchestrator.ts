import { orchestrator } from 'satcheljs';
import { updateDateRange, onDateRangeUpdated } from '../actions/publicActions';
import { updateLoadedDateRange, updateLoadState } from '../actions/internalActions';
import {
    getCalendarEventsLoadStatesKeys,
    getLoadedDateRange,
} from '../selectors/calendarEventsLoaderStoreSelectors';
import { isDateRangeDifferent } from '../utils/isDateRangeDifferent';
import { loadEventsAndUpdateLoadState } from '../utils/loadEventsAndUpdateLoadState';
import { onBeforeFetchNewDateRange } from '../utils/onBeforeFetchNewDateRange';
import { withCurrentRequestCheck } from 'owa-request-manager';

export const updateDateRangeOrchestrator = orchestrator(updateDateRange, async actionMessage => {
    const { dateRange, eventsCacheLockId } = actionMessage;
    const loadedDateRange = getLoadedDateRange(eventsCacheLockId);
    if (isDateRangeDifferent(dateRange, loadedDateRange)) {
        updateLoadState('Loading', eventsCacheLockId);
        onBeforeFetchNewDateRange(eventsCacheLockId);

        const loadEventsRequest = await withCurrentRequestCheck(
            () =>
                loadEventsAndUpdateLoadState(
                    eventsCacheLockId,
                    getCalendarEventsLoadStatesKeys(eventsCacheLockId),
                    dateRange
                ),
            'UpdateDateRange_' + eventsCacheLockId
        );

        if (loadEventsRequest.isCurrent) {
            updateLoadedDateRange(dateRange, eventsCacheLockId);
            updateLoadState('Loaded', eventsCacheLockId);
            onDateRangeUpdated(dateRange, eventsCacheLockId);
        }
    }
});
