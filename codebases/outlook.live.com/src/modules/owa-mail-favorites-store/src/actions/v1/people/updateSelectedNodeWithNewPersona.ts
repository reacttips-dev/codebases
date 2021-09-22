import { getStore as getSharedFavoritesStore } from 'owa-favorites';
import type { FavoritePersonaNode, FolderForestNode } from 'owa-favorites-types';
import { getStore as getFolderForestStore } from 'owa-mail-folder-forest-store';
import { action } from 'satcheljs/lib/legacy';

export default action('updateSelectedNodeWithNewPersona')(function updateSelectedNodeWithNewPersona(
    id: string
): void {
    const sharedFavoritesStore = getSharedFavoritesStore();
    const persona = sharedFavoritesStore.favoritesPersonaNodes.get(id) as FavoritePersonaNode;
    const folderForestStore = getFolderForestStore();

    folderForestStore.selectedNode = {
        ...folderForestStore.selectedNode,
        displayName: persona.displayName,
        mainEmailAddress: persona.mainEmailAddress,
    } as FolderForestNode;
});
