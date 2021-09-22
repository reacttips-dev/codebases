import type { SearchScenarioId } from 'owa-search-store';
import { action } from 'satcheljs';

// Action dispatched to clear the search input (including query text and pills).
export const clearSearchBox = action('CLEAR_SEARCH_BOX', (scenarioId: SearchScenarioId) => ({
    scenarioId,
}));
