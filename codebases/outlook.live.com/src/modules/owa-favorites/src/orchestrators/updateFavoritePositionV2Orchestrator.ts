import { getStore as getFavoriteStore } from '../store/store';
import { logUsage } from 'owa-analytics';
import { orchestrator } from 'satcheljs';
import * as trace from 'owa-trace';
import type { OutlookFavoriteKind, OutlookFavoriteServiceDataType } from 'owa-favorites-types';
import updateFavoritePositionV2 from '../actions/v2/updateFavoritePositionV2';
import updateFavoritePositionV2Mutator from '../mutators/updateFavoritePositionV2Mutator';
import updateOutlookFavoriteService from '../services/v2/updateOutlookFavoriteService';

/**
 * Move the favorite node before the specified node
 * @param favoriteIdToUpdate the id to be moved
 * @param destinationFavoriteId the id to be inserted before
 * @param favoriteType favorite type of the node
 */
export default orchestrator(updateFavoritePositionV2, actionMessage => {
    const { favoriteIdToUpdate, destinationFavoriteId, favoriteType } = actionMessage;

    const favoriteData = getFavoriteStore().outlookFavorites.get(favoriteIdToUpdate);
    if (!favoriteData) {
        trace.errorThatWillCauseAlert(
            'updateFavoritePositionV2: invalid favorite data. favoriteType: ' + favoriteType
        );
        return;
    }

    const fromIndex = getFavoriteStore().orderedOutlookFavoritesIds.indexOf(favoriteIdToUpdate);
    const toIndex = getFavoriteStore().orderedOutlookFavoritesIds.indexOf(destinationFavoriteId);
    const isMoveDown = toIndex > fromIndex;

    // No-op if dragging a favorite over itself or over the node below it.
    // This is because the drag target is inserted above the drop target,
    // so in each case the favorite is being inserted above or below itself (no-op)
    if (fromIndex === toIndex || (isMoveDown && toIndex === fromIndex + 1)) {
        return;
    }

    if (fromIndex < 0 || toIndex < 0) {
        // Validate the index
        trace.errorThatWillCauseAlert(
            'udpateFavoritePositionV2: invalid index: fromIndex: ' +
                fromIndex +
                ', toIndex: ' +
                toIndex
        );
        return;
    }

    updateFavoritePositionV2Mutator(fromIndex, toIndex, favoriteData);

    // Issue service call to update the outlook favorite's position
    // Need to decrement toIndex because the client inserts before toIndex while the server inserts at the toIndex
    const serviceFavoriteData = getServiceFavoriteTypeForUpdatePosition(
        favoriteData.favoriteId,
        favoriteData.type,
        isMoveDown ? toIndex - 1 : toIndex
    );
    updateOutlookFavoriteService(serviceFavoriteData)
        .then(response => {
            // Bug 28023: Updating one favorite index needs to trigger updating all indexes
        })
        .catch(error => {
            logMoveFavoriteUpDownFailure(error.message);
        });
});

function logMoveFavoriteUpDownFailure(errorMessage?: string) {
    logUsage('UpdateOutlookFavoriteFailure', errorMessage ? { errorMessage } : null);
}

/**
 * Get a new instance of OutlookFavoriteServiceDataType given the favorite data
 * @param favoriteId the favorite id
 * @returns the OutlookFavoriteServiceDataType to be passed in to the service request
 */
function getServiceFavoriteTypeForUpdatePosition(
    favoriteId: string,
    favoriteType: OutlookFavoriteKind,
    toIndex: number
): OutlookFavoriteServiceDataType {
    let favoriteDataType: OutlookFavoriteServiceDataType = {
        Id: favoriteId,
        Index: toIndex,
        Type: favoriteType,
    };

    return favoriteDataType;
}
