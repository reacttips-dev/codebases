import type { SearchScenarioId } from 'owa-search-store';
import { action } from 'satcheljs';
import type SuggestionSet from 'owa-search-service/lib/data/schema/SuggestionSet';

/**
 * Action that the consuming client should dispatch when it wants to set suggestions
 * in the store.
 */
export const setCurrentSuggestions = action(
    'SET_CURRENT_SUGGESTIONS',
    (suggestionSet: SuggestionSet, scenarioId: SearchScenarioId, qfRequestId: string = null) => ({
        suggestionSet,
        scenarioId,
        qfRequestId,
    })
);
