import { mutator } from 'satcheljs';
import {
    addFavoriteCompleted,
    addFavoriteToStore,
    addFavoriteToStoreInitial,
    addMultipleFavoritesCompleted,
    addMultipleFavoritesToStore,
    addFavoriteFailed,
} from '../actions/v2/addFavoriteActions';
import addFavoriteDataToStore from './helpers/addFavoriteDataToStore';
import removeFavoriteDataFromStore from './helpers/removeFavoriteDataFromStore';
import {
    addFavoriteDataInProgress,
    removeFavoriteDataInProgress,
} from './helpers/favoritingInProgressHelpers';

mutator(addFavoriteCompleted, actionMessage => {
    const { temporaryData, favoriteData, newIndex } = actionMessage;

    // Cleanup temporary data
    removeFavoriteDataFromStore(temporaryData);

    // Remove favorite data to in progress map
    removeFavoriteDataInProgress(temporaryData);

    // Add new data
    addFavoriteDataToStore(favoriteData, newIndex);
});

mutator(addFavoriteToStore, actionMessage => {
    const { favoriteData, newIndex } = actionMessage;

    // Adds favorite data to the store.
    addFavoriteDataToStore(favoriteData, newIndex);

    // Add favorite data to in progress map
    addFavoriteDataInProgress(favoriteData);
});

mutator(addFavoriteToStoreInitial, actionMessage => {
    const { favoriteData } = actionMessage;

    // Adds favorite data to the store.
    addFavoriteDataToStore(favoriteData);
});

mutator(addFavoriteFailed, actionMessage => {
    const { favoriteData } = actionMessage;
    // Remove favorite data to in progress map
    removeFavoriteDataInProgress(favoriteData);

    //also remove tempData from the store
    removeFavoriteDataFromStore(favoriteData);
});

mutator(addMultipleFavoritesCompleted, actionMessage => {
    const { temporaryFavorites, favoritesData } = actionMessage;

    // Cleanup
    temporaryFavorites.forEach(tempFavorite => {
        removeFavoriteDataFromStore(tempFavorite);
    });

    favoritesData.forEach(favorite => {
        addFavoriteDataToStore(favorite);
    });
});

mutator(addMultipleFavoritesToStore, actionMessage => {
    const { favoritesData } = actionMessage;

    favoritesData.forEach(favorite => {
        addFavoriteDataToStore(favorite);
    });
});
export type { FavoriteData } from 'owa-favorites-types';
