import favoritesStore from '../../store/store';
import type { FavoriteData } from 'owa-favorites-types';
import getSecondaryKey from '../../utils/getSecondaryKey';

export default function isOutlookFavoritingInProgress(data: string | FavoriteData): boolean {
    if (!data) {
        return false;
    }

    const { favoritingInProgressMap } = favoritesStore;
    if (typeof data === 'string') {
        return favoritingInProgressMap.has(data);
    }

    return favoritingInProgressMap.has(getSecondaryKey(data));
}
