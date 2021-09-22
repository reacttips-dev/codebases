import { createAction } from "typesafe-actions";

export const setTotalCategoriesAction = createAction("@@si/keyword-leads/SET_TOTAL_CATEGORIES")<
    unknown[]
>();
export const setPaidCategoriesAction = createAction("@@si/keyword-leads/SET_PAID_CATEGORIES")<
    unknown[]
>();
export const setOrganicCategoriesAction = createAction("@@si/keyword-leads/SET_ORGANIC_CATEGORIES")<
    unknown[]
>();
export const setMobileCategoriesAction = createAction("@@si/keyword-leads/SET_MOBILE_CATEGORIES")<
    unknown[]
>();
