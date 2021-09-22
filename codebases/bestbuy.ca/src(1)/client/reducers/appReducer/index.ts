import {combineReducers} from "redux";
import {createResponsiveStateReducer} from "redux-responsive";
import {appActionTypes, globalContentActionTypes} from "../../actions";
import {Environment, GlobalContentState, AppLocation} from "../../models";
import {deepObjectModifier} from "@bbyca/apex-components";
import {IBrowser as ScreenSize} from "redux-responsive";
import {State} from "store";
import {breakpoints} from "constants/Breakpoints";

export const initialGlobalContentState: GlobalContentState = {
    content: null,
    isFinished: false,
};

export const globalContent = (state = initialGlobalContentState, action) => {
    switch (action.type) {
        case globalContentActionTypes.getGlobalContentSuccess:
            return {
                content: action.globalContent,
                isFinished: true,
            };
        case globalContentActionTypes.getGlobalContentFailed:
            return {
                ...state,
                isFinished: true,
            };
        default:
            return state;
    }
};

export const initialAdBlockerIsActiveState = false;

export const adBlockerIsActive = (state = initialAdBlockerIsActiveState, action) => {
    switch (action.type) {
        case appActionTypes.setAdBlockerIsActive:
            return action.adBlockerIsActive;
        default:
            return state;
    }
};

export const appEnvironmentInitialState: Environment = null;

export const environment = (state = appEnvironmentInitialState, action) => {
    switch (action.type) {
        case appActionTypes.setAppVariables:
            return {
                appEnv: action.appEnv,
                muiUserAgent: action.muiUserAgent,
                nodeEnv: action.nodeEnv,
                standalone: action.standalone,
                userAgent: action.userAgent,
                versionNumber: action.versionNumber,
                appMode: action.appMode,
            };

        default:
            return state;
    }
};

export const initialLocationState: AppLocation = {
    regionCode: "ON",
    country: undefined,
};

export const location = (state = initialLocationState, action) => {
    switch (action.type) {
        case appActionTypes.setRegionCode:
            if (action.regionCode) {
                return {
                    ...state,
                    regionCode: action.regionCode,
                };
            }
        case appActionTypes.setCountry:
            if (action.country) {
                return {
                    ...state,
                    country: action.country,
                };
            }
        default:
            return state;
    }
};

export interface AppState {
    location: AppLocation;
    environment: Environment;
    globalContent: GlobalContentState;
    adBlockerIsActive: boolean;
    screenSize: ScreenSize;
}

export const rootReducer = (state: State, action: any): State => {
    switch (action.type) {
        case appActionTypes.updateStore:
            const {path = "", data, updateType} = action;
            const update = updateType === "replace_store" ? "replace" : "extend";
            return deepObjectModifier(state, path.split("."), data, update);

        case appActionTypes.batchUpdateStore:
                const {queue} = action;
                if (!queue.length) {
                    return state;
                }
                const item = queue.pop();
                const tempState: State = rootReducer(state, {
                    type: appActionTypes.updateStore,
                    ...item,
                });

                return rootReducer(tempState, {
                    ...action,
                    queue,
                });

        default:
            return state;
    }
};

export const createAppReducer = (initialMediaType: string) =>
    combineReducers({
        environment,
        globalContent,
        location,
        adBlockerIsActive,
        screenSize: createResponsiveStateReducer(
            {
                extraLarge: Infinity,
                extraSmall: breakpoints.extraSmall.maxWidth,
                small: breakpoints.small.maxWidth,
                medium: breakpoints.medium.maxWidth,
                large: breakpoints.large.maxWidth,
            },
            {initialMediaType},
        ),
    });

export enum DeviceTypes {
    bot = "extraSmall",
    car = "small",
    desktop = "medium",
    phone = "extraSmall",
    tablet = "small",
    tv = "large",
}
