import type { SearchScenarioId } from 'owa-search-store';
import { action } from 'satcheljs';

/**
 * Action that the consuming client should dispatch when it wants to change the
 * search text. The corresponding orchestrator will set the visible search text,
 * as well as the underlying text used to fetch suggestions and dispatch the
 * "getSuggestions" action so the client knows to fetch new suggestions.
 */
export const onSearchTextChanged = action(
    'ON_SEARCH_TEXT_CHANGED',
    (searchText: string, scenarioId: SearchScenarioId) => ({
        searchText,
        scenarioId,
    })
);
