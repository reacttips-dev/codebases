import deleteOutlookFavoriteService from '../../services/v2/deleteOutlookFavoriteService';
import { removeFavoritePrivateDistributionList } from '../../actions/v2/people/removeFavoritePrivateDistributionList';
import {
    removeFavoriteFromStore,
    removeFavoriteCompleted,
    removeFavoriteFailed,
} from '../../actions/v2/removeFavoriteActions';
import { favoritesStore } from '../../index';
import { orchestrator } from 'satcheljs';
import { isGuid } from 'owa-guid';
import { logUsage } from 'owa-analytics';
import isOutlookFavoritingInProgress from '../../selectors/v2/isOutlookFavoritingInProgress';

export default orchestrator(removeFavoritePrivateDistributionList, async actionMessage => {
    let { favoriteId } = actionMessage;
    let favoriteData = null;

    try {
        // Check wheter we are trying to remove a temp id due to double clicks. This should be a no-op.
        if (isGuid(favoriteId)) {
            logUsage('RemoveOutlookFavoritePDL: attempting to remove guid', { guid: favoriteId });
            return;
        }

        // Check if PDL is in favorites, if not no-op
        if (!favoritesStore.outlookFavorites.has(favoriteId)) {
            return;
        }

        favoriteData = favoritesStore.outlookFavorites.get(favoriteId);
        if (isOutlookFavoritingInProgress(favoriteData)) {
            // No-op
            return;
        }

        // Optimistically add favoriteId to being removed
        removeFavoriteFromStore(favoriteData);

        // Use Favorite Roaming API to remove an outlook favorite
        await deleteOutlookFavoriteService(favoriteId);

        removeFavoriteCompleted(favoriteData);
    } catch (e) {
        removeFavoriteFailed(e, favoriteData);
    }
});
