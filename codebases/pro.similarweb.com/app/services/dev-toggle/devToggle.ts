declare const SW_ENV: { debug: boolean };
export const devToggleLocalStorageKey = "DEVTOGGLELOCALSTORAGEKEY";
export type DevTooslState = boolean;

export const isDevToolsOpen = () => {
    if (SW_ENV.debug) {
        //only on dev env.
        const state: DevTooslState = getStateForDevTools();
        return state;
    } else {
        return false;
    }
};
export const toggleDevTools = () => {
    setStateForDevTools(!isDevToolsOpen());
};
export const setStateForDevTools = (state: DevTooslState) => {
    localStorage.setItem(devToggleLocalStorageKey, serializeDevToolsState(state));
};
export const getStateForDevTools = (): DevTooslState => {
    return deSerializeDevToolsState(localStorage.getItem(devToggleLocalStorageKey));
};

export const serializeDevToolsState = (state: DevTooslState): string => {
    return JSON.stringify(state);
};
export const deSerializeDevToolsState = (state: string): DevTooslState => {
    return JSON.parse(state);
};
