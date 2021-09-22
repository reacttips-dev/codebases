import isSearchBoxEmpty from '../selectors/isSearchBoxEmpty';
import { createDefaultSearchStore, getScenarioStore } from 'owa-search-store';
import { orchestrator } from 'satcheljs';
import {
    onEnterPressedSearchInput,
    onSearchTextChanged,
    setIsSuggestionsDropdownVisible,
    setSearchTextForSuggestion,
    startSearch,
    suggestionSelected,
} from 'owa-search-actions';

/**
 * When "Enter" is pressed in SearchInput, handle it.
 *
 * 1. If there's a selectedSuggestionIndex (i.e. user is navigating
 *    SuggestionsContextMenu with up/down arrow keys), dispatch a suggestionSelected
 *    action so consuming client can handle appropriately based on suggestion.
 * 2. Else, just start a search (if search box isn't empty).
 */
export default orchestrator(onEnterPressedSearchInput, actionMessage => {
    const { scenarioId, selectedSuggestionIndex } = actionMessage;
    const store = getScenarioStore(scenarioId);

    if (selectedSuggestionIndex !== createDefaultSearchStore().selectedSuggestionIndex) {
        // Dispatch action to let consumer know a suggestion was selected.
        suggestionSelected(
            store.currentSuggestions.Suggestions[selectedSuggestionIndex],
            'keyboard',
            scenarioId,
            store.currentSuggestions.TraceId,
            selectedSuggestionIndex
        );

        /**
         * This is specific to the case where the user is arrowing up/down the
         * SuggestionsContextMenu and hits "Enter" on a pill suggestion. We want
         * to clear searchText, searchTextForSuggestion, and reset suggestions.
         */
        if (!store.searchText) {
            onSearchTextChanged('', scenarioId);
            setSearchTextForSuggestion('', scenarioId);
        }
    } else if (!isSearchBoxEmpty(scenarioId)) {
        startSearch('Keyboard', scenarioId, true /* explicitSearch */);
    }

    // Hide suggestions dropdown.
    setIsSuggestionsDropdownVisible(false, scenarioId);
});
