import { logClientLayout } from './substrateSearchLogV2Events';
import type ResultsView from '../data/schema/ResultsView';
import type { GroupLayoutType } from '../data/schema/substrateSearchLogTypes';
import type SubstrateSearchScenario from 'owa-search-service/lib/data/schema/SubstrateSearchScenario';

/**
 * Simple cache to track which trace IDs we've already logged ClientLayout
 * events so that we don't send duplicate events to 3S.
 */
const processedTraceIds: string[] = [];

/**
 * This function is a wrapper for the base logClientLayout function used
 * by search to ensure we don't log duplicate ClientLayout events for the same
 * request.
 */
export default function logSearchSuggestionsClientLayoutEvent(
    substrateSearchScenario: SubstrateSearchScenario,
    userId: string,
    tenantId: string,
    logicalId: string,
    traceId: string,
    layoutType: GroupLayoutType,
    resultsView: ResultsView[],
    part?: number,
    verticalType?: string
) {
    if (!processedTraceIds.includes(traceId)) {
        processedTraceIds.push(traceId);
        logClientLayout(
            substrateSearchScenario,
            userId,
            tenantId,
            logicalId,
            traceId,
            layoutType,
            resultsView,
            part,
            verticalType
        );
    }
}

/**
 * This function clears the cache (else it'll just continue to grow and take
 * up memory).
 */
export function clearProcessedClientLayoutTraceIds() {
    processedTraceIds.length = 0;
}
