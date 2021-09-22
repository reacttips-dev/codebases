import { startAnswersSearchSession } from '../actions/startAnswersSearchSession';
import setSearchProvider from '../mutators/setSearchProvider';
import setStaticSearchScopeData from '../mutators/setStaticSearchScopeData';
import getSearchProvider from '../selectors/getSearchProvider';
import store from '../store/store';
import getSuggestionPillFromSelectedNode from '../utils/getSuggestionPillFromSelectedNode';
import isMailSearchAction from '../utils/isMailSearchAction';
import shouldShowOwaBrandElement from '../utils/shouldShowOwaBrandElement';
import { createLazyOrchestrator } from 'owa-bundling';
import { executeSearchStartSearchSessionService } from 'owa-executesearch-service';
import { PillSuggestion, SearchProvider } from 'owa-search-service';
import { lazySubstrateSearchInitOperation } from 'owa-search-service/lib/lazyFunctions';
import { getScenarioStore, SearchScenarioId } from 'owa-search-store';
import { setSearchActive } from 'owa-suite-header-apis';
import {
    getXClientFlightsHeaderValue,
    getSubstrateSearchScenarioBySearchScenarioId,
} from 'owa-search';
import {
    addSuggestionPill,
    getSuggestions,
    startSearch,
    searchSessionStarted,
} from 'owa-search-actions';

/**
 * This is the mail-specific startSearchSessionOrchestrator. It's responsible
 * for handling mail-specific initialization.
 */
export const searchSessionStartedOrchestrator = createLazyOrchestrator(
    searchSessionStarted,
    'CLONE_SEARCH_SESSION_STARTED',
    async actionMessage => {
        if (!isMailSearchAction(actionMessage.scenarioId)) {
            return;
        }

        const { actionSource, shouldStartSearch } = actionMessage;
        const searchStore = getScenarioStore(SearchScenarioId.Mail);

        // Initialize search scope data (based on currently selected node).
        setStaticSearchScopeData();

        /**
         * Once search scope is set, then we can determine the search provider
         * that will be used during this search session.
         */
        const searchProvider: SearchProvider = getSearchProvider();
        setSearchProvider(searchProvider);

        if (searchStore.isUsing3S) {
            lazySubstrateSearchInitOperation.import().then(substrateSearchInitOperation => {
                substrateSearchInitOperation(
                    searchStore.nextSearchQueryId,
                    getSubstrateSearchScenarioBySearchScenarioId(SearchScenarioId.Mail),
                    getXClientFlightsHeaderValue(SearchScenarioId.Mail),
                    searchProvider === SearchProvider.SubstrateV2 ? 2 : 1 /* 3S API Version */
                );
            });
        }

        // Add suggestion pill from currently selected node (if applicable).
        const suggestionPill: PillSuggestion = getSuggestionPillFromSelectedNode();
        addSuggestionPill(suggestionPill, true /* suggestionSelected */, SearchScenarioId.Mail);

        /**
         * Make the appropriate initialization call based on which search provider
         * is being used during the session.
         */
        if (searchProvider === SearchProvider.ExecuteSearch) {
            executeSearchStartSearchSessionService(
                searchStore.searchSessionGuid,
                store.staticSearchScope
            );
        }

        setSearchActive(true);

        //Workaround for hiding the brand container and showing folder scope component instead
        shouldShowOwaBrandElement(false /* shouldShowBrand*/);

        /**
         * Dispatch startSearch action if needed (i.e. a search was executed
         * somewhere other than the search box and we had to start a search
         * session before actually doing the search).
         *
         * If we don't need to kick off a search, then dispatch action to get
         * zero input suggestions.
         */
        if (shouldStartSearch) {
            startSearch(actionSource, SearchScenarioId.Mail);
        } else {
            getSuggestions(SearchScenarioId.Mail);
        }

        startAnswersSearchSession(SearchScenarioId.Mail);
    }
);
