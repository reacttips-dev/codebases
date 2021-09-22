import { mutator } from 'satcheljs';
import { createDefaultSearchStore, getScenarioStore } from 'owa-search-store';
import { removeSuggestionPillFromStore } from 'owa-search-actions';

export default mutator(removeSuggestionPillFromStore, actionMessage => {
    const { suggestionPillId, suggestionPillIndex, scenarioId } = actionMessage;
    const store = getScenarioStore(scenarioId);

    // Remove all traces of suggestion pill from store.
    store.suggestionPills.delete(suggestionPillId);
    store.suggestionPillIds.splice(suggestionPillIndex, 1);

    // Reset selected pill index.
    store.selectedPillIndex = createDefaultSearchStore().selectedPillIndex;
});
