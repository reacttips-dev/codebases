import { action } from 'satcheljs';
import type { SearchScenarioId } from 'owa-search-store';

export const updateIsSuggestionSetCompleteInternal = action(
    'UPDATE_IS_SUGGESTION_SET_COMPLETE_INTERNAL',
    (isComplete: boolean, scenarioId: SearchScenarioId) => ({
        isComplete,
        scenarioId,
    })
);
