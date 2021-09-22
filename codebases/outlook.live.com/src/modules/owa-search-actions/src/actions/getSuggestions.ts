import type { SearchScenarioId } from 'owa-search-store';
import { action } from 'satcheljs';
import { addDatapointConfig } from 'owa-analytics-actions';

/**
 * Action dispatched when suggestions should be set in the store. Consuming client
 * should set up an orchestrator to subscribe to it, which should read appropriate
 * values from the search store, fetch suggestions, and set them in the store.
 */
export const getSuggestions = action('GET_SUGGESTIONS', (scenarioId: SearchScenarioId) =>
    addDatapointConfig(
        {
            name: 'Search_SuggestionsE2E',
        },
        {
            scenarioId,
        }
    )
);
