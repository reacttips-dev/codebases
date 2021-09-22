import {NavigationActionCreators as ApexNavigationActionCreators} from "@bbyca/apex-components";

export type NavigationActionCreators = ApexNavigationActionCreators;

let navigationActions: NavigationActionCreators;

export const setNavigationActions = (action: NavigationActionCreators) => {
    navigationActions = action;
};

export const getNavigationActions = () => {
    if (!navigationActions) {
        throw new Error("navigationActions have not been initialized");
    }

    return navigationActions;
};

export default getNavigationActions;
