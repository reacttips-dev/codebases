import { action } from 'satcheljs';
import type { SearchScenarioId } from 'owa-search-store';

export const setSelectedSuggestionIndex = action(
    'SET_SELECTED_SUGGESTION_INDEX',
    (selectedSuggestionIndex: number, scenarioId: SearchScenarioId) => ({
        selectedSuggestionIndex,
        scenarioId,
    })
);
