import { getScenarioStore } from 'owa-search-store';
import {
    changeSelectedSuggestionViaKeyboard,
    onDownArrowPressedSearchInput,
} from 'owa-search-actions';
import { orchestrator } from 'satcheljs';

export default orchestrator(onDownArrowPressedSearchInput, actionMessage => {
    const scenarioId = actionMessage.scenarioId;
    const store = getScenarioStore(scenarioId);

    // Bail if there isn't a complete suggestion set in the store.
    const currentSuggestionSet = store.currentSuggestions;
    if (!currentSuggestionSet || !currentSuggestionSet.IsComplete) {
        return;
    }

    // Bail if there aren't any suggestions.
    const suggestionsCount = currentSuggestionSet.Suggestions.length;
    if (suggestionsCount === 0) {
        return;
    }

    /**
     * If user has the last suggestion selected, then wrap the selection by going
     * to the first item in the list.
     *
     * Else, the user wants to select the next suggestion in the list so increase
     * the selection index by 1.
     */
    const selectedSuggestionIndex = store.selectedSuggestionIndex;
    if (selectedSuggestionIndex === suggestionsCount - 1) {
        const indexToSelect = 0;
        const suggestionToSelect = currentSuggestionSet.Suggestions[indexToSelect];
        changeSelectedSuggestionViaKeyboard(indexToSelect, suggestionToSelect, scenarioId);
    } else if (selectedSuggestionIndex < suggestionsCount - 1) {
        const indexToSelect = selectedSuggestionIndex + 1;
        const suggestionToSelect = currentSuggestionSet.Suggestions[indexToSelect];
        changeSelectedSuggestionViaKeyboard(indexToSelect, suggestionToSelect, scenarioId);
    }
});
