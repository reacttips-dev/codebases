import type FavoritesStore from './schema/FavoritesStore';
import { ObservableMap } from 'mobx';
import { createStore } from 'satcheljs';

let defaultFavoritesStore: FavoritesStore = {
    favoritesFolderNodes: new ObservableMap(),
    favoritesPersonaNodes: new ObservableMap(),
    favoriteSearches: new ObservableMap(),
    favoriteCategories: new ObservableMap(),
    orderedFavoritesNodeIds: [],
    orderedOutlookFavoritesIds: [],
    outlookFavorites: new ObservableMap(),
    favoriteSecondaryKeyMap: new ObservableMap(),
    favoritingInProgressMap: new ObservableMap(),
    favoritesLoaded: false,
};

export const getStore = createStore<FavoritesStore>('favorites', defaultFavoritesStore);
export default getStore();
