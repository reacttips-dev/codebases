import { getScenarioStore } from 'owa-search-store';
import {
    getSuggestions,
    onSearchInputFocused,
    setIsSuggestionsDropdownVisible,
    setSearchTextForSuggestion,
    startSearchSession,
} from 'owa-search-actions';
import { orchestrator } from 'satcheljs';

export default orchestrator(onSearchInputFocused, actionMessage => {
    const scenarioId = actionMessage.scenarioId;
    const { searchSessionGuid, searchText, searchTextForSuggestion } = getScenarioStore(scenarioId);

    // Show suggestions dropdown.
    setIsSuggestionsDropdownVisible(true, scenarioId);

    /**
     * If searchSessionGuid doesn't exist, user isn't in a search session yet.
     *
     * If user is already in a search session, but is re-focusing the search box,
     * dispatch action to refresh suggestions.
     */
    if (!searchSessionGuid) {
        startSearchSession('SearchBox', false /* shouldStartSearch */, scenarioId);
    } else {
        /**
         * If searchText (text in the search box) already matches searchTextForSuggestion,
         * then there's no need to update the store or refresh suggestions.
         */
        if (searchText && searchText === searchTextForSuggestion) {
            return;
        }

        // Ensure searchTextForSuggestion matches the text in the search box (searchText).
        setSearchTextForSuggestion(searchText, scenarioId);

        // Get suggestions to ensure results match current search box state.
        getSuggestions(scenarioId);
    }
});
