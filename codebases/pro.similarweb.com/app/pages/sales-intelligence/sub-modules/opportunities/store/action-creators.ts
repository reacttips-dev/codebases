import { createAction, createAsyncAction } from "typesafe-actions";
import {
    ListRecommendationType,
    ListSettingsModal,
    ListTableDataResponseDto,
    ListTableFilters,
    OpportunityListModal,
    OpportunityListSettingsUpdatePayload,
    OpportunityListType,
    WebsiteSearchResult,
} from "../types";
import { FetchError } from "../../../types";
import { ListSettingsModalTab } from "../../../pages/opportunity-list/components/settings-modal/tabs";

export const fetchOpportunityListsAsync = createAsyncAction(
    "@@si/opportunities/FETCH_LISTS_START",
    "@@si/opportunities/FETCH_LISTS_SUCCESS",
    "@@si/opportunities/FETCH_LISTS_FAILURE",
)<void, OpportunityListType[], FetchError>();

export const createOpportunityListAsync = createAsyncAction(
    "@@si/opportunities/CREATE_LIST_START",
    "@@si/opportunities/CREATE_LIST_SUCCESS",
    "@@si/opportunities/CREATE_LIST_FAILURE",
)<void, OpportunityListType, FetchError>();

export const updateOpportunityListAsync = createAsyncAction(
    "@@si/opportunities/UPDATE_LIST_START",
    "@@si/opportunities/UPDATE_LIST_SUCCESS",
    "@@si/opportunities/UPDATE_LIST_FAILURE",
)<void, OpportunityListType, FetchError>();

export const updateOpportunityListSettingsAsync = createAsyncAction(
    "@@si/opportunities/UPDATE_LIST_SETTINGS_START",
    "@@si/opportunities/UPDATE_LIST_SETTINGS_SUCCESS",
    "@@si/opportunities/UPDATE_LIST_SETTINGS_FAILURE",
)<void, OpportunityListSettingsUpdatePayload, FetchError>();

export const updateListOpportunitiesAsync = createAsyncAction(
    "@@si/opportunities/UPDATE_LIST_OPPORTUNITIES_START",
    "@@si/opportunities/UPDATE_LIST_OPPORTUNITIES_SUCCESS",
    "@@si/opportunities/UPDATE_LIST_OPPORTUNITIES_FAILURE",
)<void, Partial<OpportunityListType>, FetchError>();

export const deleteOpportunityListAsync = createAsyncAction(
    "@@si/opportunities/DELETE_LIST_START",
    "@@si/opportunities/DELETE_LIST_SUCCESS",
    "@@si/opportunities/DELETE_LIST_FAILURE",
)<void, OpportunityListType["opportunityListId"], FetchError>();

export const fetchListRecommendationsAsync = createAsyncAction(
    "@@si/opportunities/FETCH_LIST_RECOMMENDATIONS_START",
    "@@si/opportunities/FETCH_LIST_RECOMMENDATIONS_SUCCESS",
    "@@si/opportunities/FETCH_LIST_RECOMMENDATIONS_FAILURE",
)<void, ListRecommendationType[], FetchError>();

export const dismissRecommendationAsync = createAsyncAction(
    "@@si/opportunities/DISMISS_RECOMMENDATION_START",
    "@@si/opportunities/DISMISS_RECOMMENDATION_SUCCESS",
    "@@si/opportunities/DISMISS_RECOMMENDATION_FAILURE",
)<string, string, FetchError>();

export const removeRecommendedDomains = createAction(
    "@@si/opportunities/REMOVE_RECOMMENDED_DOMAINS",
)<string[]>();

export const removeOpportunityList = createAction("@@si/opportunities/REMOVE_LIST")<
    OpportunityListType["opportunityListId"]
>();

export const searchForWebsites = createAsyncAction(
    "@@si/opportunities/SEARCH_FOR_WEBSITES_START",
    "@@si/opportunities/SEARCH_FOR_WEBSITES_SUCCESS",
    "@@si/opportunities/SEARCH_FOR_WEBSITES_FAILURE",
)<void, WebsiteSearchResult[], FetchError>();

export const toggleOpportunityListModal = createAction(
    "@@si/opportunities/TOGGLE_LIST_MODAL",
    (isOpen: boolean, list?: OpportunityListType) => ({ isOpen, list } as OpportunityListModal),
)();

export const toggleOpportunityListSettingsModal = createAction(
    "@@si/opportunities/TOGGLE_LIST_SETTINGS_MODAL",
    (
        isOpen: boolean,
        tab: ListSettingsModalTab = ListSettingsModalTab.INFO,
    ): ListSettingsModal => ({ isOpen, tab }),
)();

export const fetchListTableDataAsync = createAsyncAction(
    "@@si/opportunities/FETCH_TABLE_DATA_START",
    "@@si/opportunities/FETCH_TABLE_DATA_SUCCESS",
    "@@si/opportunities/FETCH_TABLE_DATA_FAILURE",
)<void, ListTableDataResponseDto, FetchError>();

export const setListTableFiltersAction = createAction("@@si/opportunities/SET_LIST_TABLE_FILTERS")<
    Partial<ListTableFilters>
>();

export const setListTableLoadingAction = createAction("@si/opportunities/SET_LIST_TABLE_LOADING")<
    boolean
>();

export const removeOpportunitiesFromList = createAsyncAction(
    "@@si/opportunities/REMOVE_OPPORTUNITIES_START",
    "@@si/opportunities/REMOVE_OPPORTUNITIES_SUCCESS",
    "@@si/opportunities/REMOVE_OPPORTUNITIES_FAILURE",
)<void, string[], FetchError>();

export const downloadListTableExcelAsync = createAsyncAction(
    "@@si/opportunities/DOWNLOAD_LIST_TABLE_EXCEL_START",
    "@@si/opportunities/DOWNLOAD_LIST_TABLE_EXCEL_SUCCESS",
    "@@si/opportunities/DOWNLOAD_LIST_TABLE_EXCEL_FAILURE",
)<void, void, FetchError>();

export const setItemsFeedSeenListTable = createAction(
    "@@si/opportunities/SET_ITEMS_FEED_SEEN_LIST_TABLE",
)<string>();

export const toggleRecommendationsBarAction = createAction(
    "@@si/opportunities/TOGGLE_RECOMMENDATIONS_BAR",
)<boolean>();

export const setSelectedOpportunityListNameAndIdAction = createAction(
    "@@si/opportunities/SET_LIST_NAME_AND_ID",
)<{ opportunityListId: string; opportunityListName: string }>();

export const setShowRightBarAction = createAction("@@si/opportunities/SET_SHOW_RIGHT_BAR")<
    boolean
>();

export const clearOpportunityListTableData = createAction(
    "@@si/opportunities/CLEAR_OPPORTUNITY_LIST_DATA",
)();

export const setIsOpenOpportunityList = createAction("@@si/opportunities/OPPORTUNITY_LIST_IS_OPEN")<
    boolean
>();

export const emailSendIndicatorUpdate = createAction(
    "@@si/opportunities/EMAIL_SEND_INDICATOR_UPDATE",
)<any>();
