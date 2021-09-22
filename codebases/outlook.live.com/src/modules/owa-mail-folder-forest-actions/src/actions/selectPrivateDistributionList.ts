import datapoints from './datapoints';
import onAfterSelectingNode from './helpers/onAfterSelectingNode';
import selectDefaultFolder from './selectDefaultFolder';
import selectNodeInFolderForest from './selectNodeInFolderForest';
import { returnTopExecutingActionDatapoint, wrapFunctionForDatapoint } from 'owa-analytics';
import {
    getStore as getSharedFavoritesStore,
    convertFavoritePdlDataToFavoritePdlNode,
} from 'owa-favorites';
import folderStore from 'owa-folders';
import { isFavoritingInProgress } from 'owa-mail-favorites-store';
import { getSelectedNode } from 'owa-mail-folder-forest-store';
import { addFrequentlyUsedFolder } from 'owa-mail-frequently-used-folders';
import { wasFolderPrefetched } from 'owa-mail-frequently-used-folders/lib/utils/wasFolderPrefetched';

import type { FavoritePrivateDistributionListData } from 'owa-favorites-types';

export default wrapFunctionForDatapoint(
    datapoints.selectPrivateDistributionList,
    function selectPrivateDistributionList(favoriteId: string): Promise<void> {
        let selectNodePromise: Promise<void>;

        // Only perform the rest of selecting folder logic when
        // user navigates to a folder with the different folderId
        if (favoriteId != getSelectedNode().id) {
            const data = getSharedFavoritesStore().outlookFavorites.get(
                favoriteId
            ) as FavoritePrivateDistributionListData;

            if (!data) {
                selectDefaultFolder('ResetInbox');
                return Promise.resolve();
            }

            const pdlNode = convertFavoritePdlDataToFavoritePdlNode(data);

            // Fix InProgress for PDLs: https://msfast.visualstudio.com/FAST/_workitems/edit/253684
            const isAddingInProgress = isFavoritingInProgress(pdlNode.data.favoriteId);
            let searchFolderNotFound = false;

            // If the search folder for this pdl was not found and adding is not in progress, fallback to search
            if (!isAddingInProgress && !folderStore.folderTable.has(pdlNode.data.searchFolderId)) {
                searchFolderNotFound = true;

                pdlNode.data.searchFolderId = undefined;
                pdlNode.data.isSearchFolderPopulated = false;
            }

            const willUseSearchFallback = !pdlNode.data.isSearchFolderPopulated;
            const isPrefetchedFuf =
                pdlNode.data.searchFolderId && wasFolderPrefetched(pdlNode.data.searchFolderId);

            const selectPdlDatapoint = returnTopExecutingActionDatapoint();

            // Datapoint is not present for unit tests
            if (selectPdlDatapoint) {
                selectPdlDatapoint.addCustomData({
                    isSearchFallback: willUseSearchFallback,
                    searchFolderNotFound: searchFolderNotFound,
                    isPrefetchedFuf: !!isPrefetchedFuf,
                });
            }

            selectNodePromise = selectNodeInFolderForest(
                pdlNode,
                'FavoritesPrivateDistributionList'
            );

            if (pdlNode.data.searchFolderId) {
                addFrequentlyUsedFolder(pdlNode.data.searchFolderId);
            }
        }

        // #15945 - We should try to merge SelectFolder, SelectPersona, SelectGroup logic and move this method into a common place
        onAfterSelectingNode();

        return selectNodePromise;
    }
);
