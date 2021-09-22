import type { SearchScenarioId } from 'owa-search-store';
import { action } from 'satcheljs';

/**
 * Updates "IsComplete" property of suggestion set in the store.
 */
export const updateIsSuggestionSetComplete = action(
    'UPDATE_IS_SUGGESTION_SET_COMPLETE',
    (isComplete: boolean, scenarioId: SearchScenarioId) => ({
        isComplete,
        scenarioId,
    })
);
