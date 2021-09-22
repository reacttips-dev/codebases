import { default as favoritesStore } from '../store/store';
import { isFeatureEnabled } from 'owa-feature-flags';
import type { FavoritePersonaData, FavoritePrivateDistributionListData } from 'owa-favorites-types';

export function isFolderPersonaFavoriteSearchFolder(folderId: string): boolean {
    if (isFeatureEnabled('tri-favorites-roaming')) {
        // Lookup the new favorites store
        return [...favoritesStore.outlookFavorites.values()]
            .filter(favorite => favorite.type === 'persona')
            .some(
                favorite =>
                    (favorite as FavoritePersonaData).searchFolderId &&
                    (favorite as FavoritePersonaData).searchFolderId === folderId
            );
    } else {
        // Lookup the old favorites store
        return [...favoritesStore.favoritesPersonaNodes.values()].some(
            node => node.searchFolderId && node.searchFolderId === folderId
        );
    }
}

export function isFolderPrivateDLFavoriteSearchFolder(folderId: string): boolean {
    if (isFeatureEnabled('tri-favorites-roaming')) {
        // Lookup the new favorites store
        return [...favoritesStore.outlookFavorites.values()]
            .filter(favorite => favorite.type === 'privatedistributionlist')
            .some(
                favorite =>
                    (favorite as FavoritePrivateDistributionListData).searchFolderId &&
                    (favorite as FavoritePrivateDistributionListData).searchFolderId === folderId
            );
    } else {
        return false;
    }
}
