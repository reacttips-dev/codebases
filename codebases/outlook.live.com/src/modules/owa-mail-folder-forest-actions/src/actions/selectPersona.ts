import datapoints from './datapoints';
import onAfterSelectingNode from './helpers/onAfterSelectingNode';
import selectDefaultFolder from './selectDefaultFolder';
import selectNodeInFolderForest from './selectNodeInFolderForest';
import {
    returnTopExecutingActionDatapoint,
    logUsage,
    wrapFunctionForDatapoint,
} from 'owa-analytics';
import {
    getStore as getSharedFavoritesStore,
    convertFavoritePersonaDataToFavoritePersonaNode,
} from 'owa-favorites';
import type { FavoritePersonaNode, FavoritePersonaData } from 'owa-favorites-types';
import folderStore from 'owa-folders';
import { isFavoritingInProgress, lazyOnFavoritePersonaSelected } from 'owa-mail-favorites-store';
import { getSelectedNode } from 'owa-mail-folder-forest-store';
import { addFrequentlyUsedFolder } from 'owa-mail-frequently-used-folders';
import { wasFolderPrefetched } from 'owa-mail-frequently-used-folders/lib/utils/wasFolderPrefetched';
import { isFeatureEnabled } from 'owa-feature-flags';
import { safePerformanceMarkStart } from 'owa-search-diagnostics/lib/helpers/performanceTiming';
import { isFolderPaused, listViewStore } from 'owa-mail-list-store';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import { getISOString } from 'owa-datetime';
import { mutatorAction } from 'satcheljs';

/**
 * Select a persona node
 * @param personaId the folderId
 * @return a promise that resolves when the load persona table from server has completed
 */
export default wrapFunctionForDatapoint(
    datapoints.selectPersona,
    function selectPersona(favoriteId: string): Promise<void> {
        let selectNodePromise: Promise<void>;

        safePerformanceMarkStart('🏃‍ SelectPersonaToPersonaHeaderRender');

        // Only perform the rest of selecting folder logic when
        // user navigates to a folder with the different folderId
        if (favoriteId !== getSelectedNode().id) {
            const roamingApiEnabled = isFeatureEnabled('tri-favorites-roaming');
            let personaNode: FavoritePersonaNode;

            if (roamingApiEnabled) {
                const data = getSharedFavoritesStore().outlookFavorites.get(
                    favoriteId
                ) as FavoritePersonaData;
                personaNode = data
                    ? convertFavoritePersonaDataToFavoritePersonaNode(data)
                    : undefined;
            } else {
                personaNode = getSharedFavoritesStore().favoritesPersonaNodes.get(favoriteId);
            }

            if (!personaNode) {
                selectDefaultFolder('ResetInbox');
                return Promise.resolve();
            }

            const isAddingInProgress =
                isFavoritingInProgress(personaNode.personaId) ||
                isFavoritingInProgress(personaNode.mainEmailAddress);
            let searchFolderNotFound = false;

            // If the search folder for this persona was not found and adding is not in progress, fallback to search
            // A new search folder will be generate further along this codepath
            if (!isAddingInProgress && !folderStore.folderTable.has(personaNode.searchFolderId)) {
                searchFolderNotFound = true;
                clearPersonaNode(personaNode);
            }

            const willUseSearchFallback = !personaNode.isSearchFolderPopulated;
            const isPrefetchedFuf =
                personaNode.searchFolderId && wasFolderPrefetched(personaNode.searchFolderId);

            const selectPersonaDatapoint = returnTopExecutingActionDatapoint();

            // Datapoint is not present for unit tests
            if (selectPersonaDatapoint) {
                selectPersonaDatapoint.addCustomData({
                    isSearchFallback: willUseSearchFallback,
                    searchFolderNotFound: searchFolderNotFound,
                    isPrefetchedFuf: !!isPrefetchedFuf,
                });
            }

            selectNodePromise = selectNodeInFolderForest(personaNode, 'FavoritesPersonaNode');

            if (!roamingApiEnabled) {
                lazyOnFavoritePersonaSelected.importAndExecute(personaNode.id);
            }

            if (personaNode.searchFolderId) {
                addFrequentlyUsedFolder(personaNode.searchFolderId);

                // If in paused state, reset the count of the pausedTotal count to the real total count
                if (isFolderPaused(folderNameToId('inbox'))) {
                    const totalCount = folderStore.folderTable.get(personaNode.searchFolderId)
                        .TotalCount;

                    logUsage(
                        'TnS_PauseSelectPersona',
                        [
                            totalCount -
                                folderStore.folderTable.get(personaNode.searchFolderId)
                                    .pausedTotalCount,
                            getISOString(listViewStore.inboxPausedDateTime),
                            listViewStore.inboxPausedLength ? listViewStore.inboxPausedLength : -1,
                        ],
                        {
                            isCore: true,
                        }
                    );
                    setPausedTotalCount(personaNode, totalCount);
                }
            }
        }

        // Called after selecting same/different persona
        // #15945 - We should try to merge SelectFolder, SelectPersona, SelectGroup logic and move this method into a common place
        onAfterSelectingNode();

        return selectNodePromise;
    }
);

const clearPersonaNode = mutatorAction(
    'updateclearPersonaNodePersonaNode',
    (personaNode: FavoritePersonaNode) => {
        personaNode.searchFolderId = undefined;
        personaNode.isSearchFolderPopulated = false;
    }
);

const setPausedTotalCount = mutatorAction(
    'setPausedTotalCount',
    (personaNode: FavoritePersonaNode, totalCount: number) => {
        folderStore.folderTable.get(personaNode.searchFolderId).pausedTotalCount = totalCount;
    }
);
