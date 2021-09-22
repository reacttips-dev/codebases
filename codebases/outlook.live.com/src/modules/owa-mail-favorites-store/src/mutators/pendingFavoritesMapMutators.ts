import { mutatorAction } from 'satcheljs';
import { getStore } from '../store/store';

export const add = mutatorAction(
    'addToPendingFavoritesMap',
    function addToPendingFavoritesMap(key: string) {
        getStore().isFavoritingInProgress.set(key, true);
    }
);

export const remove = mutatorAction(
    'removeFromPendingFavoritesMap',
    function removeFromPendingFavoritesMap(key: string) {
        getStore().isFavoritingInProgress.delete(key);
    }
);
