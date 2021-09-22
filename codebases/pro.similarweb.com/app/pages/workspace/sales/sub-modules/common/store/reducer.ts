import { ActionType, createReducer } from "typesafe-actions";
import * as ac from "./action-creators";
import { ICountryObject } from "services/CountryService";

export type CommonState = {
    isRightBarOpen: boolean;
    countryRightBar: ICountryObject | null;
};

export const INITIAL_COMMON_STATE: CommonState = {
    isRightBarOpen: false,
    countryRightBar: null,
};

const commonReducer = createReducer<CommonState, ActionType<typeof ac>>(INITIAL_COMMON_STATE)
    .handleAction(ac.toggleRightBar, (state, { payload }) => ({
        ...state,
        isRightBarOpen: payload,
    }))
    .handleAction(ac.setCountryRightBar, (state, { payload }) => ({
        ...state,
        countryRightBar: payload,
    }));

export default commonReducer;
