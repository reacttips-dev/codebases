import { ActionType, createReducer } from "typesafe-actions";
import * as actionCreators from "./action-creators";
import { OpportunitiesState, OpportunityListType } from "../types";
import {
    updateOpportunityLists,
    removeFromOpportunityLists,
    removeWebsitesFromListOpportunities,
    removeWebsitesFromListTableData,
    setItemsFeedSeenListTableData,
} from "../helpers";
import { ListSettingsModalTab } from "../../../pages/opportunity-list/components/settings-modal/tabs";

// TODO: This state should be split into few separate
export const INITIAL_OPPORTUNITIES_STATE: OpportunitiesState = {
    opportunityLists: [],
    opportunityListsFetching: false,
    opportunityListsFetchError: undefined,
    opportunityListCreating: false,
    opportunityListCreateError: undefined,
    opportunityListUpdating: false,
    opportunityListUpdateError: undefined,
    opportunityListDeleting: false,
    opportunityListDeleteError: undefined,
    opportunityListModal: {
        isOpen: false,
        list: undefined,
        searchResults: [],
        searching: false,
        searchError: undefined,
    },
    opportunityListIsOpen: false,
    opportunityListSettingsModal: {
        isOpen: false,
        tab: ListSettingsModalTab.INFO,
    },
    opportunityListTableDataFetching: false,
    opportunityListTable: {
        TotalCount: 0,
        Data: [],
    },
    opportunityListTableFilters: {
        page: 1,
        search: "",
        orderBy: "visits desc",
        pageSize: 50,
    },
    tableExcelDownloading: false,
    recommendations: [],
    recommendationsFetching: false,
    recommendationsBarOpen: false,
    opportunityListName: "",
    opportunityListId: "",
    showRightBar: true,
};

const opportunitiesReducer = createReducer<OpportunitiesState, ActionType<typeof actionCreators>>(
    INITIAL_OPPORTUNITIES_STATE,
)
    .handleAction(actionCreators.fetchOpportunityListsAsync.success, (state, { payload }) => ({
        ...state,
        opportunityLists: payload,
        opportunityListsFetching: false,
    }))
    .handleAction(
        actionCreators.createOpportunityListAsync.request,
        (state): OpportunitiesState => ({
            ...state,
            opportunityListCreating: true,
            opportunityListCreateError: undefined,
        }),
    )
    .handleAction(
        actionCreators.createOpportunityListAsync.failure,
        (state, { payload }): OpportunitiesState => ({
            ...state,
            opportunityListCreating: false,
            opportunityListCreateError: payload,
        }),
    )
    .handleAction(
        actionCreators.createOpportunityListAsync.success,
        (state, { payload }): OpportunitiesState => ({
            ...state,
            opportunityListCreating: false,
            opportunityLists: [payload, ...state.opportunityLists],
        }),
    )
    .handleAction(
        actionCreators.updateOpportunityListAsync.request,
        (state): OpportunitiesState => ({
            ...state,
            opportunityListUpdating: true,
            opportunityListUpdateError: undefined,
        }),
    )
    .handleAction(
        actionCreators.updateOpportunityListAsync.failure,
        (state, { payload }): OpportunitiesState => ({
            ...state,
            opportunityListUpdating: false,
            opportunityListUpdateError: payload,
        }),
    )
    .handleAction(
        actionCreators.updateOpportunityListAsync.success,
        (state, { payload }): OpportunitiesState => ({
            ...state,
            opportunityListUpdating: false,
            opportunityLists: updateOpportunityLists(state.opportunityLists, payload),
        }),
    )
    .handleAction(
        actionCreators.updateOpportunityListSettingsAsync.request,
        (state): OpportunitiesState => ({
            ...state,
            opportunityListUpdating: true,
            opportunityListUpdateError: undefined,
        }),
    )
    .handleAction(
        actionCreators.updateOpportunityListSettingsAsync.success,
        (state, { payload }): OpportunitiesState => ({
            ...state,
            opportunityListUpdating: false,
            opportunityLists: state.opportunityLists.map((list) => {
                if (payload.id === list.opportunityListId) {
                    return {
                        ...list,
                        settings: payload.settings,
                    } as OpportunityListType;
                }

                return list;
            }),
        }),
    )
    .handleAction(
        actionCreators.updateOpportunityListSettingsAsync.failure,
        (state, { payload }): OpportunitiesState => ({
            ...state,
            opportunityListUpdating: false,
            opportunityListUpdateError: payload,
        }),
    )
    .handleAction(
        actionCreators.updateListOpportunitiesAsync.request,
        (state): OpportunitiesState => ({
            ...state,
            opportunityListUpdating: true,
            opportunityListUpdateError: undefined,
        }),
    )
    .handleAction(
        actionCreators.updateListOpportunitiesAsync.success,
        (state, { payload }): OpportunitiesState => ({
            ...state,
            opportunityListUpdating: false,
            opportunityLists: state.opportunityLists.map((list) => {
                if (list.opportunityListId !== payload.opportunityListId) {
                    return list;
                }

                return {
                    ...list,
                    opportunities: [...list.opportunities, ...payload.opportunities],
                };
            }),
        }),
    )
    .handleAction(
        actionCreators.updateListOpportunitiesAsync.failure,
        (state, { payload }): OpportunitiesState => ({
            ...state,
            opportunityListUpdating: false,
            opportunityListUpdateError: payload,
        }),
    )
    .handleAction(
        actionCreators.deleteOpportunityListAsync.request,
        (state): OpportunitiesState => ({
            ...state,
            opportunityListDeleting: true,
            opportunityListDeleteError: undefined,
        }),
    )
    .handleAction(
        actionCreators.deleteOpportunityListAsync.failure,
        (state, { payload }): OpportunitiesState => ({
            ...state,
            opportunityListDeleting: false,
            opportunityListDeleteError: payload,
        }),
    )
    .handleAction(
        actionCreators.deleteOpportunityListAsync.success,
        (state): OpportunitiesState => ({
            ...state,
            opportunityListDeleting: false,
        }),
    )
    .handleAction(
        actionCreators.removeOpportunityList,
        (state, { payload }): OpportunitiesState => ({
            ...state,
            opportunityLists: removeFromOpportunityLists(state.opportunityLists, payload),
        }),
    )
    .handleAction(
        actionCreators.toggleOpportunityListModal,
        (state, { payload }): OpportunitiesState => ({
            ...state,
            opportunityListModal: payload,
        }),
    )
    .handleAction(
        actionCreators.toggleOpportunityListSettingsModal,
        (state, { payload }): OpportunitiesState => ({
            ...state,
            opportunityListSettingsModal: payload,
        }),
    )
    .handleAction(
        actionCreators.searchForWebsites.request,
        (state): OpportunitiesState => ({
            ...state,
            opportunityListModal: {
                ...state.opportunityListModal,
                searching: true,
            },
        }),
    )
    .handleAction(
        actionCreators.searchForWebsites.failure,
        (state, { payload }): OpportunitiesState => ({
            ...state,
            opportunityListModal: {
                ...state.opportunityListModal,
                searching: false,
                searchError: payload,
            },
        }),
    )
    .handleAction(
        actionCreators.searchForWebsites.success,
        (state, { payload }): OpportunitiesState => ({
            ...state,
            opportunityListModal: {
                ...state.opportunityListModal,
                searching: false,
                searchResults: payload,
            },
        }),
    )
    .handleAction(
        actionCreators.fetchListTableDataAsync.request,
        (state): OpportunitiesState => ({
            ...state,
            opportunityListTableDataFetching: true,
        }),
    )
    .handleAction(
        actionCreators.fetchListTableDataAsync.failure,
        (state): OpportunitiesState => ({
            ...state,
            opportunityListTableDataFetching: false,
        }),
    )
    .handleAction(
        actionCreators.fetchListTableDataAsync.success,
        (state, { payload }): OpportunitiesState => ({
            ...state,
            opportunityListTable: payload,
            opportunityListTableDataFetching: false,
        }),
    )
    .handleAction(
        actionCreators.emailSendIndicatorUpdate,
        (state, { payload }): OpportunitiesState => ({
            ...state,
            opportunityListTable: {
                ...state.opportunityListTable,
                Data: payload,
            },
        }),
    )
    .handleAction(
        actionCreators.setItemsFeedSeenListTable,
        (state, { payload }): OpportunitiesState => ({
            ...state,
            opportunityListTable: setItemsFeedSeenListTableData(
                state.opportunityListTable,
                payload,
            ),
        }),
    )
    .handleAction(
        actionCreators.setListTableFiltersAction,
        (state, { payload }): OpportunitiesState => ({
            ...state,
            opportunityListTableFilters: {
                ...state.opportunityListTableFilters,
                ...payload,
            },
        }),
    )
    .handleAction(actionCreators.setListTableLoadingAction, (state, { payload }) => ({
        ...state,
        opportunityListTableDataFetching: payload,
    }))
    .handleAction(
        actionCreators.removeOpportunitiesFromList.request,
        (state): OpportunitiesState => ({
            ...state,
            opportunityListUpdating: true,
            opportunityListTableDataFetching: true,
        }),
    )
    .handleAction(
        actionCreators.removeOpportunitiesFromList.success,
        (state, { payload }): OpportunitiesState => ({
            ...state,
            opportunityListUpdating: false,
            opportunityLists: state.opportunityLists.map((list) => {
                return removeWebsitesFromListOpportunities(list, payload);
            }),
            opportunityListTable: removeWebsitesFromListTableData(
                state.opportunityListTable,
                payload,
            ),
        }),
    )
    .handleAction(
        actionCreators.removeOpportunitiesFromList.failure,
        (state): OpportunitiesState => ({
            ...state,
            opportunityListUpdating: false,
            opportunityListTableDataFetching: false,
        }),
    )
    .handleAction(
        actionCreators.downloadListTableExcelAsync.request,
        (state): OpportunitiesState => ({
            ...state,
            tableExcelDownloading: true,
            tableExcelDownloadError: INITIAL_OPPORTUNITIES_STATE.tableExcelDownloadError,
        }),
    )
    .handleAction(
        actionCreators.downloadListTableExcelAsync.success,
        (state): OpportunitiesState => ({
            ...state,
            tableExcelDownloading: false,
        }),
    )
    .handleAction(
        actionCreators.downloadListTableExcelAsync.failure,
        (state, { payload }): OpportunitiesState => ({
            ...state,
            tableExcelDownloading: false,
            tableExcelDownloadError: payload,
        }),
    )
    .handleAction(
        actionCreators.fetchListRecommendationsAsync.request,
        (state): OpportunitiesState => ({
            ...state,
            recommendationsFetching: true,
        }),
    )
    .handleAction(
        actionCreators.fetchListRecommendationsAsync.success,
        (state, { payload }): OpportunitiesState => ({
            ...state,
            recommendations: payload,
            recommendationsFetching: false,
        }),
    )
    .handleAction(
        actionCreators.fetchListRecommendationsAsync.failure,
        (state): OpportunitiesState => ({
            ...state,
            recommendationsFetching: false,
        }),
    )
    .handleAction(
        actionCreators.toggleRecommendationsBarAction,
        (state, { payload }): OpportunitiesState => ({
            ...state,
            recommendationsBarOpen: payload,
        }),
    )
    .handleAction(
        actionCreators.setSelectedOpportunityListNameAndIdAction,
        (state, { payload }): OpportunitiesState => ({
            ...state,
            opportunityListName: payload.opportunityListName,
            opportunityListId: payload.opportunityListId,
        }),
    )
    .handleAction(
        actionCreators.setShowRightBarAction,
        (state, { payload }): OpportunitiesState => ({
            ...state,
            showRightBar: payload,
        }),
    )
    .handleAction(
        actionCreators.dismissRecommendationAsync.request,
        (state, { payload }): OpportunitiesState => ({
            ...state,
            recommendations: state.recommendations.filter(
                (recommendation) => recommendation.Domain !== payload,
            ),
        }),
    )
    .handleAction(
        actionCreators.removeRecommendedDomains,
        (state, { payload }): OpportunitiesState => ({
            ...state,
            recommendations: state.recommendations.filter(
                (recommendation) => !payload.includes(recommendation.Domain),
            ),
        }),
    )
    .handleAction(actionCreators.clearOpportunityListTableData, (state) => ({
        ...state,
        opportunityListTable: INITIAL_OPPORTUNITIES_STATE.opportunityListTable,
        opportunityListsFetching: false,
    }))
    .handleAction(actionCreators.setIsOpenOpportunityList, (state, { payload }) => ({
        ...state,
        opportunityListIsOpen: payload,
    }));

export default opportunitiesReducer;
