import type { SearchScenarioId } from 'owa-search-store';
import { action } from 'satcheljs';
import type { Suggestion } from 'owa-search-service/lib/data/schema/SuggestionSet';
import type { EntityActionTakenType } from 'owa-search-instrumentation/lib/data/schema/substrateSearchLogTypes';

/**
 * Action dispatched when a secondary action on a suggestion is selected from the
 * SuggestionContextMenu. An example of a secondary action type is the OpenContactCard
 * button on People suggestions.
 * Consuming client should have an orchestrator that subscribes
 * to it that handles each secondary action type.
 */
export const suggestionSecondaryActionSelected = action(
    'SUGGESTION_SECONDARY_ACTION_SELECTED',
    (
        suggestion: Suggestion,
        suggestionIndex: number,
        actionSource: string,
        scenarioId: SearchScenarioId,
        suggestionSetTraceId: string,
        entityActionTakenType: EntityActionTakenType
    ) => ({
        suggestion,
        suggestionIndex,
        actionSource,
        scenarioId,
        suggestionSetTraceId,
        entityActionTakenType,
    })
);
