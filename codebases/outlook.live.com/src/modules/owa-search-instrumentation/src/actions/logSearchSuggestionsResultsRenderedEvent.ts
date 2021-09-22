import { logResultsRendered } from './substrateSearchLogV2Events';
import type SubstrateSearchScenario from 'owa-search-service/lib/data/schema/SubstrateSearchScenario';

/**
 * Simple cache to track which trace IDs we've already logged ResultsRendered
 * events so that we don't send duplicate events to 3S.
 */
const processedTraceIds: string[] = [];

/**
 * This function is a wrapper for the base logResultsRendered function used
 * by search to ensure we don't log duplicate ResultRendered events for the same
 * request.
 */
export default function logSearchSuggestionsResultsRenderedEvent(
    substrateSearchScenario: SubstrateSearchScenario,
    logicalId: string,
    traceId: string,
    e2eLatency: number
) {
    if (!processedTraceIds.includes(traceId)) {
        processedTraceIds.push(traceId);
        logResultsRendered(substrateSearchScenario, logicalId, traceId, e2eLatency);
    }
}

/**
 * This function clears the cache (else it'll just continue to grow and take
 * up memory).
 */
export function clearProcessedResultsRenderedTraceIds() {
    processedTraceIds.length = 0;
}
