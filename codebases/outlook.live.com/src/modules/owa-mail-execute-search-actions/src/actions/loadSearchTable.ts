import executeSearch, { executeSearchOneOff } from './executeSearch';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import { action } from 'satcheljs/lib/legacy';
import { isFolderInFavorites } from 'owa-favorites';
import { FolderForestNodeType } from 'owa-favorites-types';
import type { FolderForestTreeType } from 'owa-graph-schema';
import { folderForestStore, FolderForestStore } from 'owa-mail-folder-forest-store';
import { getMaxTopResultsCount } from '../helpers/getMaxTopResultsCount';
import type {
    OnInitialTableLoadComplete,
    OnLoadInitialRowsSucceeded,
} from 'owa-mail-loading-action-types';
import type { PerformanceDatapoint } from 'owa-analytics';
import type { SearchTableQuery } from 'owa-mail-list-search';
import { TableQueryType, TableView } from 'owa-mail-list-store';
import { findItemSearch } from './internalActions';
import { getStore as getMailSearchStore } from 'owa-mail-search';
import { SearchProvider } from 'owa-search-service';

export interface LoadSearchTableState {
    folderForestStore: FolderForestStore;
}

/**
 * Load the search table
 * @param tableView - the given TableView
 * @param onInitialTableLoadComplete - callback for when the initial table load has completed
 * @param executeSearchDatapoint - the E2E execute search datapoint
 * @return a promise that resolves when the search from server has completed
 */
export default action('loadSearchTable')(function loadSearchTable(
    tableView: TableView,
    onInitialTableLoadComplete: OnInitialTableLoadComplete,
    onLoadInitialRowsSucceeded: OnLoadInitialRowsSucceeded,
    actionSource: string,
    executeSearchDatapoint?: PerformanceDatapoint,
    state: LoadSearchTableState = { folderForestStore: folderForestStore }
): Promise<void> {
    if (tableView.tableQuery.type != TableQueryType.Search) {
        throw new Error('loadSearchTable should only be called for search table types');
    }
    const selectedNode = state.folderForestStore.selectedNode;
    const searchStore = getMailSearchStore();
    // Store previous selected node.
    // If we already have a previous node selected then we do not want to store it again,
    // as this is a consecutive search in the same session.
    if (!searchStore.previousNode) {
        if (selectedNode.type == FolderForestNodeType.Search) {
            // If we're clicking on a favorite search node, just set the previous node to Inbox so that
            // clicking on the back button will take us to Inbox
            const inboxId = folderNameToId('inbox');
            const treeTypeValue: FolderForestTreeType = isFolderInFavorites(inboxId)
                ? 'favorites'
                : 'primaryFolderTree';
            searchStore.previousNode = {
                id: inboxId,
                treeType: treeTypeValue,
                type: FolderForestNodeType.Folder,
            };
        } else {
            // Normal search, store the current selected node
            searchStore.previousNode = { ...selectedNode };
        }
    }
    const searchTableQuery = tableView.tableQuery as SearchTableQuery;
    const scenarioType = searchTableQuery.scenarioType;
    const isFolderSearchScenario =
        scenarioType === 'persona' ||
        scenarioType === 'category' ||
        scenarioType === 'privateDistributionList';
    // Clear selected node id in folder forest, if normal search.
    // If this was a favorite search node, we want to show selection on the node in folder forest,
    // so do not clear the selected node
    if (selectedNode.type != FolderForestNodeType.Search && !isFolderSearchScenario) {
        state.folderForestStore.selectedNode.id = null;
    }
    if (scenarioType === 'messageSuggestion') {
        // message suggestion builds its table manually
        onInitialTableLoadComplete(
            tableView,
            true /* isSuccessfulResponseClass */,
            '' /* responseCode */,
            true /* isTablePrefetched */
        );
        return Promise.resolve();
    } else if (searchTableQuery.searchProvider === SearchProvider.FindItem) {
        findItemSearch(
            0 /* offset*/,
            tableView,
            actionSource,
            onLoadInitialRowsSucceeded,
            onInitialTableLoadComplete
        );
        return Promise.resolve();
    } else if (isFolderSearchScenario) {
        return executeSearchOneOff(
            tableView,
            onInitialTableLoadComplete,
            executeSearchDatapoint,
            actionSource,
            getMaxTopResultsCount()
        );
    } else {
        return executeSearch(
            tableView,
            onInitialTableLoadComplete,
            executeSearchDatapoint,
            actionSource,
            getMaxTopResultsCount()
        );
    }
});
