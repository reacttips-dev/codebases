import { createAction } from "typesafe-actions";
import { WebsiteType } from "../types";

export const selectWebsiteAction = createAction(
    "@@sales/opportunities/SELECT_WEBSITE",
)<WebsiteType | null>();

export const selectLeadListAction = createAction("@@sales/opportunities/SELECT_LEAD_LIST")<
    string
>();

export const fetchSimilarWebsitesSuccessAction = createAction(
    "@@sales/opportunities/FETCH_SIMILAR_WEBSITES_SUCCESS",
)<unknown[]>();

export const loadingSimilarSitesStart = createAction(
    "@@sales/opportunities/FETCH_SIMILAR_WEBSITES_LOADING.START",
)();

export const loadingSimilarSitesFinish = createAction(
    "@@sales/opportunities/FETCH_SIMILAR_WEBSITES_LOADING.FINISH",
)();
