import { startAnswerSearch } from '../actions/internalActions';
import { loadTableViewFromSearchTableQuery } from '../actions/publicActions';
import { getDateRange } from '../datapoints';
import { addToLocalSearchHistory } from '../legacyActions/searchHistory';
import setIsAlterationRecourse from '../mutators/setIsAlterationRecourse';
import setSearchNumber from '../mutators/setSearchNumber';
import setSearchProvider from '../mutators/setSearchProvider';
import setFiltersInstrumentationContext from '../mutators/setFiltersInstrumentationContext';
import { clearSearchFiltersForRequery } from '../mutators/searchRefinersMutators';
import getNaturalLanguageGhostText from '../selectors/getNaturalLanguageGhostText';
import getSearchQueryString from '../selectors/getSearchQueryString';
import isAttachmentsRefinerApplied from '../selectors/isAttachmentsRefinerApplied';
import isDateRefinerApplied from '../selectors/isDateRefinerApplied';
import mailSearchStore from '../store/store';
import getFolderNameFromScope from '../utils/getFolderNameFromScope';
import getSearchScopeListViewType from '../utils/getSearchScopeListViewType';
import isNaturalLanguageGhostTextEnabled from '../utils/isNaturalLanguageGhostTextEnabled';
import shouldStartSearch from '../utils/shouldStartSearch';
import * as Fuse from 'fuse.js';
import { PerformanceDatapoint } from 'owa-analytics';
import { getAggregationBucket } from 'owa-analytics-actions';
import { createLazyOrchestrator } from 'owa-bundling';
import { lazyResetFocus } from 'owa-mail-focus-manager';
import { createMailSearchTableQuery } from 'owa-mail-list-search';
import { getListViewTypeString } from 'owa-mail-list-store';
import type { ActionSource } from 'owa-mail-store';
import { lazyGetSuggestionAtIndex } from 'owa-search';
import { startSearch, startSearchSession } from 'owa-search-actions';
import { lazyLogSearchActions, lazyLogSearchEntityActions } from 'owa-search-instrumentation';
import { SearchProvider, SubstrateSearchScenario, SuggestionKind } from 'owa-search-service';
import { getScenarioStore, SearchScenarioId } from 'owa-search-store';
import { getUserConfiguration } from 'owa-session-store';

// Constants required for string matching
const SEARCH_TEXT_STRING_MATCHING_CONFIDENCE = 0.4; // Strings being compared must be greater than 60% in similarity
const MINIMUM_NUMBER_OF_WORDS_IN_SEARCH_TEXT = 2;

export const startSearchOrchestrator = createLazyOrchestrator(
    startSearch,
    'CLONE_START_SEARCH',
    async actionMessage => {
        const actionSource = actionMessage.actionSource as ActionSource;
        const explicitSearch = actionMessage.explicitSearch;
        const searchStore = getScenarioStore(SearchScenarioId.Mail);

        if (!shouldStartSearch(actionMessage.scenarioId, actionSource)) {
            return;
        }

        /**
         * If user has initiated a search without being in a search session (i.e. clicking a
         * category tag), then we should bail and start a search session first.
         */
        if (!searchStore.searchSessionGuid) {
            startSearchSession(actionSource, true /* shouldStartSearch */, SearchScenarioId.Mail);
            return;
        }

        // Since search is sure to happen at this point, create performance datapoint.
        const searchEndToEndDatapoint = new PerformanceDatapoint('SearchEndToEnd');

        // override provider
        if (actionSource === 'SearchErrorFallback') {
            setSearchProvider(SearchProvider.ExecuteSearch);
        }

        /**
         * Log event if search was explicit (i.e. "Enter" in input or clicking the
         * search button, as opposed to clicking a suggestion).
         */
        if (
            explicitSearch &&
            (mailSearchStore.provider === SearchProvider.Substrate ||
                mailSearchStore.provider === SearchProvider.SubstrateV2)
        ) {
            const selectedSuggestionIndex = searchStore.selectedSuggestionIndex;

            /**
             * If selectedSuggestionIndex is non-default, log an entityclicked event
             * because the suggestion led the user to search without them modifying
             * the query.
             *
             * Else, log a searchdone event indicating a search was done as a result
             * of the user entering the query themselves without choosing a suggestion.
             */
            if (selectedSuggestionIndex > -1) {
                const getSuggestionAtIndex = await lazyGetSuggestionAtIndex.import();

                // Get the suggestion from the search store.
                const suggestion = getSuggestionAtIndex(
                    selectedSuggestionIndex,
                    SearchScenarioId.Mail
                );

                // Get trace ID from suggestion set.
                const suggestionSet = getScenarioStore(SearchScenarioId.Mail).currentSuggestions;
                const suggestionSetTraceId = suggestionSet?.TraceId;

                const logicalId = searchStore.traceIdToLogicalIdMap.get(suggestionSetTraceId);

                /**
                 * This check ensures we're only logging an entityclicked event for
                 * a suggestion provided by QF.
                 */
                if (
                    suggestion.kind === SuggestionKind.People
                        ? suggestion.Source === 'qf'
                        : suggestionSetTraceId
                ) {
                    lazyLogSearchEntityActions.importAndExecute(
                        SubstrateSearchScenario.Mail,
                        null,
                        null,
                        logicalId,
                        null /* traceId */,
                        suggestion.ReferenceId,
                        'EntityClicked'
                    );
                }
            } else {
                const emptyGuid = '00000000-0000-0000-0000-000000000000';

                /**
                 * According to 3S spec for "searchdone" event (4/19/2018), the trace ID
                 * should be:
                 * - ID associated with last rendered QF request OR
                 * - ID associated with last QF request issued OR
                 * - An empty GUID
                 */
                const latestQfTraceId =
                    searchStore.latestRenderedQFTraceId ||
                    searchStore.latestQFTraceId ||
                    searchStore.latestQFRequestId ||
                    emptyGuid;

                const logicalId =
                    latestQfTraceId === emptyGuid
                        ? latestQfTraceId
                        : searchStore.traceIdToLogicalIdMap.get(latestQfTraceId);

                lazyLogSearchActions.importAndExecute(
                    SubstrateSearchScenario.Mail,
                    null,
                    null,
                    logicalId,
                    null /* traceId */,
                    'searchdone'
                );
            }
        }

        if (actionSource !== 'InteractiveFilter' && actionSource !== 'SearchScopeRefiner') {
            clearSearchFiltersForRequery();
        }

        setFiltersInstrumentationContext(null);

        const appliedFilter = actionMessage.filter;

        // Build query string from search box contents.
        const queryString = getSearchQueryString(appliedFilter);

        // Increment search number and add query string to local history.
        setSearchNumber(mailSearchStore.searchNumber + 1);

        setIsAlterationRecourse(actionSource === 'QueryAlterationRecourseLink');

        if (searchStore.suggestionPillIds.length <= 0) {
            addToLocalSearchHistory(queryString);
        }

        const listViewType = getSearchScopeListViewType(mailSearchStore.staticSearchScope);
        const searchTableQuery = createMailSearchTableQuery(
            mailSearchStore.searchNumber,
            queryString,
            mailSearchStore.staticSearchScope,
            searchStore.suggestionPills,
            listViewType,
            mailSearchStore.includeAttachments,
            mailSearchStore.fromDate,
            mailSearchStore.toDate,
            mailSearchStore.provider,
            appliedFilter
        );

        // Determine number of refiners applied.
        let appliedRefinersCount = 0;
        isAttachmentsRefinerApplied() ? appliedRefinersCount++ : null;
        isDateRefinerApplied() ? appliedRefinersCount++ : null;

        // get the foldername to add to property bag of datapoint.
        const folderName: string = getFolderNameFromScope(mailSearchStore.staticSearchScope);

        // Add custom data to SearchEndToEnd datapoint.
        searchEndToEndDatapoint.addCustomData({
            actionSource: actionSource,
            searchTextLength: getAggregationBucket({ value: searchStore.searchText.length }),
            suggestionPillsLength: getAggregationBucket({
                value: searchStore.suggestionPillIds.length,
            }),
            folderName: folderName,
            listViewType: getListViewTypeString(listViewType),
            searchScope: mailSearchStore.staticSearchScope.kind,
            appliedRefinersCount: appliedRefinersCount,
            isExplicitLogon: getUserConfiguration().SessionSettings.IsExplicitLogon,
            dateRange: getDateRange(mailSearchStore.fromDate, mailSearchStore.toDate),
            queryIncludesKql: queryIncludesKql(searchStore.searchText),
        });

        if (isNaturalLanguageGhostTextEnabled()) {
            searchEndToEndDatapoint.addCustomData({
                wasSearchTextSimilarToGhostText: getIsSearchTextSimilarToGhostText(
                    searchStore.searchText
                ),
            });
        }

        loadTableViewFromSearchTableQuery(searchTableQuery, searchEndToEndDatapoint, actionSource);

        const currentSearchQueryId = searchStore.currentSearchQueryId;

        Promise.resolve().then(() => {
            startAnswerSearch(
                actionMessage.actionSource,
                actionMessage.scenarioId,
                currentSearchQueryId
            );
        });

        /**
         * Reset focus after search kicks off so focus is given to the list view
         * and user can interact with search results.
         */
        lazyResetFocus.importAndExecute();
    }
);

const queryIncludesKql = (query: string): boolean => {
    return (
        query.indexOf('from:') > -1 ||
        query.indexOf('to:') > -1 ||
        query.indexOf('subject:') > -1 ||
        query.indexOf('received>') > -1 ||
        query.indexOf('received<') > -1 ||
        query.indexOf('received=') > -1
    );
};

/*
@param searchText represents the search text typed into the Search Box
*/
const getIsSearchTextSimilarToGhostText = (searchText: string): boolean => {
    let currentGhostText: string = getNaturalLanguageGhostText
        ? getNaturalLanguageGhostText(true /* isNeededForStringComparison */)
        : null;

    if (!currentGhostText) {
        return null;
    }
    /*
        The next few lines is responsible for cleaning the string. It removes the "Search" phrase and the escape characters
        BEFORE: "Search \"Emails from Aditya\""
        AFTER: "Emails from Aditya"
    */
    const cleanedGhostText: string = currentGhostText.split('"')?.[1];

    /*
        Noticed that single word searches can match with ghost text. i.e: "Attachment" matches to "Attachments from last month"
        Logically, that shouldn't match. However, fuse.js calculations returns a match. The conditional below handles this case.
    */
    if (searchText.split(' ').length < MINIMUM_NUMBER_OF_WORDS_IN_SEARCH_TEXT) {
        return false;
    }

    const fuseConfigOptions = {
        isCaseSensitive: false,
        threshold: SEARCH_TEXT_STRING_MATCHING_CONFIDENCE, // Threshold value of 0.4 denotes a 60% accuracy confidence (1 - 0.4 = 0.6). %Confidence = (1 - Threshold Value) * 100.
        includeMatches: true,
    };

    const fuse = new Fuse([cleanedGhostText], fuseConfigOptions);
    const fuseResults = fuse.search(searchText);

    return fuseResults.length !== 0; // Not equal to 0 denotes that there is a similarity
};
