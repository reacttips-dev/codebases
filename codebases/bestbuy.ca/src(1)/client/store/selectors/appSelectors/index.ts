import {createSelector, Selector} from "reselect";
import {AppState} from "../../../reducers/appReducer";
import {IBrowser as ScreenSize} from "redux-responsive";
import {State} from "store";
import {get} from "lodash-es";
import { AppLocation, RegionCode } from "models";

export const getApp: Selector<State, AppState> = (state: State) => state.app;

export const getScreenSize = createSelector<State, AppState, ScreenSize>([getApp], (app) => get(app, "screenSize"));

// MCF/Kiosk
export const isKiosk = createSelector(getApp, (app) =>
    ["integrationKiosk", "productionKiosk", "mreleasekiosk"].includes(app.environment.appEnv),
);

export const getLocation = createSelector<State, AppState, AppLocation>([getApp], (app) => get(app, "location"));

export const getRegionCode = createSelector<State, AppLocation, RegionCode | undefined>([getLocation], (location) => get(location, "regionCode")); 