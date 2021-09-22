import substrateSearchService from 'owa-search-service/lib/services/substrateSearchService';
import type { PerformanceDatapoint } from 'owa-analytics';
import { getIsBitSet, ListViewBitFlagsMasks } from 'owa-bit-flags/lib/utils/listViewBitFlagsUtil';
import type { OwaDate } from 'owa-datetime';
import SearchProvider from 'owa-search-service/lib/data/schema/SearchProvider';
import type SearchRequestInstrumentation from 'owa-search-service/lib/data/schema/SearchRequestInstrumentation';
import type { SearchScope } from 'owa-search-service/lib/data/schema/SearchScope';
import type SubstrateSearchRequest from 'owa-search-service/lib/data/schema/SubstrateSearchRequest';
import type SubstrateSearchResponse from 'owa-search-service/lib/data/schema/SubstrateSearchResponse';
import type SubstrateSearchScenario from 'owa-search-service/lib/data/schema/SubstrateSearchScenario';
import type SuperExecuteSearchResponseMessage from 'owa-search-service/lib/data/schema/SuperExecuteSearchResponseMessage';
import getSearchRefiners from 'owa-search-service/lib/helpers/getSearchRefiners';
import getSearchRestrictions from 'owa-search-service/lib/helpers/getSearchRestrictions';
import getSortOrder from 'owa-search-service/lib/helpers/getSortOrder';
import type { PageContext } from 'owa-search-service/lib/helpers/pageContext';
import { getSearchScopeType } from 'owa-search-service/lib/helpers/searchScope/SearchScenario';
import executeSearchRequestToSubstrateRequest from '../helpers/substrateTransformations/request/executeSearchRequestToSubstrateRequest';
import augmentExecuteSearchResponseMessage from '../helpers/substrateTransformations/response/augmentExecuteSearchResponseMessage';
import substrateResponseToExecuteSearchResponse from '../helpers/substrateTransformations/response/substrateResponseToExecuteSearchResponse';
import type ExecuteSearchJsonResponse from 'owa-service/lib/contract/ExecuteSearchJsonResponse';
import type ExecuteSearchResponseMessage from 'owa-service/lib/contract/ExecuteSearchResponseMessage';
import type ExecuteSearchSortOrder from 'owa-service/lib/contract/ExecuteSearchSortOrder';
import type ItemTypesFilter from 'owa-service/lib/contract/ItemTypesFilter';
import executeSearchJsonRequest from 'owa-service/lib/factory/executeSearchJsonRequest';
import executeSearchRequest from 'owa-service/lib/factory/executeSearchRequest';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import * as trace from 'owa-trace';
import makeSubstrateSearchRequest, {
    makeExecuteSearchRequest,
    buildInstrumentation,
} from 'owa-search-service/lib/services/makeSearchRequest';

const MAX_RESULTS_COUNT_HINT: number = 250; // The maximum number of results we will ever ask for.

/**
 * Calls ExecuteSearch
 * @param pageContext The page of this query to get
 * @param queryString the queryString
 * @param sessionGuid the current search session
 * @param queryGuid the current search query
 * @param staticSearchScope the scope of the current query
 * @param searchNumber the search number in the current session
 * @param itemTypes the item types of the search results
 * @param executeSearchDatapoint the E2E execute search datapoint
 * @param actionSource Where search was initiated from
 * @param searchApiPreference Should we use ExecuteSearch or 3S?
 * @param substrateSearchScenario Scenario identifier for 3S
 * @param maxHybridCountHint the number of TopResults to get (if zero or default, will only fetch DateTime results)
 * @param includeAttachments Search refiner to include results with attachments
 * @param fromDate Search refiner for beginning date to start searching from
 * @param toDate Sarch refiner for end date to end search at
 * @param upperBoundFieldUri Property to sort by (carried over from OWS')
 * @param lowerBoundFieldUri Property to sort by (carried over from OWS')
 * @param sortOrder How to sort search results
 * @param skipAddToHistory set to true to skip adding search query to history
 * @param clientQueryAlterationReason used when skipAddToHistory is set. Gives the scenario for skipping to the service
 * @param xClientFlightsHeaderValue Value to use for X-Client-Flights header containing a comma separated list of server flight names
 * @returns The promise which resolves after the server response containing:
 * @returns [0] - The ExecuteSearchJsonResponse
 * @returns [1] - The SearchRequestInstrumentation object for this request
 * @returns [2] - The URL of the request
 */
export default async function executeSearchService(
    pageContext: PageContext,
    queryString: string,
    sessionGuid: string,
    queryGuid: string,
    staticSearchScope: SearchScope,
    searchNumber: number,
    itemTypes: ItemTypesFilter,
    executeSearchDatapoint: PerformanceDatapoint,
    actionSource: string,
    searchApiPreference: SearchProvider,
    substrateSearchScenario: SubstrateSearchScenario,
    maxHybridCountHint: number = 0,
    includeAttachments: boolean = false,
    fromDate: OwaDate = null,
    toDate: OwaDate = null,
    upperBoundFieldUri: string = null,
    lowerBoundFieldUri: string = null,
    sortOrder: ExecuteSearchSortOrder = null,
    skipAddToHistory: boolean = false,
    clientQueryAlterationReason: string = null,
    isAlterationsRecourse: boolean = false,
    xClientFlightsHeaderValue: string = null,
    customHeaders: { [key: string]: string } = null
): Promise<[SuperExecuteSearchResponseMessage, SearchRequestInstrumentation, string]> {
    // Build the request header for the ExecuteSearch request.
    const jsonHeader = getJsonRequestHeader();
    jsonHeader.RequestServerVersion = 'V2016_06_15';

    // Build the ExecuteSearch request.
    const executeSearchReq = {
        Header: jsonHeader,
        Body: executeSearchRequest({
            ApplicationId: 'Owa',
            IdFormat: 'EwsId',
            IncludeDeleted: !getIsBitSet(ListViewBitFlagsMasks.ExcludeDeletedItemsInSearch),
            ItemTypes: itemTypes,
            MaxPreviewLength: 60,
            MaxRefinersCountPerRefinerType: 5,
            MaxResultsCountHint: MAX_RESULTS_COUNT_HINT,
            PropertySetName: 'Owa16',
            Query: queryString,
            ResultRowCount: pageContext.resultRowCount,
            ResultRowOffset: pageContext.resultRowOffset,
            RetrieveRefiners: false,
            Scenario: actionSource == 'Calendar' ? 'CalendarSearch' : 'MailSearch',
            SearchRefiners: getSearchRefiners(includeAttachments),
            SearchScope: getSearchScopeType(staticSearchScope),
            SearchRestrictions: getSearchRestrictions(
                fromDate,
                toDate,
                upperBoundFieldUri,
                lowerBoundFieldUri
            ),
            SearchSessionId: sessionGuid,
            SortOrder: getSortOrder(sortOrder, maxHybridCountHint),
            MaxHybridCountHint: maxHybridCountHint,
        }),
    };
    const executeSearchJsonReq = executeSearchJsonRequest(executeSearchReq);

    /**
     * Treat pageNumber as -1 if we're not in a real search (i.e we're doing
     * warmup queries and not showing results to users). Otherwise, just use the
     * actual page number of the search.
     */
    const pageNumber = searchNumber === -1 ? -1 : pageContext.pageNumber;

    /**
     * If preferred search API is 3S and the proxy flight is enabled,
     * call 3S directly (doing ExecuteSearch translation of request
     * and response before and after request). Otherwise, use OWS' API.
     */
    if (
        searchApiPreference === SearchProvider.Substrate ||
        searchApiPreference === SearchProvider.SubstrateV2
    ) {
        const substrateApiVersion = searchApiPreference === SearchProvider.Substrate ? 1 : 2;
        try {
            // Convert ES request to 3S request.
            const substrateSearchRequest: SubstrateSearchRequest = executeSearchRequestToSubstrateRequest(
                {
                    request: executeSearchJsonReq,
                    cvid: queryGuid,
                    skipAddToHistory: skipAddToHistory,
                    clientQueryAlterationReason: clientQueryAlterationReason,
                    pageNumber: pageNumber,
                    substrateSearchScenario: substrateSearchScenario,
                    isAlterationsRecourse: isAlterationsRecourse,
                    apiVersion: substrateApiVersion,
                }
            );

            /**
             * If a search E2E datapoint was specified, we want to add a
             * checkmark to record the pre-request JavaScript time and request
             * JavaScript thread time.
             */
            let preRequestJSTime = 0;
            let requestJSThreadTime = 0;
            if (executeSearchDatapoint) {
                preRequestJSTime = executeSearchDatapoint.addCheckmark('ClientJSPreRequestTime');

                Promise.resolve().then(() => {
                    requestJSThreadTime = executeSearchDatapoint.addCheckmark(
                        'ClientJSRequestThread'
                    );
                });
            }

            // Make service request.
            const clientRequestStart = new Date();
            let result = await substrateSearchService(
                substrateSearchRequest,
                sessionGuid,
                xClientFlightsHeaderValue,
                [] /* ConnectedAccount */,
                customHeaders,
                substrateApiVersion
            );
            const clientRequestEnd = new Date();

            // if result is null or incomplete, just return
            if (!result || result.length != 2) {
                return null;
            }

            const [substrateSearchResponse, headers] = result;
            /**
             * Get body of substrate request if request is successful. Otherwise,
             * there's no valid payload so do not parse (and the body goes unused
             * anyway).
             */
            let substrateSearchResponseBody = null;
            if (substrateSearchResponse?.json) {
                substrateSearchResponseBody = <SubstrateSearchResponse>(
                    await substrateSearchResponse.json().catch((error: any) => {
                        return [error];
                    })
                );
            }

            // Convert 3S response to ExecuteSearch response.
            const executeSearchResponse: ExecuteSearchJsonResponse = await substrateResponseToExecuteSearchResponse(
                substrateSearchResponse,
                substrateSearchResponseBody,
                substrateSearchRequest,
                substrateApiVersion
            );

            // Augment normal ExecuteSearchResponseMessage with new stuff from 3S.
            const superExecuteSearchResponseMessage: SuperExecuteSearchResponseMessage = await augmentExecuteSearchResponseMessage(
                substrateSearchResponse,
                substrateSearchResponseBody,
                executeSearchResponse.Body
            );

            // Create search instrumentation, and add waterfall times.
            const searchInstrumentation = buildInstrumentation(
                substrateSearchResponse,
                executeSearchJsonReq.Body.Query,
                substrateSearchResponse.status == 200
                    ? null
                    : executeSearchResponse
                    ? JSON.stringify(executeSearchResponse.Body)
                    : null,
                searchApiPreference,
                clientRequestStart,
                clientRequestEnd,
                queryGuid,
                new Headers(headers),
                pageContext.pageNumber,
                substrateSearchScenario
            );
            searchInstrumentation.ClientJSPreRequestTime = preRequestJSTime;
            searchInstrumentation.ClientJSRequestThreadTime = requestJSThreadTime;

            return [
                superExecuteSearchResponseMessage,
                searchInstrumentation,
                substrateSearchResponse.url,
            ];
        } catch (e) {
            trace.errorThatWillCauseAlert(
                'An unexpected error occurred while processing a Substrate Search request: ' + e
            );
            return null;
        }
    } else {
        const makeSearchRequest =
            searchApiPreference === SearchProvider.ExecuteSearch
                ? makeExecuteSearchRequest
                : makeSubstrateSearchRequest;

        return makeSearchRequest(
            executeSearchJsonReq,
            pageContext.pageNumber,
            queryGuid,
            executeSearchDatapoint,
            actionSource,
            substrateSearchScenario
        )
            .then(result => {
                const returnValue: [
                    ExecuteSearchResponseMessage,
                    SearchRequestInstrumentation,
                    string
                ] = [result[0].Body, result[1], result[2]];
                return returnValue;
            })
            .catch(e => null);
    }
}
