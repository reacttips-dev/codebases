import type { SearchScenarioId } from 'owa-search-store';
import { action } from 'satcheljs';

/**
 * Action dispatched when user exits search mode (i.e. clicking the back arrow
 * in the search box). Consuming client should set up an orchestrator to subscribe
 * to it and handle what should happen in that case (i.e. end search session).
 */
export const exitSearch = action(
    'EXIT_SEARCH',
    (actionSource: string, scenarioId: SearchScenarioId, forceExit: boolean = false) => ({
        actionSource,
        scenarioId,
        forceExit,
    })
);
