import favoritesStore from '../store/store';
import { addToOrderedFavoriteIdList } from '../actions/v2/loadOutlookFavorites';
import { mutator } from 'satcheljs';

export default mutator(addToOrderedFavoriteIdList, actionMessage => {
    favoritesStore.orderedOutlookFavoritesIds.push(actionMessage.favoriteId);
});
