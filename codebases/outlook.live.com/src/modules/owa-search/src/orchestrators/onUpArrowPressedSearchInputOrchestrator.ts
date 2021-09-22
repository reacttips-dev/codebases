import { getScenarioStore } from 'owa-search-store';
import {
    changeSelectedSuggestionViaKeyboard,
    onUpArrowPressedSearchInput,
} from 'owa-search-actions';
import { orchestrator } from 'satcheljs';

export default orchestrator(onUpArrowPressedSearchInput, actionMessage => {
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
     * If user has no selected index yet or if they have the first item selected,
     * then wrap the selection by going to the last suggestion in the UI.
     *
     * Else, the user wants to select the previous suggestion in the list so decrease
     * the selection index by 1.
     */
    const selectedSuggestionIndex = store.selectedSuggestionIndex;
    if (selectedSuggestionIndex === 0 || selectedSuggestionIndex === -1) {
        const indexToSelect = suggestionsCount - 1;
        const suggestionToSelect = currentSuggestionSet.Suggestions[indexToSelect];
        changeSelectedSuggestionViaKeyboard(indexToSelect, suggestionToSelect, scenarioId);
    } else if (selectedSuggestionIndex > 0 && selectedSuggestionIndex < suggestionsCount) {
        const indexToSelect = selectedSuggestionIndex - 1;
        const suggestionToSelect = currentSuggestionSet.Suggestions[indexToSelect];
        changeSelectedSuggestionViaKeyboard(indexToSelect, suggestionToSelect, scenarioId);
    }
});
