import {AppMode} from "models";
/**
 * isMobileApp.
 *
 * Note: this function requires AppMode from the app state
 *
 */

export const isMobileApp = (appMode: AppMode) => {
    return appMode === AppMode.iphone || appMode === AppMode.android;
};
