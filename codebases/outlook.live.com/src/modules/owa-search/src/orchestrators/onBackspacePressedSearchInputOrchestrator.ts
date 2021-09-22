import { createDefaultSearchStore, getScenarioStore } from 'owa-search-store';
import { orchestrator } from 'satcheljs';
import {
    onBackspacePressedSearchInput,
    lazyRemoveSuggestionPillFromSearchBox,
    setSelectedSuggestionIndex,
} from 'owa-search-actions';

export default orchestrator(onBackspacePressedSearchInput, async actionMessage => {
    const scenarioId = actionMessage.scenarioId;
    const store = getScenarioStore(scenarioId);

    /**
     * If the cursor is at the beginning of the search input, then delete the
     * last pill.
     */
    if (actionMessage.cursorPosition === 0) {
        const suggestionPillsCount = store.suggestionPillIds.length;

        if (suggestionPillsCount > 0) {
            // Dispatch action to remove last suggestion pill from store.
            const removeSuggestionPillFromSearchBox = await lazyRemoveSuggestionPillFromSearchBox.import();
            removeSuggestionPillFromSearchBox(
                store.suggestionPillIds[suggestionPillsCount - 1],
                scenarioId,
                'BackspaceInput'
            );
        }
    }

    // Reset selectedSuggestionIndex because user broke out of navigation flow.
    setSelectedSuggestionIndex(createDefaultSearchStore().selectedSuggestionIndex, scenarioId);
});
