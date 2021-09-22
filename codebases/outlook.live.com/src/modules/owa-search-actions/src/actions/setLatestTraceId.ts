import type { SearchScenarioId } from 'owa-search-store';
import { action } from 'satcheljs';

/**
 * Action that the consuming client should dispatch if it wants to set the
 * latest trace ID (QF or query) in the store.
 */
export const setLatestTraceId = action(
    'SET_LATEST_TRACE_ID',
    (latestTraceId: string, scenarioId: SearchScenarioId, isQFTraceId: boolean) => ({
        latestTraceId,
        scenarioId,
        isQFTraceId,
    })
);
