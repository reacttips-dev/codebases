import isSearchBoxEmpty from '../selectors/isSearchBoxEmpty';
import { createDefaultSearchStore, getScenarioStore } from 'owa-search-store';
import {
    getSuggestions,
    removeSuggestionPillFromSearchBox,
    removeSuggestionPillFromStore,
    setSelectedSuggestionIndex,
    startSearch,
} from 'owa-search-actions';
import { orchestrator } from 'satcheljs';

export default orchestrator(removeSuggestionPillFromSearchBox, actionMessage => {
    const { scenarioId, suggestionPillId } = actionMessage;

    const store = getScenarioStore(scenarioId);
    const suggestionPillIndex = store.suggestionPillIds.indexOf(suggestionPillId);

    // Throw if suggestion to remove isn't found in the store.
    if (suggestionPillIndex === -1) {
        throw new Error(
            'removeSuggestionPill action should not be dispatched when the suggestion is not present in the store.'
        );
    }

    /**
     * Dispatch removeSuggestionPill action to remove suggestion pill
     * from the store. This is done within this orchestrator insteading having
     * an explicit mutator because order matters and it must happen before checking
     * if the search box is empty.
     */
    removeSuggestionPillFromStore(suggestionPillId, suggestionPillIndex, scenarioId);

    // Reset selectedSuggestionIndex since user broke out of arrowing flow.
    setSelectedSuggestionIndex(createDefaultSearchStore().selectedSuggestionIndex, scenarioId);

    /**
     * After suggestion pill is removed, check if search box is empty. If search
     * box is not empty, dispatch a startSearch action to initiate search.
     *
     * If search box is empty, dispatch getSuggestions since search box content
     * has changed.
     */
    if (!isSearchBoxEmpty(scenarioId)) {
        startSearch('NonUserAction', scenarioId);
    } else {
        getSuggestions(scenarioId);
    }
});
