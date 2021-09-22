import { createAsyncAction } from "typesafe-actions";
import { FetchError } from "pages/sales-intelligence/types";

export const downloadTotalExcelAsync = createAsyncAction(
    "@@si/keyword-leads/TOTAL_EXCEL_START",
    "@@si/keyword-leads/TOTAL_EXCEL_SUCCESS",
    "@@si/keyword-leads/TOTAL_EXCEL_FAILURE",
)<void, void, FetchError>();
export const downloadPaidExcelAsync = createAsyncAction(
    "@@si/keyword-leads/PAID_EXCEL_START",
    "@@si/keyword-leads/PAID_EXCEL_SUCCESS",
    "@@si/keyword-leads/PAID_EXCEL_FAILURE",
)<void, void, FetchError>();
export const downloadOrganicExcelAsync = createAsyncAction(
    "@@si/keyword-leads/ORGANIC_EXCEL_START",
    "@@si/keyword-leads/ORGANIC_EXCEL_SUCCESS",
    "@@si/keyword-leads/ORGANIC_EXCEL_FAILURE",
)<void, void, FetchError>();
export const downloadMobileExcelAsync = createAsyncAction(
    "@@si/keyword-leads/MOBILE_EXCEL_START",
    "@@si/keyword-leads/MOBILE_EXCEL_SUCCESS",
    "@@si/keyword-leads/MOBILE_EXCEL_FAILURE",
)<void, void, FetchError>();
