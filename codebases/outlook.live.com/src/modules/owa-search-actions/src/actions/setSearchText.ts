import { action } from 'satcheljs';
import type { SearchScenarioId } from 'owa-search-store';

export const setSearchText = action(
    'SET_SEARCH_TEXT',
    (searchText: string, scenarioId: SearchScenarioId) => ({
        searchText,
        scenarioId,
    })
);
