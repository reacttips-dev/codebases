import type { SearchScenarioId } from 'owa-search-store';
import { action } from 'satcheljs';

/**
 * This action is dispatched after the common search box ends the search session.
 * The consuming client should have an orchestrator that subscribes to it to handle
 * any scenario-specific logic for when a session ends.
 */
export const searchSessionEnded = action(
    'SEARCH_SESSION_ENDED',
    (
        searchSessionGuid: string,
        scenarioId: SearchScenarioId,
        latestTraceId: string,
        actionSource: string
    ) => ({
        searchSessionGuid,
        scenarioId,
        latestTraceId,
        actionSource,
    })
);
