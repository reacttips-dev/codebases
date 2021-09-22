import { getScenarioStore } from 'owa-search-store';
import { orchestrator } from 'satcheljs';
import {
    updateIsSuggestionSetComplete,
    updateIsSuggestionSetCompleteInternal,
} from 'owa-search-actions';

export default orchestrator(updateIsSuggestionSetComplete, actionMessage => {
    const scenarioId = actionMessage.scenarioId;
    const store = getScenarioStore(scenarioId);

    if (store.currentSuggestions) {
        // First, dispatch action to update the store.
        updateIsSuggestionSetCompleteInternal(actionMessage.isComplete, scenarioId);
    }
});
