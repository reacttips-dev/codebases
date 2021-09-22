import { getStore } from '../store/store';
import type FavoriteNodeViewState from '../store/schema/FavoriteNodeViewState';
import createDragViewState from 'owa-dnd/lib/utils/createDragViewState';
import createDropViewState from 'owa-dnd/lib/utils/createDropViewState';
import setFavoriteNodeViewStateMutator from '../mutators/setFavoriteNodeViewStateMutator';

export default function getFavoriteNodeViewStateFromId(favoriteId: string): FavoriteNodeViewState {
    if (!getStore().favoriteNodeViewStates.has(favoriteId)) {
        setFavoriteNodeViewStateMutator(favoriteId, {
            drag: createDragViewState(),
            drop: createDropViewState(),
        });
    }

    return getStore().favoriteNodeViewStates.get(favoriteId);
}
