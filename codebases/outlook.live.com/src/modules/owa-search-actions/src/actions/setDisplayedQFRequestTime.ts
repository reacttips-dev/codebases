import type { SearchScenarioId } from 'owa-search-store';
import { action } from 'satcheljs';

/**
 * Action that the consuming client should dispatch when it wants to set displayedQFRequestTime
 * in the store (which is the time the request for the currently displayed QF suggestions
 * was sent out).
 */
export const setDisplayedQFRequestTime = action(
    'SET_DISPLAYED_QF_REQUEST_TIME',
    (displayedQFRequestTime: Date, scenarioId: SearchScenarioId) => ({
        displayedQFRequestTime,
        scenarioId,
    })
);
