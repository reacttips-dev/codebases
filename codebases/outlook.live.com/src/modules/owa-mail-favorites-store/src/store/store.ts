import type FavoriteNodeViewState from './schema/FavoriteNodeViewState';
import type FavoritesViewState from './schema/FavoritesViewState';
import type MailFavoritesStore from './schema/MailFavoritesStore';
import { ObservableMap } from 'mobx';
import { createStore } from 'satcheljs';

const defaultMailFavoritesViewState: FavoritesViewState = {
    contextMenuState: null,
    shouldShowFindFavoritesPicker: false,
};

const defaultMailFavoritesStore: MailFavoritesStore = {
    mailFavoritesViewState: defaultMailFavoritesViewState,
    favoritePersonasRootFolderId: undefined,
    isFavoritingInProgress: new ObservableMap<string, boolean>({}),
    favoriteNodeViewStates: new ObservableMap<string, FavoriteNodeViewState>({}),
};

export const getStore = createStore<MailFavoritesStore>('mailFavorites', defaultMailFavoritesStore);
export default getStore();
