import { createAsyncAction } from "typesafe-actions";

export const fetchSiteTrendsAsyncAction = createAsyncAction(
    "@@sales/site-trends/FETCH_SITE_TRENDS_START",
    "@@sales/site-trends/FETCH_SITE_TRENDS_SUCCESS",
    "@@sales/site-trends/FETCH_SITE_TRENDS_FAILURE",
)<void, any, any>();
