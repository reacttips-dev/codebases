import { getScenarioStore } from 'owa-search-store';
import { setCurrentSuggestions } from 'owa-search-actions';
import { mutator } from 'satcheljs';

mutator(setCurrentSuggestions, actionMessage => {
    const store = getScenarioStore(actionMessage.scenarioId);
    store.traceIdToLogicalIdMap.set(actionMessage.suggestionSet.TraceId, actionMessage.qfRequestId);
});
