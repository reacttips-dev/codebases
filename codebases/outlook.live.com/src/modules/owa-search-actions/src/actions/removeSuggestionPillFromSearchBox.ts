import { action } from 'satcheljs';
import type { SearchScenarioId } from 'owa-search-store';

export const removeSuggestionPillFromSearchBox = action(
    'REMOVE_SUGGESTION_PILL_FROM_SEARCHBOX',
    (suggestionPillId: string, scenarioId: SearchScenarioId, actionSource: string) => ({
        suggestionPillId,
        scenarioId,
        actionSource,
    })
);
