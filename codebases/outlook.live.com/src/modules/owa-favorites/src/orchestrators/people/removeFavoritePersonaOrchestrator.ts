import deleteOutlookFavoriteService from '../../services/v2/deleteOutlookFavoriteService';
import { removeFavoritePersonaV2 } from '../../actions/v2/people/removeFavoritePersonaV2';
import {
    removeFavoriteFromStore,
    removeFavoriteCompleted,
    removeFavoriteFailed,
} from '../../actions/v2/removeFavoriteActions';
import { orchestrator } from 'satcheljs';
import { isGuid } from 'owa-guid';
import { logUsage } from 'owa-analytics';
import isOutlookFavoritingInProgress from '../../selectors/v2/isOutlookFavoritingInProgress';
import favoritesStore from '../../store/store';
import type { FavoritePersonaData } from 'owa-favorites-types';

export default orchestrator(removeFavoritePersonaV2, async actionMessage => {
    const { favoriteId } = actionMessage;
    let favoriteData;

    try {
        // Check wheter we are trying to remove a temp id due to double clicks. This should be a no-op.
        if (isGuid(favoriteId)) {
            logUsage('RemoveOutlookFavoritePersona: attempting to remove guid', {
                guid: favoriteId,
            });
            return;
        }

        // Check if persona is in favorites
        if (!favoritesStore.outlookFavorites.has(favoriteId)) {
            //Do nothing.
            return;
        }

        const favoriteData = favoritesStore.outlookFavorites.get(favoriteId) as FavoritePersonaData;

        if (isOutlookFavoritingInProgress(favoriteData)) {
            // No-op
            return;
        }

        // Optimistically add favoriteId to being removed
        removeFavoriteFromStore(favoriteData);

        // Use Favorite Roaming API to remove an outlook favorite
        await deleteOutlookFavoriteService(favoriteId);

        removeFavoriteCompleted(favoriteData);
    } catch (error) {
        removeFavoriteFailed(error, favoriteData);
    }
});
