import { mutatorAction } from 'satcheljs';
import store from '../store/store';

export default mutatorAction(
    'showFindFavoritesPicker',
    function showFindFavoritesPicker(shouldShow: boolean) {
        store.mailFavoritesViewState.shouldShowFindFavoritesPicker = shouldShow;
    }
);
