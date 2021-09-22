import { logUsage } from 'owa-analytics';
import { orchestrator } from 'satcheljs';
import * as trace from 'owa-trace';
import type { OutlookFavoriteServiceDataType, FavoriteData } from 'owa-favorites-types';
import moveFavoriteUpDownV2 from '../actions/v2/moveFavoriteUpDownV2';
import moveFavoriteUpDownV2Mutator from '../mutators/moveFavoriteUpDownV2Mutator';
import updateOutlookFavoriteService from '../services/v2/updateOutlookFavoriteService';
import { getStore as getFavoriteStore } from '../store/store';

/**
 * Move the favorite up/down in the favorites list
 * @param favoriteId the folderId to be moved
 * @param isMoveUp whether the operation is move up
 * @param favoriteType of the favorite node
 * @param state the state which contains all favorite ids and folder
 */
export default orchestrator(moveFavoriteUpDownV2, actionMessage => {
    const { favoriteId, isMoveUp, favoriteType } = actionMessage;

    const favoriteData: FavoriteData = getFavoriteStore().outlookFavorites.get(favoriteId);
    if (!favoriteData) {
        trace.errorThatWillCauseAlert(
            'moveFavoriteUpDownV2: invalid favorite data. favoriteType: ' + favoriteType
        );
        return;
    }

    moveFavoriteUpDownV2Mutator(favoriteData, isMoveUp);

    let favoriteServiceData: OutlookFavoriteServiceDataType = {
        Id: favoriteId,
        Index: getFavoriteStore().orderedOutlookFavoritesIds.indexOf(favoriteId),
        Type: favoriteData.type == 'publicFolder' ? 'folder' : favoriteData.type,
    };

    // Issue service call to update the outlook favorite's position
    updateOutlookFavoriteService(favoriteServiceData)
        .then(() => {
            logUsage('UpdateOutlookFavoriteSuccess');
        })
        .catch(error => {
            logMoveFavoriteUpDownFailure(error.message);
        });
});

function logMoveFavoriteUpDownFailure(errorMessage?: string) {
    logUsage('UpdateOutlookFavoriteFailure', errorMessage ? { errorMessage } : null);
}
