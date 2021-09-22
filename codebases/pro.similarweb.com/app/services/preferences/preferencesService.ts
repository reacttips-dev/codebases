import { DefaultFetchService } from "services/fetchService";

const ENDPOINT = "api/userdata/preferences";
const REMOVE_ENDPOINT = ENDPOINT + "/remove-bulk";
const ADD_ENDPOINT = ENDPOINT + "/add";

type IPreferenceValue = any;
type IPreferenceKey = string;
type IPreferences = Record<IPreferenceKey, IPreferenceValue>;
let preferences: IPreferences;

const get = (key?: IPreferenceKey): IPreferenceValue => (key ? preferences[key] : preferences);

const remove = (keys: IPreferenceKey[]): Promise<IPreferences> => {
    const fetchService = DefaultFetchService.getInstance();
    const removePromise = fetchService.post(REMOVE_ENDPOINT, keys);
    updateLocal(removePromise);
    return removePromise;
};

const add = (dictionary: IPreferences): Promise<IPreferences> => {
    const fetchService = DefaultFetchService.getInstance();
    const addPromise = fetchService.post(ADD_ENDPOINT, dictionary);
    updateLocal(addPromise);
    return addPromise;
};

const fetch = (): Promise<IPreferences> => {
    const fetchService = DefaultFetchService.getInstance();
    const getPromise = fetchService.get(ENDPOINT);
    return getPromise;
};

const init = (preferencesArg: IPreferences): void => {
    preferences = preferencesArg;
};

const updateLocal = (preferencesPromise: Promise<IPreferences>) => {
    preferencesPromise.then((newPreferences) => {
        preferences = newPreferences;
    });
};

export const PreferencesService = {
    get,
    add,
    fetch,
    remove,
    init,
};
