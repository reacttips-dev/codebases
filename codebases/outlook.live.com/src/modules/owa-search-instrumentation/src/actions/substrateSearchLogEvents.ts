import type SubstrateEvent from 'owa-search-service/lib/data/schema/SubstrateEvent';
import type SubstrateSearchScenario from 'owa-search-service/lib/data/schema/SubstrateSearchScenario';
import substrateSearchLogEventsOperation from 'owa-search-service/lib/services/substrateSearchPostEventsService';
import { addLocalTimeAttribute } from '../helpers/addLocalTimeAttribute';
/**
 * States
 * ======
 * - START
 * - RESPONSE_RECEIVED
 * - RESPONSE_RENDERED
 * - RESPONSE_NEVER_RENDERED
 *
 * Transitions
 * ===========
 * - SERVER_RESPONSE_RECEIVED
 *      - from: START, to: RESPONSE_RECEIVED
 *      - Results in event being put into the cache
 * - COMPONENT_RENDERED
 *      - from: RESPONSE_RECEIVED, to: RESPONSE_RENDERED
 *      - SuggestionsContextMenu component
 * - STALE_QF_RESPONSE_RECEIVED
 *      - from: RESPONSE_RECEIVED, to: RESPONSE_NEVER_RENDERED
 *      - Compares current and latest QF IDs in getSearchSuggestions and is
 *        considered stale if they don't match
 *      - This handles the following cases:
 *          a.) Query text has changed and results came back too slowly to matter
 *          b.) A search request was already executed before results came back
 * - SEARCH_SESSION_ENDED
 *      - from: RESPONSE_RECEIVED, to: RESPONSE_NEVER_RENDERED
 *      - QF response was received, but never rendered (i.e. focus not in search
 *        box)
 *
 * Open issues
 * ===========
 * - If QF response is received, but focus is lost, and then user re-enters search
 *   box, we'll render the results, but latency will be high.
 * - If QF response is received, but focus is lost, and tab/browser closes, we will
 *   not instrument the request.
 */

/**
 * Cache holding dictionary of trace id -> (SubstrateEvent, Date) mappings.
 * Needed to record renderingLatency client side.
 */

/**
 * Cache holding dictionary of trace id -> (SubstrateEvent, Date) mappings.
 * Needed to record renderingLatency client side.
 */
const responseReceivedCache: { [traceId: string]: [SubstrateEvent, Date] } = {};

// Reasons why search box query text can change (other than explicit typing).
export type SearchBoxStateChangedReason = 'navigation' | 'ghost';

export function logEntityClicked(
    traceId: string,
    referenceId: string,
    currentTime: Date,
    substrateSearchScenario: SubstrateSearchScenario,
    index?: number
) {
    const event: SubstrateEvent = { Name: 'entityclicked', Attributes: [] };
    addLocalTimeAttribute(event, currentTime);

    // The index must be used if the referenceId is unavailable
    event.Attributes.push({ Key: 'id', Value: referenceId || (index + 1).toString() });

    substrateSearchLogEventsOperation(traceId, event, substrateSearchScenario);
}

export function logResponseReceived(
    traceId: string,
    latency: number,
    status: number,
    currentTime: Date,
    substrateSearchScenario?: SubstrateSearchScenario
) {
    // Item is only cached at this stage
    const event: SubstrateEvent = { Name: 'responsereceived', Attributes: [] };
    event.Attributes.push({ Key: 'latency', Value: latency.toString() });
    event.Attributes.push({ Key: 'status', Value: status.toString() });
    responseReceivedCache[traceId] = [event, currentTime];
}

export function logSessionEnd(
    traceId: string,
    currentTime: Date,
    substrateSearchScenario: SubstrateSearchScenario
) {
    /**
     * Default to "empty" GUID in case where user quickly enters and leaves the
     * search box before any requests complete such that the "sessionend" event
     * gets tagged with some GUID.
     */
    const traceIdToLog = traceId || '00000000-0000-0000-0000-000000000000';

    const event: SubstrateEvent = { Name: 'sessionend', Attributes: [] };
    addLocalTimeAttribute(event, currentTime);
    substrateSearchLogEventsOperation(traceIdToLog, event, substrateSearchScenario);
}

export function logResponseRendered(
    traceId: string,
    currentTime: Date,
    substrateSearchScenario: SubstrateSearchScenario
) {
    // get a reference to any existing entry, then
    // delete it so we don't log the same response
    // event twice
    const responseCacheItem = responseReceivedCache[traceId];
    delete responseReceivedCache[traceId];

    if (responseCacheItem) {
        // Use promise resolve to capture the rest of the Javascript rendering time
        Promise.resolve().then(() => {
            const timeElapsed: number = currentTime.getTime() - responseCacheItem[1].getTime();

            responseCacheItem[0].Attributes.push({
                Key: 'renderinglatency',
                Value: timeElapsed.toString(),
            });
            responseCacheItem[0].Attributes.push({ Key: 'rendered', Value: '1' });
            substrateSearchLogEventsOperation(
                traceId,
                responseCacheItem[0],
                substrateSearchScenario
            );
        });
    }
}

export function logResponseNeverRendered(
    traceId: string,
    substrateSearchScenario: SubstrateSearchScenario
) {
    // get a reference to any existing entry, then
    // delete it so we don't log the same response
    // event twice
    const responseCacheItem = responseReceivedCache[traceId];
    delete responseReceivedCache[traceId];

    if (responseCacheItem) {
        responseCacheItem[0].Attributes.push({ Key: 'renderinglatency', Value: '-1' });
        responseCacheItem[0].Attributes.push({ Key: 'rendered', Value: '0' });
        substrateSearchLogEventsOperation(traceId, responseCacheItem[0], substrateSearchScenario);
    }
}

/**
 * This function is used to flush out any lingering "responsereceived" events
 * from the cache as suggestion sets that were never rendered.
 */
export function flushNonRenderedResponseReceivedItemsFromCache(
    substrateSearchScenario: SubstrateSearchScenario
) {
    Object.keys(responseReceivedCache).forEach(traceId =>
        logResponseNeverRendered(traceId, substrateSearchScenario)
    );
}

/**
 * This event should be fire for all user actions (excluding the explicit
 * query typing) which alter the search box query state.
 */
export function logSearchBoxStateChanged(
    currentTime: Date,
    reason: SearchBoxStateChangedReason,
    referenceId: string,
    traceId: string,
    substrateSearchScenario: SubstrateSearchScenario
) {
    const event: SubstrateEvent = { Name: 'searchboxstatechanged', Attributes: [] };
    event.Attributes.push({ Key: 'id', Value: referenceId });
    addLocalTimeAttribute(event, currentTime);
    event.Attributes.push({ Key: 'reason', Value: reason });
    substrateSearchLogEventsOperation(traceId, event, substrateSearchScenario);
}

export function logSearchResultInteraction(
    traceId: string,
    interactionType: string,
    rankOrReferenceKey: string,
    currentTime: Date,
    substrateSearchScenario: SubstrateSearchScenario,
    additionalAttributes?: any[]
) {
    const event: SubstrateEvent = { Name: interactionType, Attributes: [] };
    addLocalTimeAttribute(event, currentTime);
    event.Attributes.push({ Key: 'id', Value: rankOrReferenceKey });
    if (additionalAttributes) {
        event.Attributes.push(...additionalAttributes);
    }
    substrateSearchLogEventsOperation(traceId, event, substrateSearchScenario);
}
