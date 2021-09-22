import type { SearchScenarioId } from 'owa-search-store';
import { action } from 'satcheljs';

/**
 * This action is dispatched when the user takes an action that should end
 * a search session.
 */
export const endSearchSession = action(
    'END_SEARCH_SESSION',
    (scenarioId: SearchScenarioId, actionSource?: string) => ({
        scenarioId,
        actionSource,
    })
);
