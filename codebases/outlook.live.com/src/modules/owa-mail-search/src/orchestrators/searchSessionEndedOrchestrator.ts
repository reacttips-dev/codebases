import { updateSearchHistoryUserConfig } from '../legacyActions/searchHistory';
import setIsSearchHistoryDirty from '../mutators/setIsSearchHistoryDirty';
import setPreviousNode from '../mutators/setPreviousNode';
import setStaticSearchScopeData from '../mutators/setStaticSearchScopeData';
import getSearchProvider from '../selectors/getSearchProvider';
import mailSearchStore, { defaultMailSearchStore } from '../store/store';
import isMailSearchAction from '../utils/isMailSearchAction';
import { executeSearchEndSearchSessionService } from 'owa-executesearch-service';
import { lazyLogFloodgateActivity } from 'owa-floodgate-feedback-view';
import { searchSessionEnded } from 'owa-search-actions';
import { SearchProvider } from 'owa-search-service';
import { setSearchActive } from 'owa-suite-header-apis';
import { orchestrator } from 'satcheljs';
import { setFromDate, setIncludeAttachments, setToDate } from '../actions/internalActions';
import { setShouldShowAdvancedSearch } from '../actions/publicActions';
import shouldShowOwaBrandElement from '../utils/shouldShowOwaBrandElement';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';

export default orchestrator(searchSessionEnded, async actionMessage => {
    const { scenarioId, searchSessionGuid, latestTraceId } = actionMessage;

    if (!isMailSearchAction(scenarioId)) {
        return;
    }

    // Fire request required to end a search session (if ExecuteSearch).
    if (getSearchProvider() === SearchProvider.ExecuteSearch) {
        executeSearchEndSearchSessionService(searchSessionGuid);
    }

    // Save search history (if dirty).
    if (mailSearchStore.isSearchHistoryDirty) {
        updateSearchHistoryUserConfig();
    }

    //Workaround for hiding the folder scope component and show the the brand container
    shouldShowOwaBrandElement(true /* shouldShowBrand*/);

    // Reset store to defaults.
    setFromDate(defaultMailSearchStore.fromDate);
    setIncludeAttachments(defaultMailSearchStore.includeAttachments);
    setIsSearchHistoryDirty(defaultMailSearchStore.isSearchHistoryDirty);
    setPreviousNode(defaultMailSearchStore.previousNode);
    setStaticSearchScopeData(true /* shouldClear */);
    setToDate(defaultMailSearchStore.toDate);

    // Hide Advanced Search.
    setShouldShowAdvancedSearch(false /* isVisible */);

    setSearchActive(false);

    if (isHostAppFeatureEnabled('floodgate') && mailSearchStore.searchNumber !== 0) {
        const logFloodgateActivity = await lazyLogFloodgateActivity.import();
        logFloodgateActivity('SearchExecuted', latestTraceId);
    }
});
