import { IFavoriteObject, IFavorites, IStateObject } from "userdata";
import { Injector } from "common/ioc/Injector";
import { StateService } from "user-data/StateService";
import * as _ from "lodash";
import { DefaultFetchService } from "services/fetchService";
import { CacheService, setupUserDataWorker } from "services/cache/CacheService";
import { isUserDataCacheBypass } from "services/cache/Bypass";

const GET_ENDPOINT = "api/userdata/favorites";
const ADD_ENDPOINT = "api/userdata/favorites/add";
const REMOVE_ENDPOINT = "api/userdata/favorites/remove/";
const FAVORITES_USER_DATA_KEY = "favorites";
const FAVORITES_CACHE_STORE_KEY = FAVORITES_USER_DATA_KEY;
const DEFAULT_QUERY_PARAMS = { display: true };

let favorites: IFavorites;
let rawFavorites;

const updateFavorites = (newFavObj: IFavorites) => {
    const stateService = Injector.get<StateService>("stateService");
    const { freeSlots, items: newFavObjItems } = newFavObj;
    const items = stateService.applyDefaults(newFavObjItems);
    favorites = { ...favorites, freeSlots, items };
};

const findFavorite = (navObj: IStateObject): IFavoriteObject => {
    return _.find(getFavorites().items, (fav) => {
        const favoritesSupportTypes = ["website", "app"];
        if (fav.data.type === navObj.type && favoritesSupportTypes.includes(fav.data.type)) {
            return fav.data.mainItem === navObj.mainItem;
        }
        return false;
    });
};

const consolidateFavorites = () => {
    const stateService = Injector.get<StateService>("stateService");
    favorites = _.cloneDeep(rawFavorites);
    favorites.items = stateService.applyDefaults(favorites.items);
    if (favorites.virtualItems) {
        favorites.virtualItems = stateService.applyDefaults(favorites.virtualItems);
    }
};

const getFavorites = (): IFavorites => {
    !favorites && consolidateFavorites();
    return favorites;
};

const updateLocal = (favoritesPromise) => {
    favoritesPromise.then((newFavorites) => {
        rawFavorites = newFavorites;
        consolidateFavorites();
    });
};

const addFavorite = (state: IStateObject, endpoint: string = ADD_ENDPOINT): Promise<IFavorites> => {
    const fetchService = DefaultFetchService.getInstance();
    const addFavoritePromise = fetchService.post<IFavorites>(endpoint, state);
    updateLocal(addFavoritePromise);
    return addFavoritePromise;
};

const removeFavoriteById = (
    { id }: Partial<IFavoriteObject>,
    endpoint = REMOVE_ENDPOINT,
): Promise<IFavorites> => {
    const fetchService = DefaultFetchService.getInstance();
    const removeFavoritePromise = fetchService.post<IFavorites>(endpoint + id, { id });
    updateLocal(removeFavoritePromise);
    return removeFavoritePromise;
};

const fetchFavorites = (endpoint = GET_ENDPOINT): Promise<IFavoriteObject> => {
    const fetchService = DefaultFetchService.getInstance();
    const favoritesPromise = fetchService.get<IFavoriteObject>(endpoint, DEFAULT_QUERY_PARAMS);
    return favoritesPromise;
};

const getFavoritesCache = async (): Promise<IFavoriteObject> => {
    const setupWorker = (data) => {
        setupUserDataWorker(data);
        return data.value;
    };
    const favoritesCache = CacheService.getCache(
        isUserDataCacheBypass,
        fetchFavorites,
        FAVORITES_CACHE_STORE_KEY,
        setupWorker,
    );
    return favoritesCache;
};

export const removeCurrentPageFromFavorites = (): Promise<IFavorites> => {
    const stateService = Injector.get<StateService>("stateService");
    const fav = findFavorite(stateService.serializeState());
    return removeFavoriteById(fav);
};

const init = (favoritesArg) => {
    rawFavorites = favoritesArg;
};
const addCurrentPageToFavorites = (): Promise<IFavorites> => {
    const stateService = Injector.get<StateService>("stateService");
    const state = stateService.serializeState();
    if (state) return addFavorite(state);
};

const addPageToFavorites = (pageSettings): Promise<IFavorites> => {
    const stateService = Injector.get<StateService>("stateService");
    const state = stateService.serializeState(pageSettings);
    if (state) return addFavorite(state);
};

const isCurrentPageFavorite = (): boolean => {
    const stateService = Injector.get<StateService>("stateService");
    const stateObj = stateService.serializeState();
    return stateObj ? Boolean(findFavorite(stateObj)) : false;
};

export const FavoritesService = {
    init,
    updateFavorites,
    findFavorite,
    getFavorites,
    addFavorite,
    removeFavoriteById,
    getFavoritesCache,
    addPageToFavorites,
    removeCurrentPageFromFavorites,
    addCurrentPageToFavorites,
    isCurrentPageFavorite,
};
