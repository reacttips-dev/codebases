import type { SearchScenarioId } from 'owa-search-store';
import { action } from 'satcheljs';
import type { Suggestion } from 'owa-search-service/lib/data/schema/SuggestionSet';

/**
 * Action dispatched when a suggestion is selected from the SuggestionContextMenu.
 * Consuming client should have an orchestrator that subscribes to it that handles
 * each suggestion type.
 */
export const suggestionSelected = action(
    'SUGGESTION_SELECTED',
    (
        suggestion: Suggestion,
        actionSource: string,
        scenarioId: SearchScenarioId,
        suggestionSetTraceId: string,
        index: number
    ) => ({
        suggestion,
        actionSource,
        scenarioId,
        suggestionSetTraceId,
        index,
    })
);
