import { action } from 'satcheljs';
import type { SearchScenarioId } from 'owa-search-store';

export const removeSuggestionPillFromStore = action(
    'REMOVE_SUGGESTION_PILL_FROM_STORE',
    (suggestionPillId: string, suggestionPillIndex: number, scenarioId: SearchScenarioId) => ({
        suggestionPillId,
        suggestionPillIndex,
        scenarioId,
    })
);
