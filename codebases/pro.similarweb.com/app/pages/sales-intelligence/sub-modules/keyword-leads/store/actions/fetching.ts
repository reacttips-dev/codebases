import { createAsyncAction } from "typesafe-actions";
import { FetchError } from "pages/sales-intelligence/types";

export const fetchTotalTableAsync = createAsyncAction(
    "@@si/keyword-leads/FETCH_TOTAL_TABLE_START",
    "@@si/keyword-leads/FETCH_TOTAL_TABLE_SUCCESS",
    "@@si/keyword-leads/FETCH_TOTAL_TABLE_FAILURE",
)<void, unknown, FetchError>();
export const fetchMobileTableAsync = createAsyncAction(
    "@@si/keyword-leads/FETCH_MOBILE_TABLE_START",
    "@@si/keyword-leads/FETCH_MOBILE_TABLE_SUCCESS",
    "@@si/keyword-leads/FETCH_MOBILE_TABLE_FAILURE",
)<void, unknown, FetchError>();
export const fetchOrganicTableAsync = createAsyncAction(
    "@@si/keyword-leads/FETCH_ORGANIC_TABLE_START",
    "@@si/keyword-leads/FETCH_ORGANIC_TABLE_SUCCESS",
    "@@si/keyword-leads/FETCH_ORGANIC_TABLE_FAILURE",
)<void, unknown, FetchError>();
export const fetchPaidTableAsync = createAsyncAction(
    "@@si/keyword-leads/FETCH_PAID_TABLE_START",
    "@@si/keyword-leads/FETCH_PAID_TABLE_SUCCESS",
    "@@si/keyword-leads/FETCH_PAID_TABLE_FAILURE",
)<void, unknown, FetchError>();
