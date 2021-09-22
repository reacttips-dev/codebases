import datapoints from './datapoints';
import { getStore as getSharedFavoritesStore } from 'owa-favorites';
import { FolderForestNodeType } from 'owa-favorites-types';
import { getStore } from 'owa-mail-folder-forest-store';
import onSelectingFolder from './helpers/onSelectingFolder';
import * as undoActions from 'owa-mail-undo';
import { wrapFunctionForDatapoint } from 'owa-analytics';
import { mutatorAction } from 'satcheljs';
import { lazyIsInSearchMode } from 'owa-search';
import {
    lazyClearSearchBox,
    onSearchTextChanged,
    startSearch,
    startSearchSession,
} from 'owa-search-actions';
import { SearchScenarioId } from 'owa-search-store';
import { lazySetStaticSearchScopeData } from 'owa-mail-search';
import { clearListViewVirtualization } from 'owa-mail-list-store';

/**
 * Select a favorite search node
 * @param searchQuery the search query
 */
export default wrapFunctionForDatapoint(
    datapoints.selectFavoriteSearch,
    async function selectFavoriteSearch(searchQuery: string) {
        const folderForestStore = getStore();
        const favoriteSearchNode = getSharedFavoritesStore().favoriteSearches.get(searchQuery);

        // Check not selecting same search node
        if (favoriteSearchNode != folderForestStore.selectedNode) {
            // Set the favorite search node as selected in folder forest
            resetFolderForestSelectedNode(searchQuery);

            const clearSearchBox = await lazyClearSearchBox.import();
            const isInSearchMode = await lazyIsInSearchMode.import();
            const setStaticSearchScopeData = await lazySetStaticSearchScopeData.import();

            // If user isn't in search mode, start a search session.
            if (!isInSearchMode(SearchScenarioId.Mail)) {
                startSearchSession(
                    'FavoritesSearchNode',
                    false /* shouldStartSearch */,
                    SearchScenarioId.Mail
                );
            }

            // Clear pills and text from search box.
            clearSearchBox(SearchScenarioId.Mail);

            // Reset the search scope to the selected node.
            setStaticSearchScopeData(false /* shouldClear */);

            // Update search text and start search.
            onSearchTextChanged(searchQuery, SearchScenarioId.Mail);
            startSearch('FavoritesSearchNode', SearchScenarioId.Mail, false /* explicitSearch */);
        }

        // Trigger mail module RP orchestrator to close immersive RP
        onSelectingFolder();

        // Clear undo stack
        await undoActions.clearLastUndoableAction();
        clearListViewVirtualization(true /* isNewTableLoad */);
    }
);

const resetFolderForestSelectedNode = mutatorAction(
    'resetFolderForestSelectedNode',
    (searchQuery: string) => {
        const folderForestStore = getStore();
        const favoriteSearchNode = getSharedFavoritesStore().favoriteSearches.get(searchQuery);
        folderForestStore.selectedNode = {
            id: favoriteSearchNode.id,
            type: FolderForestNodeType.Search,
            treeType: 'favorites',
        };
    }
);
