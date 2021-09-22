import * as favoriteNodeParser from '../helpers/favoriteNodeParser';
import updateFavoritesUserOptionService from '../../services/v1/updateFavoritesUserOptionService';
import type { ObservableMap } from 'mobx';
import favoritesStore from '../../store/store';
import type {
    FavoritePersonaNode,
    FolderForestNode,
    FavoriteSearchNode,
    FavoriteCategoryNode,
} from 'owa-favorites-types';
import { updateUserConfiguration } from 'owa-session-store';

export interface UpdateFavoritesUserOptionState {
    favoritesFolderNodes: ObservableMap<string, FolderForestNode>;
    favoritesPersonaNodes: ObservableMap<string, FavoritePersonaNode>;
    favoriteSearches: ObservableMap<string, FavoriteSearchNode>;
    favoriteCategories: ObservableMap<string, FavoriteCategoryNode>;
    orderedFavoritesNodeIds: string[];
}

export default function updateFavoritesUserOption(
    state: UpdateFavoritesUserOptionState = {
        favoritesFolderNodes: favoritesStore.favoritesFolderNodes,
        favoritesPersonaNodes: favoritesStore.favoritesPersonaNodes,
        favoriteSearches: favoritesStore.favoriteSearches,
        favoriteCategories: favoritesStore.favoriteCategories,
        orderedFavoritesNodeIds: favoritesStore.orderedFavoritesNodeIds,
    }
): Promise<void> {
    const favoriteNodesRaw = favoriteNodeParser.serialize(
        state.orderedFavoritesNodeIds,
        state.favoritesFolderNodes,
        state.favoritesPersonaNodes,
        state.favoriteSearches,
        state.favoriteCategories
    );
    // Update the local user configuration store
    updateUserConfiguration(userConfig => {
        userConfig.UserOptions.FavoriteNodes = favoriteNodesRaw;
    });
    // Service request to update user options for FavoriteFolders
    return updateFavoritesUserOptionService(favoriteNodesRaw);
}
