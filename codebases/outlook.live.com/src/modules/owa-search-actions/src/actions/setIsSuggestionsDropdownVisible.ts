import type { SearchScenarioId } from 'owa-search-store';
import { action } from 'satcheljs';

/**
 * Action that the consuming client should dispatch if it wants to show/hide
 * the suggestions dropdown.
 */
export const setIsSuggestionsDropdownVisible = action(
    'SET_IS_SUGGESTIONS_DROPDOWN_VISIBLE',
    (isSuggestionsDropdownVisible: boolean, scenarioId: SearchScenarioId) => ({
        isSuggestionsDropdownVisible,
        scenarioId,
    })
);
