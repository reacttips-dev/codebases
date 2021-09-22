import { ActionType, createReducer } from "typesafe-actions";
import { CommonState } from "../types";
import * as actionCreators from "./action-creators";
import { SelectedMode } from "pages/sales-intelligence/common-components/MultiSelector/types";

export const DEFAULT_SELECT_PANEL_ACCOUNT_ITEM = {
    selectedMode: SelectedMode.FROM_LIST,
    selectedItemIndex: 0,
};

export const DEFAULT_SELECT_PANEL_EXCEL_ITEM = {
    selectedMode: SelectedMode.FROM_LIST,
    selectedItemIndex: 0,
};
export const DEFAULT_SELECT_PANEL_REMOVE_ITEM = {
    selectedMode: SelectedMode.MANUALLY,
    selectedItemIndex: 0,
};

export const INITIAL_COMMON_STATE: CommonState = {
    workspaceId: null,
    workspacesFetching: true,
    websitesData: {},
    notFoundListModalOpen: false,
    excelQuota: {
        total: 0,
        remaining: 0,
        used: 0,
    },
    isExcelQuotaLoading: false,
    activeSelectorPanel: null,
    selectorPanelAccountItemConfig: DEFAULT_SELECT_PANEL_ACCOUNT_ITEM,
    selectorPanelExcelItemConfig: DEFAULT_SELECT_PANEL_EXCEL_ITEM,
    selectorPanelRemoveItemConfig: DEFAULT_SELECT_PANEL_REMOVE_ITEM,
};

const commonReducer = createReducer<CommonState, ActionType<typeof actionCreators>>(
    INITIAL_COMMON_STATE,
)
    .handleAction(actionCreators.fetchLegacyWorkspaces.request, (state) => ({
        ...state,
        workspacesFetching: true,
    }))
    .handleAction(actionCreators.fetchLegacyWorkspaces.failure, (state) => ({
        ...state,
        workspacesFetching: false,
    }))
    .handleAction(
        actionCreators.fetchLegacyWorkspaces.success,
        (state): CommonState => ({
            ...state,
            workspacesFetching: false,
        }),
    )
    .handleAction(
        actionCreators.setWorkspaceId,
        (state, { payload }): CommonState => ({
            ...state,
            workspaceId: payload,
        }),
    )
    .handleAction(
        actionCreators.fetchSimilarWebsitesAsync.success,
        (state, { payload }): CommonState => ({
            ...state,
            websitesData: {
                ...state.websitesData,
                [payload.domain]: {
                    ...state.websitesData[payload.domain],
                    similarWebsites: payload.similarWebsites,
                },
            },
        }),
    )
    .handleAction(
        actionCreators.fetchWebsitesInfoAsync.success,
        (state, { payload }): CommonState => ({
            ...state,
            websitesData: {
                ...state.websitesData,
                [payload.domain]: {
                    ...state.websitesData[payload.domain],
                    info: payload.info,
                },
            },
        }),
    )
    .handleAction(
        actionCreators.toggleNotFoundListModalOpen,
        (state, { payload }): CommonState => ({
            ...state,
            notFoundListModalOpen: payload,
        }),
    )
    .handleAction(
        actionCreators.fetchExcelQuota.request,
        (state): CommonState => ({
            ...state,
            isExcelQuotaLoading: true,
        }),
    )
    .handleAction(
        actionCreators.fetchExcelQuota.success,
        (state, { payload }): CommonState => ({
            ...state,
            isExcelQuotaLoading: false,
            excelQuota: {
                total: payload.total,
                remaining: payload.remaining,
                used: payload.used,
            },
        }),
    )
    .handleAction(
        actionCreators.fetchExcelQuota.failure,
        (state): CommonState => ({
            ...state,
            isExcelQuotaLoading: false,
        }),
    )
    .handleAction(
        actionCreators.toggleMultiSelectorPanel,
        (state, { payload }): CommonState => ({
            ...state,
            activeSelectorPanel: payload,
        }),
    )
    .handleAction(
        actionCreators.setMultiSelectorPanelAccountItemConfig,
        (state, { payload }): CommonState => ({
            ...state,
            selectorPanelAccountItemConfig: {
                selectedMode: payload.selectedMode,
                selectedItemIndex: payload.selectedItemIndex,
            },
        }),
    )
    .handleAction(
        actionCreators.setMultiSelectorPanelExcelItemConfig,
        (state, { payload }): CommonState => ({
            ...state,
            selectorPanelExcelItemConfig: {
                selectedMode: payload.selectedMode,
                selectedItemIndex: payload.selectedItemIndex,
            },
        }),
    )
    .handleAction(
        actionCreators.setMultiSelectorPanelRemoveItemConfig,
        (state, { payload }): CommonState => ({
            ...state,
            selectorPanelRemoveItemConfig: {
                selectedMode: payload.selectedMode,
                selectedItemIndex: payload.selectedItemIndex,
            },
        }),
    );

export default commonReducer;
