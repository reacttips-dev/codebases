import hasSuggestionPills from '../selectors/hasSuggestionPills';
import { createDefaultSearchStore, getScenarioStore } from 'owa-search-store';
import { onLeftArrowPressedSearchInput, setSelectedPillIndex } from 'owa-search-actions';
import { orchestrator } from 'satcheljs';

export default orchestrator(onLeftArrowPressedSearchInput, actionMessage => {
    const scenarioId = actionMessage.scenarioId;
    const store = getScenarioStore(scenarioId);

    const cursorPosition = actionMessage.cursorPosition;
    const selectedPillIndex = store.selectedPillIndex;

    /**
     * If there aren't any suggestion pills or the user's cursor in the search
     * input is not 0, then bail.
     */
    if (!hasSuggestionPills(scenarioId) || cursorPosition !== 0) {
        return;
    }

    /**
     * Case 1: There is not a pill selected.
     * Result: Select the last pill.
     */
    if (selectedPillIndex === createDefaultSearchStore().selectedPillIndex) {
        if (store.suggestionPills.size > 0) {
            setSelectedPillIndex(store.suggestionPills.size - 1, scenarioId);
        }

        return;
    }

    /**
     * Case 2: There is a pill selected and it's not the first pill.
     * Result: Select the pill to the left (index - 1).
     */
    if (selectedPillIndex !== 0) {
        setSelectedPillIndex(selectedPillIndex - 1, scenarioId);
        return;
    }

    /**
     * Case 3: There is a pill selected and it's the first pill.
     * Result: It's a no-op (return).
     */
    if (selectedPillIndex === 0) {
        return;
    }
});
