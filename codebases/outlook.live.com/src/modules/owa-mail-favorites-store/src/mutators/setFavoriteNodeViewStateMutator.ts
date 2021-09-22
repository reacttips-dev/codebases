import type FavoriteNodeViewState from '../store/schema/FavoriteNodeViewState';
import { getStore } from '../store/store';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'setFavoriteNodeViewStateMutator',
    function setFavoriteNodeViewStateMutator(favoriteId: string, viewState: FavoriteNodeViewState) {
        getStore().favoriteNodeViewStates.set(favoriteId, viewState);
    }
);
