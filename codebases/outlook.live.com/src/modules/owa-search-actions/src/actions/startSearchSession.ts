import type { SearchScenarioId } from 'owa-search-store';
import { action } from 'satcheljs';

/**
 * This action is dispatched when the user takes an action that should start
 * a search session.
 */
export const startSearchSession = action(
    'START_SEARCH_SESSION',
    (actionSource: string | null, shouldStartSearch: boolean, scenarioId: SearchScenarioId) => ({
        actionSource,
        shouldStartSearch,
        scenarioId,
    })
);
