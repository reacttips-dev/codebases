import { createAsyncAction, createAction } from "typesafe-actions";
import { FetchError } from "pages/sales-intelligence/types";
import { TableIndustryResponse } from "../types";

export const fetchTableAsync = createAsyncAction(
    "@@si/competitor-customers/FETCH_TABLE_START",
    "@@si/competitor-customers/FETCH_TABLE_SUCCESS",
    "@@si/competitor-customers/FETCH_TABLE_FAILURE",
)<void, TableIndustryResponse & { page: number }, FetchError>();

export const fetchingTableDataAction = createAction(
    "@@si/competitor-customers/FETCHING_TABLE_DATA",
)<boolean>();

export const downloadExcelAsync = createAsyncAction(
    "@@si/competitor-customers/DOWNLOAD_INCOMING_TABLE_EXCEL_START",
    "@@si/competitor-customers/DOWNLOAD_INCOMING_TABLE_EXCEL_SUCCESS",
    "@@si/competitor-customers/DOWNLOAD_INCOMING_TABLE_EXCEL_FAILURE",
)<void, void, FetchError>();
