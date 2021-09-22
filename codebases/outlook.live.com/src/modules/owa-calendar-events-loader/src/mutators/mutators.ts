import { mutator } from 'satcheljs';
import {
    updateLoadedDateRange,
    updateLoadState,
    initializeScenario,
    updateIsInitializingCalendarEventsLoader,
} from '../actions/internalActions';
import { getScenarioData } from '../selectors/calendarEventsLoaderStoreSelectors';
import { getEventsLoadedStore } from '../store/store';
import { ObservableMap } from 'mobx';

mutator(updateLoadedDateRange, actionMessage => {
    const { eventsCacheLockId, dateRange } = actionMessage;
    getScenarioData(eventsCacheLockId).loadedDateRange = dateRange;
});

mutator(updateLoadState, actionMessage => {
    const { eventsCacheLockId, loadState } = actionMessage;
    getScenarioData(eventsCacheLockId).scenarioLoadState = loadState;
});

mutator(updateIsInitializingCalendarEventsLoader, actionMessage => {
    const { eventsCacheLockId, isInitializingCalendarEventsLoader } = actionMessage;
    getScenarioData(
        eventsCacheLockId
    ).isInitializingCalendarEventsLoader = isInitializingCalendarEventsLoader;
});

mutator(initializeScenario, actionMessage => {
    const { eventsCacheLockId } = actionMessage;
    if (!getEventsLoadedStore().scenarios.get(eventsCacheLockId)) {
        getEventsLoadedStore().scenarios.set(eventsCacheLockId, {
            eventsCacheLockId: eventsCacheLockId,
            loadedDateRange: null,
            scenarioLoadState: 'Loading',
            calendarEventsLoadState: new ObservableMap({}),
            isInitializingCalendarEventsLoader: true,
        });
    }
});
