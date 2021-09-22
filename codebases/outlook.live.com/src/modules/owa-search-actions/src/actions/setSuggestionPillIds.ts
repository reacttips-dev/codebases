import { action } from 'satcheljs';
import type { SearchScenarioId } from 'owa-search-store';

export const setSuggestionPillIds = action(
    'SET_SUGGESTION_PILL_IDS',
    (suggestionPillIds: string[], scenarioId: SearchScenarioId) => ({
        suggestionPillIds,
        scenarioId,
    })
);
