import type { SearchScenarioId } from 'owa-search-store';
import { action } from 'satcheljs';

export const setSearchTextForSuggestion = action(
    'SET_SEARCH_TEXT_FOR_SUGGESTION',
    (searchTextForSuggestion: string, scenarioId: SearchScenarioId) => ({
        searchTextForSuggestion,
        scenarioId,
    })
);
