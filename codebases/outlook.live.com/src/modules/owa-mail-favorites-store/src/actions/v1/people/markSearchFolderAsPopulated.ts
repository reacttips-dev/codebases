import { getStore as getSharedFavoritesStore } from 'owa-favorites';
import { action } from 'satcheljs/lib/legacy';

export const MARK_FOLDER_POPULATED_TIMEOUT = 30000;

export const markSearchFolderAsPopulated = action('markSearchFolderAsPopulated')(
    function markSearchFolderAsPopulated(favoriteNodeId: string) {
        const state = getSharedFavoritesStore();
        const personaNode = state.favoritesPersonaNodes.get(favoriteNodeId);

        // personaNode can be undefined if user removed favorite before the search folder has been populated
        if (personaNode) {
            personaNode.isSearchFolderPopulated = true;
        }
    }
);
