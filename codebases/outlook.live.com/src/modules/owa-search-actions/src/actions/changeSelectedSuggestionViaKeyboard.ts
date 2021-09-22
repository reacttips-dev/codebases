import type { SearchScenarioId } from 'owa-search-store';
import { action } from 'satcheljs';
import type { Suggestion } from 'owa-search-service/lib/data/schema/SuggestionSet';

/**
 * Action dispatched when the user arrows up or down in the SuggestionsContextMenu,
 * causing the selected index to be changed. This action should be subscribed to
 * by the consuming client (if they're using 3S) to correctly log the
 * "searchboxstatechanged" instrumentation event.
 */
export const changeSelectedSuggestionViaKeyboard = action(
    'CHANGE_SELECTED_SUGGESTION_VIA_KEYBOARD',
    (indexToSelect: number, suggestionToSelect: Suggestion, scenarioId: SearchScenarioId) => ({
        indexToSelect,
        suggestionToSelect,
        scenarioId,
    })
);
