import getServerSuggestions from './getSuggestions/getServerSuggestions';
import orderSuggestions from './getSuggestions/orderSuggestions';
import { updateIsSuggestionSetComplete as legacyUpdateIsSuggestionSetComplete } from '../actions/internalActions';
import { DEBOUNCE_DELAY_MS } from '../searchConstants';
import getSuggestionQueryString from '../selectors/getSuggestionQueryString';
import getSupportedSuggestionKinds from '../utils/getSupportedSuggestionKinds';
import getFolderNameFromScope from '../utils/getFolderNameFromScope';
import { default as getClientSuggestions } from './getSuggestions/getClientSuggestions';
import { getGuid } from 'owa-guid';
import {
    is3SServiceAvailable,
    lazyIsQFRequestIdEqualToLatest,
    lazySetLatestQFRequestId,
    setLatestRenderedQFTraceId,
} from 'owa-search';
import {
    getSuggestions,
    setCurrentSuggestions,
    lazyUpdateIsSuggestionSetComplete,
} from 'owa-search-actions';
import { SearchScenarioId, getScenarioStore } from 'owa-search-store';
import { isFeatureEnabled } from 'owa-feature-flags';
import type { SuggestionSet } from 'owa-search-service';
import { logClientSuggestions } from './getSuggestions/logClientSuggestions';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { createLazyOrchestrator } from 'owa-bundling';
import { returnTopExecutingActionDatapoint, PerformanceDatapoint } from 'owa-analytics';
import { getAggregationBucket } from 'owa-analytics-actions';
import store from '../store/store';

/**
 * - If QF is off:
 *      - If query text length is 0:
 *              - Delete zero query cached suggestions from store
 *              - Get client-side suggestions for keywords and people
 *              - Merge with client-side suggestions (category)
 *      - If query text length is non-zero:
 *              - SHORT-CIRCUIT: If we have client-side suggestions for query, return
 *              - Fetch suggestions using variety of suggestion type specific functions
 *              - Merge with client-side suggestions (category)
 *
 *  - If QF is on:
 *      - If query text length is 0:
 *              - Get client-side suggestions for keywords and people
 *              - Merge with client-side suggestions (category)
 *      - If query text length is non-zero:
 *              - Fetch suggestions using 3S suggestions endpoint and parse (sets stuff along the way)
 *              - Merge with client-side suggestions (category)
 */
export const getSuggestionsOrchestrator = createLazyOrchestrator(
    getSuggestions,
    'CLONE_GET_SUGGESTIONS',
    async actionMessage => {
        const { scenarioId } = actionMessage;

        const datapoint = returnTopExecutingActionDatapoint();
        datapoint?.addCustomData([scenarioId]);

        /**
         * DevOps 38525: Move the suggestion - generation code into its own package
         * so it can be reused by fileshub
         */
        if (scenarioId !== SearchScenarioId.Mail && scenarioId !== SearchScenarioId.FilesHub) {
            return;
        }

        // get the foldername to check scope of search
        const folderName: string = getFolderNameFromScope(store.staticSearchScope);

        // Do not start 3S search for StickyNotes experience
        if (folderName == 'notes' && isFeatureEnabled('notes-folder-view')) {
            return;
        }

        // If explicit logon / delegate access, don't provide suggestions.
        if (getUserConfiguration().SessionSettings.IsExplicitLogon) {
            return;
        }

        // Get query string from the store (user inputted text + pills).
        const queryString = getSuggestionQueryString(scenarioId);
        datapoint?.addCustomData([getAggregationBucket({ value: queryString.length })]);

        /**
         * Generate a GUID to serve as the request ID and set it in
         * the store.
         */
        let currentQfRequestId = null;
        if (is3SServiceAvailable()) {
            currentQfRequestId = getGuid();
            const setLatestQfRequestId = await lazySetLatestQFRequestId.import();
            setLatestQfRequestId(currentQfRequestId, scenarioId);
        }

        const getSuggestionsInternalParameters = {
            currentQfRequestId,
            queryString,
            scenarioId,
            datapoint,
        };

        return new Promise<void>(resolve => {
            // Wait DEBOUNCE_DELAY_MS before checking if we should get new suggestions.
            setTimeout(async () => {
                await getSuggestionsInternal(getSuggestionsInternalParameters);
                resolve();
            }, DEBOUNCE_DELAY_MS);
        });
    }
);

async function getSuggestionsInternal({
    currentQfRequestId,
    queryString,
    scenarioId,
    datapoint,
}: {
    queryString: string;
    scenarioId: SearchScenarioId;
    currentQfRequestId: string;
    datapoint: PerformanceDatapoint;
}): Promise<void> {
    const shouldGetSuggestionsResult = await shouldGetSuggestions({
        queryString: queryString,
        scenarioId: scenarioId,
        currentQfRequestId: currentQfRequestId,
    });

    datapoint?.addCustomData([shouldGetSuggestionsResult]);

    // Don't get suggestions if we shouldn't get suggestions.
    if (!shouldGetSuggestionsResult) {
        return;
    }

    // Get suggestion kinds that given scenario supports.
    const supportedSuggestionKinds = getSupportedSuggestionKinds(scenarioId);

    // Issue request to get server suggestions.
    const serverSuggestionSetPromise: Promise<SuggestionSet> = getServerSuggestions(
        scenarioId,
        queryString
    );

    // Wait for server suggestions, merge, and put them in the correct order.
    const serverSuggestionsSet = await serverSuggestionSetPromise;
    const serverSuggestions = serverSuggestionsSet.Suggestions;

    // Get client suggestions.
    const clientSuggestions = getClientSuggestions(queryString, serverSuggestions);

    /**
     * Continue if the search box isn't empty. If it's empty,
     * we don't want to override zero query suggestions.
     *
     * when trace ids are equal, it means getServerSuggestions returned what's
     * already in the store
     * an example is when QF calls A, B, C goes out,
     * and the response comes back out of order as C, B, A,
     * getServerSuggestions B and A will end up return back suggestion set C in store
     * because it's the latest suggestions set user wants
     */
    const searchStore = getScenarioStore(scenarioId);
    if (
        !searchStore.currentSuggestions ||
        searchStore.currentSuggestions.TraceId != serverSuggestionsSet.TraceId
    ) {
        // Log client suggestions after the QF trace ID comes back.
        logClientSuggestions(
            serverSuggestionsSet.TraceId,
            searchStore.nextSearchQueryId /* conversationID */,
            currentQfRequestId /* logicalID */,
            clientSuggestions.instrumentationContext
        );

        // Order and filter suggestions (based on supported suggestions).
        let suggestions = orderSuggestions(serverSuggestions.concat(clientSuggestions.suggestions));
        suggestions = suggestions.filter(suggestion =>
            supportedSuggestionKinds.includes(suggestion.kind)
        );

        if (serverSuggestions.length > 0) {
            setLatestRenderedQFTraceId(serverSuggestionsSet.TraceId, scenarioId);
        }

        setCurrentSuggestions(
            {
                Suggestions: suggestions,
                IsComplete: true,
                TraceId: serverSuggestionsSet.TraceId,
                RequestStart: serverSuggestionsSet.RequestStart,
            },
            scenarioId,
            currentQfRequestId
        );
    }

    // Dispatch action to mark suggestion set as completed.
    if (is3SServiceAvailable()) {
        const updateIsSuggestionSetComplete = await lazyUpdateIsSuggestionSetComplete.import();
        updateIsSuggestionSetComplete(true /* isComplete */, scenarioId);
    } else {
        legacyUpdateIsSuggestionSetComplete(queryString, true /* isComplete */);
    }
}

/**
 * Do not fetch new suggestions if:
 * - Query text has been changed
 * - Too many requests have been issued in succession (i.e. user typing away)
 *   - The exception here is zero query. Because we clear the currentQfRequestId
 *     (because zero query isn't served by QF), it won't be equal to
 *     the latest QF request ID in the store.
 */
async function shouldGetSuggestions({
    queryString,
    currentQfRequestId,
    scenarioId,
}: {
    queryString: string;
    currentQfRequestId: string;
    scenarioId: SearchScenarioId;
}): Promise<boolean> {
    const isQFRequestIdEqualToLatest = await lazyIsQFRequestIdEqualToLatest.import();

    return (
        queryString === getSuggestionQueryString(scenarioId) &&
        (isQFRequestIdEqualToLatest(currentQfRequestId, scenarioId) || currentQfRequestId === null)
    );
}
