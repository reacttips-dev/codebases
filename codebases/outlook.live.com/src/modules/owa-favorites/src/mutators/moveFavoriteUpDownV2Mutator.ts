import { mutatorAction } from 'satcheljs';
import { getStore as getFavoriteStore } from '../store/store';
import type { FavoriteData } from 'owa-favorites-types';
import * as trace from 'owa-trace';

export default mutatorAction(
    'moveFavoriteUpDownV2StoreUpdate',
    function moveFavoriteUpDownV2StoreUpdate(favoriteData: FavoriteData, isMoveUp: boolean) {
        const fromIndex = getFavoriteStore().orderedOutlookFavoritesIds.indexOf(
            favoriteData.favoriteId
        );

        // VSO 26085: Optimize updating the favorite position data
        const toIndex = isMoveUp ? fromIndex - 1 : fromIndex + 1;
        if (toIndex < 0 || fromIndex < 0) {
            // Validate the index
            trace.errorThatWillCauseAlert(
                'moveFavoriteUpDownV2: invalid index: toIndex: ' +
                    fromIndex +
                    ', toIndex: ' +
                    toIndex
            );
            return;
        }

        // Local store update to swap the order
        swap(fromIndex, toIndex, getFavoriteStore().orderedOutlookFavoritesIds);
    }
);

/**
 * Swap two elements in the array given the specified indexes
 * @param i the first index
 * @param j the second index
 * @param arr the array
 */
function swap(i: number, j: number, arr: string[]) {
    const tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
}
