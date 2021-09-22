import { getUpNextDateRange } from '../selectors/dateTimeStoreSelectors';
import { getInitializedScenarioIds } from '../selectors/upNextStoreSelectors';
import { updateDateRange } from 'owa-calendar-events-loader';
import { observableTodayChanged } from 'owa-observable-datetime';
import { orchestrator } from 'satcheljs';

export const onObservableTodayChangedOrchestrator = orchestrator(observableTodayChanged, () => {
    getInitializedScenarioIds().forEach(key => updateDateRange(getUpNextDateRange(), key));
});
