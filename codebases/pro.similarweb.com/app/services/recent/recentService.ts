import { CacheService, setupUserDataWorker } from "services/cache/CacheService";
import { IRecents, IStateObject, StateObjectType } from "userdata";
import { Injector } from "common/ioc/Injector";
import { DefaultFetchService } from "services/fetchService";
import { isUserDataCacheBypass } from "services/cache/Bypass";

const RECENT_USER_DATA_KEY = "recents";
const RECENT_ENDPOINT = "/api/userdata/recent";
const ADD_RECENT_ENDPOINT = RECENT_ENDPOINT + "/add";
const RECENTS_CACHE_STORE_KEY = RECENT_USER_DATA_KEY;
const DEFAULT_QUERY_PARAMS = { display: true };

let recents;

const consolidateRecent = (recent: IRecents) => Injector.get("stateService").applyDefaults(recent);

const fetchRecents = () => {
    const fetchService = DefaultFetchService.getInstance();
    const recentsPromise = fetchService.get<IRecents>(RECENT_ENDPOINT, DEFAULT_QUERY_PARAMS, {
        preventAutoCancellation: true,
    });
    return recentsPromise;
};

const setRecents = (recentsArgs: IRecents) => {
    recents = recentsArgs;
};

const updateRecent = (newRecentObj: IRecents) => {
    recents = consolidateRecent(newRecentObj);
    updateRecentCache(newRecentObj);
};

const getRecents = (): IRecents => recents;

const addRecent = async (serializedState) => {
    const fetchService = DefaultFetchService.getInstance();
    const url = `${ADD_RECENT_ENDPOINT}?${fetchService.requestParams(DEFAULT_QUERY_PARAMS)}`;
    const newRecentObj = await post(url, serializedState);
    updateRecent(newRecentObj as IRecents);
};

const post = async (url: string, payload: IStateObject) =>
    DefaultFetchService.getInstance().post(url, payload);

const createRecentsCacheItem = ({ value, storeKey }) => {
    const item = {
        key: storeKey,
        value: value,
    };
    return item;
};

const updateRecentCache = async (newRecentObj) => {
    CacheService.updateCache(
        RECENT_USER_DATA_KEY,
        newRecentObj,
        RECENTS_CACHE_STORE_KEY,
        createRecentsCacheItem,
    );
};

const getRecentsCache = async (): Promise<IRecents> => {
    const setupWorker = (data) => {
        setupUserDataWorker(data);
        return data.value;
    };
    const recentsCache = CacheService.getCache(
        isUserDataCacheBypass,
        RecentService.fetchRecents,
        RECENTS_CACHE_STORE_KEY,
        setupWorker,
    );
    return recentsCache;
};

const uniqueFilter = (isCompare) => {
    const sitesKeys = new Set();
    return ({ data }) => {
        const { mainItem, comparedItems } = data;
        const sitesAsStringKey = mainItem + (isCompare && comparedItems.join());
        if (sitesKeys.has(sitesAsStringKey)) {
            return false;
        }
        sitesKeys.add(sitesAsStringKey);
        return true;
    };
};

const getRecentsByType = (type: StateObjectType) => (amount = 10, isCompare = false): IRecents => {
    const recentsByType = recents
        .filter(({ data }) => data.type === type)
        .filter(uniqueFilter(isCompare));
    return recentsByType.slice(0, amount);
};

const getRecentsWebsites = getRecentsByType("website");

const addCurrentPageToRecent = () => {
    const state = Injector.get("stateService").serializeState();
    const chosenSites = Injector.get("chosenSites");
    if (state && !state.hideFromRecents) {
        if (state.type === "website") {
            state.category = chosenSites.getPrimarySite().category;
        }
        try {
            RecentService.addRecent(state);
        } catch (e) {}
    }
};

export const RecentService = {
    getRecents,
    addRecent,
    fetchRecents,
    setRecents,
    getRecentsCache,
    getRecentsWebsites,
    uniqueFilter,
    addCurrentPageToRecent,
};
