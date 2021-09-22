import { orchestrator } from 'satcheljs';
import removeFavoriteGroup from '../actions/v2/removeFavoriteGroup';
import deleteOutlookFavoriteService from '../services/v2/deleteOutlookFavoriteService';
import {
    removeFavoriteFromStore,
    removeFavoriteCompleted,
    removeFavoriteFailed,
} from '../actions/v2/removeFavoriteActions';
import { isGuid } from 'owa-guid';
import getFavoriteIdFromGroupId from '../actions/v2/helpers/getFavoriteIdFromGroupId';
import { logUsage } from 'owa-analytics';
import isOutlookFavoritingInProgress from '../selectors/v2/isOutlookFavoritingInProgress';
import favoritesStore from '../store/store';

export default orchestrator(removeFavoriteGroup, async actionMessage => {
    const groupIdToRemove = actionMessage.groupIdToRemove;
    const favoriteId = getFavoriteIdFromGroupId(groupIdToRemove);

    // Check wheter we are trying to remove a temp id due to double clicks. This should be a no-op.
    if (isGuid(favoriteId)) {
        logUsage('RemoveOutlookFavoriteCategory: attempting to remove guid', { guid: favoriteId });
        return;
    }

    if (isOutlookFavoritingInProgress(groupIdToRemove)) {
        // No-op
        return;
    }

    // Check if outlookFavorites doesn't contain the id
    if (!favoritesStore.outlookFavorites.has(favoriteId)) {
        // No op
        return;
    }

    const favoriteData = favoritesStore.outlookFavorites.get(favoriteId);

    removeFavoriteFromStore(favoriteData);

    // Use Favorite Roaming API to remove an outlook favorite
    deleteOutlookFavoriteService(favoriteId)
        .then(() => {
            removeFavoriteCompleted(favoriteData);
        })
        .catch(error => {
            removeFavoriteFailed(error, favoriteData);
        });
});
