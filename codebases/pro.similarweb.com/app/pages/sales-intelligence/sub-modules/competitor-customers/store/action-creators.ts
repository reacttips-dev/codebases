import { createAction, createAsyncAction } from "typesafe-actions";
import { FetchError } from "pages/sales-intelligence/types";
import { CommonTableFilters, TrafficTableData } from "../types";

export const fetchOutgoingTrafficTableAsync = createAsyncAction(
    "@@si/competitor-customers/FETCH_OUTGOING_TRAFFIC_TABLE_START",
    "@@si/competitor-customers/FETCH_OUTGOING_TRAFFIC_TABLE_SUCCESS",
    "@@si/competitor-customers/FETCH_OUTGOING_TRAFFIC_TABLE_FAILURE",
)<void, TrafficTableData, FetchError>();

export const fetchIncomingTrafficTableAsync = createAsyncAction(
    "@@si/competitor-customers/FETCH_INCOMING_TRAFFIC_TABLE_START",
    "@@si/competitor-customers/FETCH_INCOMING_TRAFFIC_TABLE_SUCCESS",
    "@@si/competitor-customers/FETCH_INCOMING_TRAFFIC_TABLE_FAILURE",
)<void, TrafficTableData, FetchError>();

export const setOutgoingTrafficCategoriesAction = createAction(
    "@@si/competitor-customers/SET_OUTGOING_TRAFFIC_CATEGORIES",
)<any[]>();

export const setIncomingTrafficCategoriesAction = createAction(
    "@@si/competitor-customers/SET_INCOMING_TRAFFIC_CATEGORIES",
)<any[]>();

export const downloadOutgoingTableExcelAsync = createAsyncAction(
    "@@si/competitor-customers/DOWNLOAD_OUTGOING_TABLE_EXCEL_START",
    "@@si/competitor-customers/DOWNLOAD_OUTGOING_TABLE_EXCEL_SUCCESS",
    "@@si/competitor-customers/DOWNLOAD_OUTGOING_TABLE_EXCEL_FAILURE",
)<void, void, FetchError>();

export const downloadIncomingTableExcelAsync = createAsyncAction(
    "@@si/competitor-customers/DOWNLOAD_INCOMING_TABLE_EXCEL_START",
    "@@si/competitor-customers/DOWNLOAD_INCOMING_TABLE_EXCEL_SUCCESS",
    "@@si/competitor-customers/DOWNLOAD_INCOMING_TABLE_EXCEL_FAILURE",
)<void, void, FetchError>();

export const setOutgoingTableFiltersAction = createAction(
    "@@si/competitor-customers/SET_OUTGOING_TABLE_FILTERS",
)<CommonTableFilters>();

export const setIncomingTableFiltersAction = createAction(
    "@@si/competitor-customers/SET_INCOMING_TABLE_FILTERS",
)<CommonTableFilters>();
