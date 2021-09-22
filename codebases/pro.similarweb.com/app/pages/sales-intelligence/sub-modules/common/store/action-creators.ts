import { createAction, createAsyncAction } from "typesafe-actions";
import { FetchError } from "../../../types";
import { TypeOfSelectors } from "pages/sales-intelligence/common-components/MultiSelector/types";
import { ExcelQuotaResult } from "pages/sales-intelligence/sub-modules/opportunities/types";
import { SelectorPanelItemConfig } from "pages/sales-intelligence/sub-modules/common/types";

export const fetchLegacyWorkspaces = createAsyncAction(
    "@@si/common/FETCH_LEGACY_WORKSPACES_START",
    "@@si/common/FETCH_LEGACY_WORKSPACES_SUCCESS",
    "@@si/common/FETCH_LEGACY_WORKSPACES_FAILURE",
)<void, void, FetchError>();

export const setWorkspaceId = createAction("@@si/common/SET_WORKSPACE_ID")<string>();

export const toggleNotFoundListModalOpen = createAction(
    "@@si/common/TOGGLE_NOT_FOUND_LIST_MODAL_OPEN",
)<boolean>();

export const fetchSimilarWebsitesAsync = createAsyncAction(
    "@@si/common/FETCH_SIMILAR_WEBSITES_START",
    "@@si/common/FETCH_SIMILAR_WEBSITES_SUCCESS",
    "@@si/common/FETCH_SIMILAR_WEBSITES_FAILURE",
)<void, { domain: string; similarWebsites: any[] }, FetchError>();

export const fetchWebsitesInfoAsync = createAsyncAction(
    "@@si/common/FETCH_WEBSITE_INFO_START",
    "@@si/common/FETCH_WEBSITE_INFO_SUCCESS",
    "@@si/common/FETCH_WEBSITE_INFO_FAILURE",
)<void, { domain: string; info: any }, FetchError>();

export const fetchExcelQuota = createAsyncAction(
    "@@si/common/FETCH_EXCEL_QUOTA_START",
    "@@si/common/FETCH_EXCEL_QUOTA_SUCCESS",
    "@@si/common/FETCH_EXCEL_QUOTA_FAILURE",
)<void, ExcelQuotaResult, FetchError>();

export const toggleMultiSelectorPanel = createAction(
    "@@si/common/TOGGLE_MULTI_SELECTOR_PANEL",
)<null | TypeOfSelectors>();

export const setMultiSelectorPanelAccountItemConfig = createAction(
    "@@si/common/SET_MULTI_SELECTOR_PANEL_ACCOUNT_ITEM_CONFIG",
)<SelectorPanelItemConfig>();

export const setMultiSelectorPanelExcelItemConfig = createAction(
    "@@si/common/SET_MULTI_SELECTOR_PANEL_EXCEL_ITEM_CONFIG",
)<SelectorPanelItemConfig>();

export const setMultiSelectorPanelRemoveItemConfig = createAction(
    "@@si/common/SET_MULTI_SELECTOR_PANEL_REMOVE_ITEM_CONFIG",
)<SelectorPanelItemConfig>();
