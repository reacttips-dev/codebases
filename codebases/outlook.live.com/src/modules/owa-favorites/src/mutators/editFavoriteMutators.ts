import { mutator } from 'satcheljs';
import { editExistingFavoriteInStore } from '../actions/v2/editFavoriteActions';
import favoritesStore from '../store/store';

mutator(editExistingFavoriteInStore, actionMessage => {
    const { updatedFavoriteData } = actionMessage;
    const { outlookFavorites } = favoritesStore;

    if (!outlookFavorites.has(updatedFavoriteData.favoriteId)) {
        throw new Error('Could not find a favorite with the provided ID to edit');
    }

    const updatedFavorite = {
        ...outlookFavorites.get(updatedFavoriteData.favoriteId),
        ...updatedFavoriteData,
    };
    outlookFavorites.set(updatedFavoriteData.favoriteId, updatedFavorite);
});
