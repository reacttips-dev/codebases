import datapoint from '../../datapoints';
import favoritesStore from '../../store/store';
import updateFavoritesUserOption from './updateFavoritesUserOption';
import { addDatapointConfig } from 'owa-analytics-actions';
import { action, mutator, orchestrator } from 'satcheljs';

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

/**
 * Move the favorite up/down in the favorites list
 * @param idToUpdate the folderId to be moved
 * @param isMoveUp whether the operation is move up
 */
const moveFavoriteUpDownV1 = action('moveFavoriteUpDownV1', (nodeId: string, isMoveUp: boolean) => {
    validateMoveFavorite(nodeId, favoritesStore.orderedFavoritesNodeIds, isMoveUp);
    return addDatapointConfig(datapoint.UpdateFavoriteNode, { nodeId, isMoveUp });
});

mutator(moveFavoriteUpDownV1, ({ nodeId, isMoveUp }) => {
    const orderedFavoritesNodeIds = favoritesStore.orderedFavoritesNodeIds;
    for (let i = 0; i < orderedFavoritesNodeIds.length; i++) {
        if (nodeId == orderedFavoritesNodeIds[i]) {
            const indexToSwap = isMoveUp ? i - 1 : i + 1;
            swap(i, indexToSwap, orderedFavoritesNodeIds);
            break;
        }
    }
});

orchestrator(moveFavoriteUpDownV1, updateFavoritesUserOption);

export default moveFavoriteUpDownV1;

/**
 * Validate the action
 * @param idToUpdate the id to update
 * @param orderedFavoritesNodeIds the orderedFavoritesNodeIds
 * @param isMoveUp whether this is a moveUp action
 */
function validateMoveFavorite(
    nodeId: string,
    orderedFavoritesNodeIds: string[],
    isMoveUp: boolean
) {
    // Check if it's the first index if it's a "moveUp" action
    if (isMoveUp && orderedFavoritesNodeIds[0] == nodeId) {
        throw new Error(
            'Move up should not be performed on the first element in the favorites list.'
        );
    }

    // Check if it's the last index the id if it's an "moveDown" action
    if (!isMoveUp && orderedFavoritesNodeIds[orderedFavoritesNodeIds.length - 1] == nodeId) {
        throw new Error(
            'Move down should not be performed on the last element in the favorites list.'
        );
    }

    // Check if favorites doesn't contain the id
    if (orderedFavoritesNodeIds.indexOf(nodeId) < 0) {
        throw new Error("Cannot move a node that's not in favorites list.");
    }
}
