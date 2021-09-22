import { action } from 'satcheljs';
import type { SearchScenarioId } from 'owa-search-store';

export const resetSearchStore = action('RESET_SEARCH_STORE', (scenarioId: SearchScenarioId) => ({
    scenarioId,
}));
