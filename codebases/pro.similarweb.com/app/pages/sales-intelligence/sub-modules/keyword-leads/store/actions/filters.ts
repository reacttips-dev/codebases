import { createAction } from "typesafe-actions";

export const setTotalFiltersAction = createAction("@@si/keyword-leads/SET_TOTAL_FILTERS")<
    unknown
>();
export const setPaidFiltersAction = createAction("@@si/keyword-leads/SET_PAID_FILTERS")<unknown>();
export const setOrganicFiltersAction = createAction("@@si/keyword-leads/SET_ORGANIC_FILTERS")<
    any
>();
export const setMobileFiltersAction = createAction("@@si/keyword-leads/SET_MOBILE_FILTERS")<
    unknown
>();
