import { endSearchConversation } from 'owa-search-actions';
import getSubstrateSearchScenarioBySearchScenarioId from '../utils/getSubstrateSearchScenarioBySearchScenarioId';
import { lazyClearLocalContentInstrumentationCache } from 'owa-search-service/lib/lazyFunctions';
import { orchestrator } from 'satcheljs';
import {
    lazyFlushNonRenderedItemsFromCache,
    lazyClearProcessedTraceIds,
} from 'owa-search-instrumentation';

/**
 * This orchstrator flushes the event cache for a particular search conversation
 * once the search conversation ends.
 *
 * A "conversation" is defined as a series of keystrokes follow by either:
 *  - A click on a suggestion
 *  - A search query being issued
 *  - Abandonment (search session ends)
 */
export default orchestrator(endSearchConversation, actionMessage => {
    const { scenarioId } = actionMessage;

    // Flush cache since conversation has ended.
    lazyFlushNonRenderedItemsFromCache.importAndExecute(
        getSubstrateSearchScenarioBySearchScenarioId(scenarioId)
    );
    lazyClearLocalContentInstrumentationCache.importAndExecute();
    lazyClearProcessedTraceIds.importAndExecute();
});
