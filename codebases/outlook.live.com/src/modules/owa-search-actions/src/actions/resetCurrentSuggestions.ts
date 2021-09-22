import type { SearchScenarioId } from 'owa-search-store';
import { action } from 'satcheljs';

/**
 * Action that the consuming client should dispatch when it wants to reset suggestions to default state
 * in the store.
 */
export const resetCurrentSuggestions = action(
    'RESET_CURRENT_SUGGESTIONS',
    (scenarioId: SearchScenarioId) => ({
        scenarioId,
    })
);
