import type { FavoriteData } from 'owa-favorites-types';
import { getStore as getFavoriteStore } from '../store/store';
import moveDragAndDroppableItem from 'owa-dnd/lib/utils/moveDragAndDroppableItem';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'updateFavoritePositionV2StoreUpdate',
    function updateFavoritePositionV2StoreUpdate(
        fromIndex: number,
        toIndex: number,
        favoriteData: FavoriteData
    ) {
        // Move the element from the old position to the new position in the array
        moveDragAndDroppableItem(getFavoriteStore().orderedOutlookFavoritesIds, fromIndex, toIndex);
    }
);
