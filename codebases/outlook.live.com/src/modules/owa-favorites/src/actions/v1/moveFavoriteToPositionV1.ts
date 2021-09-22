import datapoint from '../../datapoints';
import favoritesStore from '../../store/store';
import moveDragAndDroppableItem from 'owa-dnd/lib/utils/moveDragAndDroppableItem';
import updateFavoritesUserOption from './updateFavoritesUserOption';
import { addDatapointConfig } from 'owa-analytics-actions';
import { action, mutator, orchestrator } from 'satcheljs';

/**
 * Move the favorite node before the specified node
 * @param favoriteIdToUpdate the id to be moved
 * @param destinationFavoriteId the id to be inserted before
 */

const moveFavoriteToPosition = action(
    'moveFavoriteToPosition',
    (favoriteIdToUpdate: string, destinationFavoriteId: string) =>
        addDatapointConfig(datapoint.UpdateFavoriteNode, {
            favoriteIdToUpdate,
            destinationFavoriteId,
        })
);

mutator(moveFavoriteToPosition, ({ favoriteIdToUpdate, destinationFavoriteId }) => {
    const orderedFavoritesNodeIds = favoritesStore.orderedFavoritesNodeIds;
    const fromIndex = orderedFavoritesNodeIds.indexOf(favoriteIdToUpdate);
    const toIndex = orderedFavoritesNodeIds.indexOf(destinationFavoriteId);
    // Move the element from the old position to the new position in the array
    moveDragAndDroppableItem(orderedFavoritesNodeIds, fromIndex, toIndex);
});

orchestrator(moveFavoriteToPosition, updateFavoritesUserOption);

export default moveFavoriteToPosition;
