import { endSearchSession, resetSearchStore, searchSessionEnded } from 'owa-search-actions';
import { getScenarioStore } from 'owa-search-store';
import getSubstrateSearchScenarioBySearchScenarioId from '../utils/getSubstrateSearchScenarioBySearchScenarioId';
import { logUsage } from 'owa-analytics';
import { trace } from 'owa-trace';
import { orchestrator } from 'satcheljs';
import { lazyClearLocalContentInstrumentationCache } from 'owa-search-service/lib/lazyFunctions';
import { SubstrateSearchScenario } from 'owa-search-service/lib/data/schema/SubstrateSearchScenario';
import {
    lazyLogSessionEnd,
    lazyFlushNonRenderedItemsFromCache,
    lazyLogSearchActions,
    lazyClearProcessedTraceIds,
} from 'owa-search-instrumentation';

export default orchestrator(endSearchSession, actionMessage => {
    const { scenarioId, actionSource = 'Unknown' } = actionMessage;

    const store = getScenarioStore(scenarioId);

    const searchSessionGuid = store.searchSessionGuid;
    const isLastRequestQF = store.latestTraceId === store.latestQFTraceId;
    const latestTraceId = store.latestTraceId;

    const isUsing3S = store.isUsing3S;

    // Throw if user isn't already in a search session.
    if (!searchSessionGuid) {
        trace.warn('searchSessionGuid should be set when ending a search session.');
        logUsage('MissingSearchSessionGuid', { actionSource });
        return;
    }

    /**
     * If using 3S, log instrumentation to end session, and flush any
     * non-rendered events from the event cache.
     */
    if (isUsing3S) {
        const substrateSearchScenario = getSubstrateSearchScenarioBySearchScenarioId(scenarioId);
        const traceId = isLastRequestQF ? store.latestRenderedQFTraceId : latestTraceId;
        if (substrateSearchScenario == SubstrateSearchScenario.Mail) {
            const logicalId = isLastRequestQF
                ? store.traceIdToLogicalIdMap.get(traceId)
                : store.currentSearchQueryId;

            lazyLogSearchActions.importAndExecute(
                substrateSearchScenario,
                null /* userId */,
                null /* tenantId */,
                logicalId ? logicalId : '00000000-0000-0000-0000-000000000000',
                null /* traceId */,
                'ExitSearch'
            );
        } else {
            lazyLogSessionEnd.importAndExecute(traceId, new Date(), substrateSearchScenario);
        }

        // Flush 3S telemetry events from cache.
        lazyFlushNonRenderedItemsFromCache.importAndExecute(substrateSearchScenario);
        lazyClearLocalContentInstrumentationCache.importAndExecute();
        lazyClearProcessedTraceIds.importAndExecute();
    }

    // Dispatch action to reset store (after getting values from it).
    resetSearchStore(scenarioId);

    /**
     * After common "end session" work is done, dispatch event to notify
     * consumer that search session has ended.
     */
    searchSessionEnded(searchSessionGuid, scenarioId, latestTraceId, actionSource);

    logUsage('SearchSessionEnded', [actionSource, scenarioId, searchSessionGuid]);
});
