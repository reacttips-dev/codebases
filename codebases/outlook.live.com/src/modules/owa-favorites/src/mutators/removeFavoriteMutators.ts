import { mutator } from 'satcheljs';
import {
    removeFavoriteFromStore,
    removeFavoriteCompleted,
    removeFavoriteFailed,
} from '../actions/v2/removeFavoriteActions';
import removeFavoriteDataFromStore from './helpers/removeFavoriteDataFromStore';
import addFavoriteDataToStore from './helpers/addFavoriteDataToStore';
import {
    addFavoriteDataInProgress,
    removeFavoriteDataInProgress,
} from './helpers/favoritingInProgressHelpers';

mutator(removeFavoriteFromStore, actionMessage => {
    const { favoriteData } = actionMessage;
    removeFavoriteDataFromStore(favoriteData);
    addFavoriteDataInProgress(favoriteData);
});

mutator(removeFavoriteCompleted, actionMessage => {
    const { favoriteData } = actionMessage;
    removeFavoriteDataInProgress(favoriteData);
});

mutator(removeFavoriteFailed, actionMessage => {
    const { favoriteData, error } = actionMessage;
    // Remove favorite data from in progress map if data was found
    if (favoriteData) {
        removeFavoriteDataInProgress(favoriteData);

        if (!error || error.statusCode !== 404) {
            //Also, re-add the favorite to the list if this was not a 404 error
            addFavoriteDataToStore(favoriteData);
        }
    }
});
