import { createDefaultSearchStore, getScenarioStore } from 'owa-search-store';
import { endSearchConversation } from 'owa-search-actions';
import { mutator } from 'satcheljs';

/**
 * This mutator takes care of all the store operations necessary to get to
 * a clean suggestion state after a search conversation ends.
 *
 * A "conversation" is defined as a series of keystrokes follow by either:
 *  - A click on a suggestion
 *  - A search query being issued
 *  - Abandonment (search session ends)
 */
export default mutator(endSearchConversation, actionMessage => {
    const store = getScenarioStore(actionMessage.scenarioId);
    const defaultSearchStore = createDefaultSearchStore();

    store.latestQFRequestId = defaultSearchStore.latestQFRequestId;
    store.searchTextForSuggestion = defaultSearchStore.searchTextForSuggestion;
    store.currentSuggestions = defaultSearchStore.currentSuggestions;
    store.selectedSuggestionIndex = defaultSearchStore.selectedSuggestionIndex;
});
