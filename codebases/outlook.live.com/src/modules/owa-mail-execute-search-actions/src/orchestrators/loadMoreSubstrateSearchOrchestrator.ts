import { performExecuteSearch } from '../actions/executeSearch';
import { loadMoreSubstrateSearch } from '../actions/publicActions';
import { getPageContextByOffset } from 'owa-search-service';
import { orchestrator } from 'satcheljs';
import { SearchScenarioId, getScenarioStore } from 'owa-search-store';
import getItemTypesFromTable from '../helpers/getItemTypesFromTable';

export default orchestrator(loadMoreSubstrateSearch, async actionMessage => {
    const { offset, tableView, actionSource } = actionMessage;

    const { searchSessionGuid, currentSearchQueryId } = getScenarioStore(SearchScenarioId.Mail);

    const pageContext = getPageContextByOffset(offset);

    /**
     * If there's no page context for the given index, that means there's no
     * next page to make a request for so we stop.
     */
    if (!pageContext) {
        return;
    }

    performExecuteSearch(
        pageContext,
        tableView,
        null /* onInitialTableLoadComplete */,
        null /* executeSearchDatapoint */,
        getItemTypesFromTable(tableView),
        searchSessionGuid,
        currentSearchQueryId,
        actionSource,
        3 /* not even used */
    );
});
