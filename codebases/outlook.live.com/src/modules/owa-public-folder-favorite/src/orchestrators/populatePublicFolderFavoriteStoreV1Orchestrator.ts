import populatePublicFolderFavoriteStoreV1 from '../actions/populatePublicFolderFavoriteStoreV1';
import { FolderForestNode, FolderForestNodeType } from 'owa-favorites-types';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import { parseFavoriteNode, addFavoriteToStoreV1 } from 'owa-favorites';
import publicFolderFavoriteStore from '../store/publicFolderFavoriteStore';
import { createLazyOrchestrator } from 'owa-bundling';

export default createLazyOrchestrator(
    populatePublicFolderFavoriteStoreV1,
    'clone_populatePublicFolderFavoriteStoreV1',
    async actionMessage => {
        const userOptions = getUserConfiguration().UserOptions;
        if (!userOptions.FavoriteNodes) {
            // Nothing to load
            return;
        }

        // Populate favorites based on the UserOptions.FavoriteNodes
        userOptions.FavoriteNodes.forEach(rawNode => {
            const parsedNode = parseFavoriteNode(rawNode);
            if (parsedNode.type == FolderForestNodeType.PublicFolder) {
                tryAddSingleFavoritePublicFolderToStore(parsedNode);
            }
        });
    }
);

function tryAddSingleFavoritePublicFolderToStore(publicFolderNode: FolderForestNode) {
    if (shouldAddFavoritePublicFolder(publicFolderNode)) {
        addFavoriteToStoreV1(publicFolderNode);
    }
}

/**
 * Should add public folder to favorite list
 */
function shouldAddFavoritePublicFolder(publicFolderNode: FolderForestNode): boolean {
    if (publicFolderFavoriteStore.folderTable.size === 0) {
        // Do not add the folder if the folder store hasn't been initiated yet
        return false;
    }

    return publicFolderFavoriteStore.folderTable.has(publicFolderNode.id);
}
