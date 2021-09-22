import type { FavoritePersonaNode } from 'owa-favorites-types';
import { favoritesStore } from 'owa-favorites';
import type { ObservableMap } from 'mobx';
import { action } from 'satcheljs/lib/legacy';

export interface MarkFavoritePersonaNodeAsAddedState {
    favoritesPersonaNodes: ObservableMap<string, FavoritePersonaNode>;
}

export default action('markFavoritePersonaNodeAsAdded')(function markFavoritePersonaNodeAsAdded(
    favoriteId: string,
    state: MarkFavoritePersonaNodeAsAddedState = {
        favoritesPersonaNodes: favoritesStore.favoritesPersonaNodes,
    }
) {
    const personaNode = state.favoritesPersonaNodes.get(favoriteId);
    if (personaNode) {
        personaNode.isJustAdded = false;
    }
});
