import { setTableViewId } from './internalActions';
import getItemTypesFromTable from '../helpers/getItemTypesFromTable';
import { getResultsView } from '../helpers/getResultView';
import getTotalRowsInViewInResponse from '../helpers/getTotalRowsInViewInResponse';
import { GenericKeys } from 'owa-analytics/lib/types/DatapointEnums';
import { executeSearchService } from 'owa-executesearch-substratesearch-transformers';
import { isFeatureEnabled } from 'owa-feature-flags';
import type { ConversationType, ItemRow } from 'owa-graph-schema';
import { getGuid } from 'owa-guid';
import { appendRowResponse } from 'owa-mail-list-response-processor';
import type { SearchTableQuery } from 'owa-mail-list-search';
import { getIsSearchTableShown, MailListRowDataType, TableView } from 'owa-mail-list-store';
import type { OnInitialTableLoadComplete } from 'owa-mail-loading-action-types';
import { getStore as getMailSearchStore, isSearchFilterApplied } from 'owa-mail-search';
import { mapTableQueryToTableViewOptions } from 'owa-mail-tableview-options';
import * as undoActions from 'owa-mail-undo';
import { endSearchConversation, setLatestTraceId, startSearch } from 'owa-search-actions';
import { getScenarioStore, SearchScenarioId } from 'owa-search-store';
import type ItemTypesFilter from 'owa-service/lib/contract/ItemTypesFilter';
import type SearchResultsType from 'owa-service/lib/contract/SearchResultsType';
import { lazyGetAccessTokenforResource } from 'owa-tokenprovider/lib/lazyFunctions';
import { action } from 'satcheljs/lib/legacy';
import {
    PerformanceDatapoint,
    lazyGetResourceTimingForUrl,
    DatapointStatus,
    logUsage,
} from 'owa-analytics';
import {
    lazyAddSearchRequestInstrumentation,
    lazyAddResourceTimingEntry,
} from 'owa-search-diagnostics';
import {
    getNextPageContext,
    getPageContext,
    PageContext,
    SearchRequestInstrumentation,
    SubstrateSearchScenario,
    SearchScopeKind,
    SearchProvider,
} from 'owa-search-service';
import {
    lazyLogResponseReceivedV2,
    lazyLogResultsRendered,
    lazyLogClientLayout,
} from 'owa-search-instrumentation';
import {
    lazySetSpellerData,
    queryIncludesKQLSuggestion as queryIncludesKQLSuggestionSelector,
    getHighlightTerms,
    getXClientFlightsHeaderValue,
} from 'owa-search';

const SUCCESS_STATUS_CODE = 200;

function onProcessSearchResultsComplete(
    clientRenderingDatapoint: PerformanceDatapoint,
    searchInstrumentation: SearchRequestInstrumentation,
    executeSearchDatapoint: PerformanceDatapoint
) {
    // Add checkmark for time from when we receive server response to after process response,
    // this time will not include rendering.
    searchInstrumentation.ClientResponseProcessTime = clientRenderingDatapoint.addCheckmark(
        'ProcessResponseTime'
    );

    /**
     * To be consistent with other clients, we should report E2E time from the
     * time the user initiates the request until we process the response (i.e. don't
     * include rendering).
     */
    if (executeSearchDatapoint) {
        searchInstrumentation.ClientJSEndToEndTime = executeSearchDatapoint.addCheckmark(
            'ClientJSEndToEndTime'
        );
    }

    /**
     * Use a combination of requestAnimationFrame and Promise.resolve to jump to
     * end of JS thread (and after render) so that we can capture rendering time.
     */
    requestAnimationFrame(() =>
        Promise.resolve().then(() => {
            clientRenderingDatapoint.end();

            /**
             * Our best calculation of search result rendering time is the length
             * of the entire executeSearch request minus the ClientJSEndToEndTime
             * checkmark (captured above and is the time up until render).
             */
            if (executeSearchDatapoint) {
                searchInstrumentation.ClientJSRenderingTime =
                    <number>executeSearchDatapoint.getData(GenericKeys.e2eTimeElapsed) -
                    executeSearchDatapoint.waterfallTimings['ClientJSEndToEndTime'];
            }
        })
    );
}

/**
 * Callback for when the execute search has been completed
 * @param currentPageContext the current page context
 * @param tableView the search table view
 * @param searchResult for the current page number
 * @param itemTypes the item types of the serach results
 * @param searchSessionGuid id for search session
 * @param searchQueryId id of the current searchQuery
 */
export let onExecuteSearchCompleted = action('onExecuteSearchCompleted')(
    async function onExecuteSearchCompleted(
        currentPageContext: PageContext,
        tableView: TableView,
        searchResult: SearchResultsType,
        maxTopResults: number,
        itemTypes: ItemTypesFilter,
        searchSessionGuid: string,
        actionSource: string,
        searchQueryId?: string,
        searchRequestId?: string
    ) {
        let rows: MailListRowDataType[];
        switch (itemTypes) {
            case 'MailConversations':
                rows = searchResult.Conversations?.map(c => c as ConversationType);
                break;

            case 'MailItems':
                rows = searchResult.Items?.map(a => a as ItemRow);
                break;
        }

        // If there are results, add them to the table.
        if (rows) {
            // Loop over all the rows from the search result to add the instanceKeys
            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                row.ReferenceKey = row.InstanceKey;
                row.InstanceKey = getGuid();
            }

            appendRowResponse(
                tableView,
                rows,
                getTotalRowsInViewInResponse({
                    pageNumber: currentPageContext.pageNumber,
                    resultsCount: rows.length,
                    rowsInTableCount: tableView.rowKeys.length,
                }) /* totalRowsInViewInResponse */,
                'AppendOnSearch',
                searchRequestId,
                searchQueryId
            );
        }

        // No need to proceed further if there are no results.
        if (!rows) {
            return;
        }

        const searchProvider = (tableView.tableQuery as SearchTableQuery).searchProvider;

        /**
         * Log a ClientLayout event which represents what the results page
         * looks like to the user (including any search results and any suggested
         * modifications, i.e. speller, etc.).
         */
        if (
            searchProvider === SearchProvider.Substrate ||
            searchProvider === SearchProvider.SubstrateV2
        ) {
            setTableViewId(tableView.id);

            /**
             * Instrumentation isn't required if there is nothing shown to the
             * user, so only log the event if resultsView isn't empty.
             */
            const resultsView = getResultsView(tableView);

            if (resultsView.length === 0 && rows.length > 0) {
                logUsage('Search_Empty_ResultsView', [rows.length], { isCore: true });
            }

            if (resultsView.length > 0) {
                lazyLogClientLayout.importAndExecute(
                    SubstrateSearchScenario.Mail,
                    null /* Puid */,
                    null /* TenantId */,
                    searchQueryId,
                    searchRequestId,
                    'Vertical',
                    resultsView,
                    currentPageContext.pageNumber
                );
            }
        }

        /**
         * Don't replace the highlightTerms if we already have them, since
         * we don't want to re-render all items in the listview, and the
         * search terms shouldn't change within a query.
         */
        if (
            searchResult.SearchTerms &&
            !tableView.highlightTerms &&
            mapTableQueryToTableViewOptions(tableView.tableQuery).shouldHighlight
        ) {
            tableView.highlightTerms = getHighlightTerms(searchResult);
        }

        tableView.currentLoadedIndex = tableView.rowKeys.length;

        if (currentPageContext.pageNumber == 0) {
            (tableView.tableQuery as SearchTableQuery).lastIndexFetched =
                tableView.rowKeys.length - 1;
        }

        const searchScope = (tableView.tableQuery as SearchTableQuery).searchScope;
        const searchScopeKind = searchScope ? searchScope.kind : null;

        // Perform next page request if necessary
        const nextPageContext = getNextPageContext(
            currentPageContext,
            searchResult,
            searchScopeKind
        );
        if (nextPageContext) {
            await performExecuteSearch(
                nextPageContext,
                tableView,
                null /* onInitialTableLoadComplete */,
                null /* executeSearchDatapoint */,
                itemTypes,
                searchSessionGuid,
                searchQueryId,
                actionSource,
                maxTopResults
            );
        }
    }
);

/**
 * Perform backfill requests
 * @param currentPageContext current page context
 * @param tableView the search table view
 * @param onInitialTableLoadComplete is a callback that is called when we receive the response
 * The callback is handled by table loading
 * @param executeSearchDatapoint - the E2E execute search datapoint
 * @param itemTypes the item types of the serach results
 * @param maxTopResults the max number of top results to fetch
 * @param searchQueryId the search Query Id
 * @return a promise that resolves when the search from server has completed
 */
export let performExecuteSearch = action('performExecuteSearch')(
    async function performExecuteSearch(
        currentPageContext: PageContext,
        tableView: TableView,
        onInitialTableLoadComplete: OnInitialTableLoadComplete,
        executeSearchDatapoint: PerformanceDatapoint,
        itemTypes: ItemTypesFilter,
        searchSessionGuid: string,
        searchQueryId: string,
        actionSource: string,
        maxTopResults: number = 0
    ): Promise<void> {
        const mailSearchStore = getMailSearchStore();

        const searchTableQuery = tableView.tableQuery as SearchTableQuery;

        /**
         * A client-side flight is used here to determine the availability of
         * the "Portable Ranker" (which is used to determine top results) because
         * the service doesn't expose a way for us to know if it's available or
         * not.
         *
         * If the ranker is not available (in special environments outlined by the
         * flight rollout where the flight is DISABLED), then we have to set the
         * SortOrder to "DateTime" so the "Portable Ranker" isn't called. Only
         * do this in ExecuteSearch scenarios.
         *
         * If the ranker is available (flight is ENABLED), then we don't have to
         * set the SortOrder here as it will be determined within
         * executeSearchService.
         */
        const sortOrder =
            !isFeatureEnabled('sea-hybridSearchSupported') &&
            searchTableQuery.searchProvider === SearchProvider.ExecuteSearch
                ? 'DateTime'
                : null;

        const queryIncludesPeopleSuggestion =
            queryIncludesKQLSuggestionSelector(SearchScenarioId.Mail) ||
            searchTableQuery.scenarioType === 'persona';

        const queryIncludesGeneratedKql = isSearchFilterApplied(searchTableQuery);

        const clientQueryAlterationReason = queryIncludesPeopleSuggestion
            ? 'PeopleSearch Scenario'
            : queryIncludesGeneratedKql
            ? 'InteractiveFilter Scenario'
            : null;

        let customHeaders: { [key: string]: string } = {};
        if (
            (searchTableQuery.searchProvider == SearchProvider.Substrate ||
                searchTableQuery.searchProvider == SearchProvider.SubstrateV2) &&
            searchTableQuery.searchScope.kind == SearchScopeKind.ArchiveMailbox
        ) {
            // 3S requires an AAD token for archive search
            // To get this we specify preferIdpToken when requesting a token
            let token = await lazyGetAccessTokenforResource.importAndExecute(
                window.location.origin, // resource
                null, // apiName
                null, // requestId
                null, // targetTenantId
                null, // wwwAuthenticateHeader
                true //preferIdpToken
            );

            customHeaders['Authorization'] = 'Bearer ' + token;
        }

        logUsage('Search_RequestSent', {
            provider: searchTableQuery.searchProvider,
            searchSessionGuid: searchSessionGuid,
            searchQueryId: searchQueryId,
        });

        // VSO-16118 https://outlookweb.visualstudio.com/Outlook%20Web/_workitems/edit/16118
        // [Search] Move execute search request parameters on the search table query from the search store
        return executeSearchService(
            currentPageContext,
            searchTableQuery.queryString,
            searchSessionGuid,
            searchQueryId,
            searchTableQuery.searchScope,
            mailSearchStore.searchNumber,
            itemTypes,
            executeSearchDatapoint,
            actionSource,
            searchTableQuery.searchProvider,
            SubstrateSearchScenario.Mail /* 3S scenario identifier */,
            maxTopResults,
            searchTableQuery.includeAttachments,
            searchTableQuery.fromDate,
            searchTableQuery.toDate,
            null /* upperBoundFieldUri*/,
            null /* lowerBoundFieldUri */,
            sortOrder,
            queryIncludesPeopleSuggestion || queryIncludesGeneratedKql,
            clientQueryAlterationReason,
            mailSearchStore.isAlterationRecourse,
            getXClientFlightsHeaderValue(SearchScenarioId.Mail),
            customHeaders
        ).then(result => {
            logUsage('Search_ResponseRecieved', {
                provider: searchTableQuery.searchProvider,
                searchSessionGuid: searchSessionGuid,
                searchQueryId: searchQueryId,
            });

            if (!result) {
                logUsage('Search_EmptyResponse', {
                    searchSessionGuid: searchSessionGuid,
                    searchQueryId: searchQueryId,
                });

                // result can be null, in which case some client-side exception
                // caused us to lose the result
                if (executeSearchDatapoint) {
                    executeSearchDatapoint.endWithError(
                        DatapointStatus.ServerError,
                        Error('Unexpected client-side error')
                    );
                }

                // Tell the Mail List to render an error view
                onInitialTableLoadComplete(
                    tableView,
                    false /* isSuccessfulResponse */,
                    'UnexpectedClientError',
                    false /* isTablePrefetched */
                );

                return;
            }

            // Push instrumentation to diagnostics store and panel
            const searchInstrumentation = result[1];
            lazyAddSearchRequestInstrumentation
                .import()
                .then(addSearchRequestInstrumentation =>
                    addSearchRequestInstrumentation(searchInstrumentation)
                );

            const timingPromise = lazyGetResourceTimingForUrl.importAndExecute(result[2]);

            // log that the response was recieved
            if (
                searchTableQuery.searchProvider === SearchProvider.Substrate ||
                searchTableQuery.searchProvider === SearchProvider.SubstrateV2
            ) {
                // The searchInstrumentation.ClientNetworkTime is measured by set a start point before calling a web service,
                // and set an end point in this web service's callback function. We noticed an average ~150ms JavaScript
                // callback latency when reporting the network time to 3S. Because we are able to retrieve the web service network time by
                // Performance API, we will use this more accurate number (almost no latency comparing to the number from network trace tools) if it is available.
                // Please notice it is a known issue that this doesn't work in IE because the response object from the fetch method doesn't contain url property.
                // And this response.url is the key point to use Performance API. So we will fall back to use ClientNetworkTime in IE or any other legacy browsers.
                timingPromise.then(timing => {
                    const networkTime = timing
                        ? timing.RpE
                        : searchInstrumentation.ClientNetworkTime;

                    logUsage('Search_LogResponseRecieved', {
                        provider: searchTableQuery.searchProvider,
                        searchSessionGuid: searchSessionGuid,
                        searchQueryId: searchQueryId,
                        traceId: searchInstrumentation.SearchTraceID,
                        statusCode: searchInstrumentation.ClientHttpStatus,
                    });

                    lazyLogResponseReceivedV2.importAndExecute(
                        SubstrateSearchScenario.Mail,
                        searchInstrumentation.SearchTraceID,
                        networkTime,
                        searchInstrumentation.ClientHttpStatus
                    );
                });
            }

            // We do not proceed with processing the search response if
            // 1. User has already navigated out of search
            // 2. User has started a new search
            if (
                !getIsSearchTableShown() ||
                (tableView.tableQuery as SearchTableQuery).searchNumber !=
                    mailSearchStore.searchNumber
            ) {
                logUsage('SearchAbandonded', {
                    provider: searchTableQuery.searchProvider,
                    searchSessionGuid: searchSessionGuid,
                    searchQueryId: searchQueryId,
                });
                return;
            }

            // The result array contains the response.body in [0] place
            // When the request fails the body will be undefined and we should check for
            // successful response from the response code in searchInstrumentation.
            // We also need to check that the search results are not null in case
            // of an access denied error where the responseCode is still 200
            const responseCode = searchInstrumentation.ClientHttpStatus;
            const isSuccessfulResponse =
                responseCode == SUCCESS_STATUS_CODE && result[0]?.SearchResults != null;
            const isFirstPage = currentPageContext.pageNumber == 0;

            if (
                searchTableQuery.searchProvider === SearchProvider.Substrate ||
                searchTableQuery.searchProvider === SearchProvider.SubstrateV2
            ) {
                timingPromise.then(timing => {
                    /**
                     * We use setTimeout with wait of 0 here to delay this task until
                     * the rest of this function completes. Without this delay, the
                     * ClientJSEndToEndTime checkmark may not have been added to the
                     * executeSearchDatapoint yet, resulting in an incorrect value
                     * being set.
                     *
                     */
                    setTimeout(() => {
                        lazyAddResourceTimingEntry.import().then(addResourceTimingEntry => {
                            addResourceTimingEntry(
                                timing,
                                searchInstrumentation,
                                executeSearchDatapoint
                            );

                            if (isFirstPage) {
                                const e2eLatency =
                                    searchInstrumentation.ClientJSEndToEndTime /* EndToEnd time captures everything except rendering time */ +
                                    searchInstrumentation.ClientJSRenderingTime;

                                isSuccessfulResponse &&
                                    lazyLogResultsRendered.importAndExecute(
                                        SubstrateSearchScenario.Mail,
                                        searchInstrumentation.SearchQueryId /*logical Id*/,
                                        searchInstrumentation.SearchTraceID,
                                        e2eLatency /* e2e latency*/
                                    );
                            }
                        });
                    }, 0);
                });

                setLatestTraceId(
                    searchInstrumentation.SearchTraceID,
                    SearchScenarioId.Mail,
                    false /* isQFTraceId */
                );
            }

            // Start client perf datapoint only for the first page response
            let clientRenderingDatapoint;
            if (isFirstPage) {
                clientRenderingDatapoint = new PerformanceDatapoint('TnS_SearchClientTime');
                clientRenderingDatapoint.addCustomData([isSuccessfulResponse, itemTypes]);
            }

            if (isSuccessfulResponse) {
                const response = result[0];

                /**
                 * Updates the store with the most recent spelling-corrected suggestion
                 * and altered query (if processing first page since the first
                 * page is the only page that has the speller suggestion data).
                 */
                const querySuggestionData = response.querySuggestionData;
                if (querySuggestionData && isFirstPage) {
                    const flaggedTokens =
                        querySuggestionData.flaggedTokens &&
                        querySuggestionData.flaggedTokens.map(flaggedToken => ({
                            Length: flaggedToken.Length,
                            Offset: flaggedToken.Offset || 0, // Offset is omitted by server if offset is 0
                            Suggestion: flaggedToken.Suggestion,
                        }));

                    lazySetSpellerData.importAndExecute(
                        querySuggestionData.alteredQuery,
                        querySuggestionData.suggestedSearchTerm,
                        querySuggestionData.suggestedSearchTermReferenceId,
                        flaggedTokens,
                        querySuggestionData.recourseQuery,
                        SearchScenarioId.Mail,
                        querySuggestionData.queryAlterationType,
                        searchInstrumentation.SearchTraceID,
                        searchInstrumentation.SearchQueryId,
                        querySuggestionData.displayText
                    );
                }

                onExecuteSearchCompleted(
                    currentPageContext,
                    tableView,
                    response.SearchResults,
                    maxTopResults,
                    itemTypes,
                    searchSessionGuid,
                    actionSource,
                    searchQueryId,
                    searchInstrumentation.SearchTraceID
                );
            }

            if (isFirstPage) {
                if (!onInitialTableLoadComplete) {
                    throw new Error(
                        'onInitialTableLoadComplete callback should always be set when page number is 0'
                    );
                }

                if (executeSearchDatapoint && isSuccessfulResponse) {
                    executeSearchDatapoint.addCustomData({
                        resultCount: result[0].SearchResults.SearchResultsCount,
                    });
                }

                // Only call onInitialTableLoadComplete for first page load
                onInitialTableLoadComplete(
                    tableView,
                    isSuccessfulResponse,
                    responseCode.toString(),
                    false /* isTablePrefetched */
                );

                // Log client perf datapoints on process search results complete
                onProcessSearchResultsComplete(
                    clientRenderingDatapoint,
                    searchInstrumentation,
                    executeSearchDatapoint
                );
            }

            if (!isSuccessfulResponse) {
                if (executeSearchDatapoint) {
                    executeSearchDatapoint.endWithError(
                        DatapointStatus.ServerError,
                        Error(result[1].SearchErrorContent)
                    );
                }

                if (
                    (searchTableQuery.searchProvider === SearchProvider.Substrate ||
                        searchTableQuery.searchProvider === SearchProvider.SubstrateV2) &&
                    isFeatureEnabled('sea-autoFallback') &&
                    isFirstPage
                ) {
                    startSearch(
                        'SearchErrorFallback',
                        SearchScenarioId.Mail,
                        true /* explicitSearch */,
                        [],
                        SearchProvider.ExecuteSearch
                    );
                    logUsage('SearchFallback', {
                        TraceId: searchInstrumentation.SearchTraceID,
                        ResponseCode: responseCode,
                        BETarget: searchInstrumentation.SearchBETarget,
                    });
                }
            }
        });
    }
);

function executeSearchInternal(
    tableView: TableView,
    onInitialTableLoadComplete: OnInitialTableLoadComplete,
    executeSearchDatapoint: PerformanceDatapoint,
    searchSessionGuid: string,
    searchQueryId: string,
    maxTopResults: number,
    actionSource: string
): Promise<void> {
    undoActions.clearLastUndoableAction();

    const itemTypes = getItemTypesFromTable(tableView);
    if (!itemTypes) {
        // Handle the unknown list view type in error case
        return Promise.resolve();
    }

    return performExecuteSearch(
        getPageContext(0 /* pageNumber */),
        tableView,
        onInitialTableLoadComplete,
        executeSearchDatapoint,
        itemTypes,
        searchSessionGuid,
        searchQueryId,
        actionSource,
        maxTopResults
    );
}

/**
 * Execute search action
 * @param tableView the search table view
 * @param onInitialTableLoadComplete is a callback that is called when we receive the execute search first page response
 * @param executeSearchDatapoint - the E2E execute search datapoint
 * @param maxTopResults maximum number of results to return
 * The callback is handled by table loading
 */
export default async function executeSearch(
    tableView: TableView,
    onInitialTableLoadComplete: OnInitialTableLoadComplete,
    executeSearchDatapoint: PerformanceDatapoint,
    actionSource: string,
    maxTopResults: number = 0
): Promise<void> {
    const searchStore = getScenarioStore(SearchScenarioId.Mail);

    // End search "conversation" when new query is issued.
    endSearchConversation(SearchScenarioId.Mail);

    return executeSearchInternal(
        tableView,
        onInitialTableLoadComplete,
        executeSearchDatapoint,
        searchStore.searchSessionGuid,
        searchStore.currentSearchQueryId,
        maxTopResults,
        actionSource
    );
}

export async function executeSearchOneOff(
    tableView: TableView,
    onInitialTableLoadComplete: OnInitialTableLoadComplete,
    executeSearchDatapoint: PerformanceDatapoint,
    actionSource: string,
    maxTopResults: number = 0
): Promise<void> {
    const mailSearchStore = getMailSearchStore();

    const searchTableQuery = tableView.tableQuery as SearchTableQuery;

    mailSearchStore.searchNumber++;
    searchTableQuery.searchNumber = mailSearchStore.searchNumber;
    mailSearchStore.staticSearchScope = searchTableQuery.searchScope;

    return executeSearchInternal(
        tableView,
        onInitialTableLoadComplete,
        executeSearchDatapoint,
        getGuid(),
        getGuid(),
        maxTopResults,
        actionSource
    );
}
