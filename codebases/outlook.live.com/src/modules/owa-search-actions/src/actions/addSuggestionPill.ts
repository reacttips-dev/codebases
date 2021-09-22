import type { SearchScenarioId } from 'owa-search-store';
import { action } from 'satcheljs';
import type { PillSuggestion } from 'owa-search-service/lib/data/schema/SuggestionSet';

/**
 * Action dispatched (internally or by consuming client) when a suggestion pill
 * should be added to the search box. "suggestionSelected" should be true for all
 * cases except when user is navigation up/down the SuggestionsContextMenu.
 */
export const addSuggestionPill = action(
    'ADD_SUGGESTION_PILL',
    (
        suggestionPill: PillSuggestion,
        suggestionSelected: boolean,
        scenarioId: SearchScenarioId
    ) => ({
        suggestionPill,
        suggestionSelected,
        scenarioId,
    })
);
