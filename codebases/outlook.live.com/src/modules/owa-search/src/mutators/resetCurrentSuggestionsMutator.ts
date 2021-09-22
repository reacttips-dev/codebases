import { mutator } from 'satcheljs';
import { createDefaultSearchStore, getScenarioStore } from 'owa-search-store';
import { resetCurrentSuggestions } from 'owa-search-actions';

mutator(resetCurrentSuggestions, actionMessage => {
    const defaultSearchStore = createDefaultSearchStore();

    // Update suggestions in the store.
    getScenarioStore(actionMessage.scenarioId).currentSuggestions =
        defaultSearchStore.currentSuggestions;
});
