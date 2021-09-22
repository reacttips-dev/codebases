import { createDefaultSearchStore, getScenarioStore } from 'owa-search-store';
import { mutator } from 'satcheljs';
import { setCurrentSuggestions, setSelectedSuggestionIndex } from 'owa-search-actions';

mutator(setSelectedSuggestionIndex, actionMessage => {
    getScenarioStore(actionMessage.scenarioId).selectedSuggestionIndex =
        actionMessage.selectedSuggestionIndex;
});

/**
 * When suggestions are updated in the store, reset the selectedSuggestionIndex
 * since the selected suggestion will have been removed from the store.
 */
mutator(setCurrentSuggestions, actionMessage => {
    getScenarioStore(
        actionMessage.scenarioId
    ).selectedSuggestionIndex = createDefaultSearchStore().selectedSuggestionIndex;
});
