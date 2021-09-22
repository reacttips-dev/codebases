import type { SearchScenarioId } from 'owa-search-store';
import { action } from 'satcheljs';

/**
 * This action is dispatched after the common search box starts the search session.
 * The consuming client should have an orchestrator that subscribes to it to handle
 * any scenario-specific initialization logic.
 */
export const searchSessionStarted = action(
    'SEARCH_SESSION_STARTED',
    (actionSource: string | null, shouldStartSearch: boolean, scenarioId: SearchScenarioId) => ({
        actionSource,
        shouldStartSearch,
        scenarioId,
    })
);
