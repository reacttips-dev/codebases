import type { SearchScenarioId } from 'owa-search-store';
import { action } from 'satcheljs';

/**
 * Action dispatched when the search box loses focus. Consuming client should
 * set up an orchestrator to subscribe to it and handle what should happen in
 * that case (i.e. end search session).
 */
export const searchBoxBlurred = action('SEARCH_BOX_BLURRED', (scenarioId: SearchScenarioId) => ({
    scenarioId,
}));
