import { createAction } from "typesafe-actions";
import { ICountryObject } from "services/CountryService";

export const toggleRightBar = createAction("@@sales/common/TOGGLE_RIGHT_BAR")<boolean>();

export const setCountryRightBar = createAction("@@sales/common/SET_COUNTRY_RIGHT_BAR")<
    ICountryObject
>();
