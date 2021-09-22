import { action } from 'satcheljs';
import type { SearchScenarioId } from 'owa-search-store';

export const onEnterPressedSearchInput = action(
    'ON_ENTER_PRESSED_SEARCH_INPUT',
    (selectedSuggestionIndex: number, scenarioId: SearchScenarioId) => ({
        selectedSuggestionIndex,
        scenarioId,
    })
);
