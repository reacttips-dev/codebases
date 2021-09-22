import { action } from 'satcheljs';
import type { PillSuggestion } from 'owa-search-service/lib/data/schema/SuggestionSet';
import type { SearchScenarioId } from 'owa-search-store';

export const addSuggestionPillInternal = action(
    'ADD_SUGGESTION_PILL_INTERNAL',
    (suggestionPill: PillSuggestion, scenarioId: SearchScenarioId) => ({
        suggestionPill,
        scenarioId,
    })
);
