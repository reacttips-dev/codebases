import favoritesStore from '../store/store';
import { mutator } from 'satcheljs';
import setFavoritesLoaded from '../actions/setFavoritesLoaded';

export default mutator(setFavoritesLoaded, actionMessage => {
    favoritesStore.favoritesLoaded = true;
});
