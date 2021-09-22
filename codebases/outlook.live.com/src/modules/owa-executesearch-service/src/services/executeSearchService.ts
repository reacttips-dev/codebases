import type { SearchScope } from 'owa-search-service/lib/data/schema/SearchScope';
import type SuperExecuteSearchResponseMessage from 'owa-search-service/lib/data/schema/SuperExecuteSearchResponseMessage';
import getSearchRefiners from 'owa-search-service/lib/helpers/getSearchRefiners';
import getSearchRestrictions from 'owa-search-service/lib/helpers/getSearchRestrictions';
import getSortOrder from 'owa-search-service/lib/helpers/getSortOrder';
import type { PageContext } from 'owa-search-service/lib/helpers/pageContext';
import { getSearchScopeType } from 'owa-search-service/lib/helpers/searchScope/SearchScenario';
import type { PerformanceDatapoint } from 'owa-analytics';
import type SearchRequestInstrumentation from 'owa-search-service/lib/data/schema/SearchRequestInstrumentation';
import type ExecuteSearchResponseMessage from 'owa-service/lib/contract/ExecuteSearchResponseMessage';
import type ExecuteSearchSortOrder from 'owa-service/lib/contract/ExecuteSearchSortOrder';
import type ItemTypesFilter from 'owa-service/lib/contract/ItemTypesFilter';
import executeSearchJsonRequest from 'owa-service/lib/factory/executeSearchJsonRequest';
import executeSearchRequest from 'owa-service/lib/factory/executeSearchRequest';
import { getJsonRequestHeader } from 'owa-service/lib/ServiceRequestUtils';
import { makeExecuteSearchRequest } from './makeSearchRequest';
import type SubstrateSearchScenario from 'owa-search-service/lib/data/schema/SubstrateSearchScenario';
import { ListViewBitFlagsMasks, getIsBitSet } from 'owa-bit-flags/lib/utils/listViewBitFlagsUtil';
import type { OwaDate } from 'owa-datetime';

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
 * @param substrateSearchScenario Scenario identifier for 3S
 * @param maxHybridCountHint the number of TopResults to get (if zero or default, will only fetch DateTime results)
 * @param includeAttachments Search refiner to include results with attachments
 * @param fromDate Search refiner for beginning date to start searching from
 * @param toDate Sarch refiner for end date to end search at
 * @param upperBoundFieldUri Property to sort by (carried over from OWS')
 * @param lowerBoundFieldUri Property to sort by (carried over from OWS')
 * @param sortOrder How to sort search results
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
    substrateSearchScenario: SubstrateSearchScenario,
    maxHybridCountHint: number = 0,
    includeAttachments: boolean = false,
    fromDate: OwaDate = null,
    toDate: OwaDate = null,
    upperBoundFieldUri: string = null,
    lowerBoundFieldUri: string = null,
    sortOrder: ExecuteSearchSortOrder = null,
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

    return makeExecuteSearchRequest(
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
