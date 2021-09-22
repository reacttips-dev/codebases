import { AnyAction } from "redux";
import {
    COMMON_WORKSPACES_ADD_OPPORTUNITIES_FAIL,
    COMMON_WORKSPACES_ADD_OPPORTUNITIES_START,
    COMMON_WORKSPACES_ADD_OPPORTUNITIES_SUCCESS,
    COMMON_WORKSPACES_UPDATE_LIST_INFO,
    COMMON_WORKSPACES_UPDATE_LIST_INFO_START,
} from "pages/workspace/common/action_types/actionTypes";
import { WebsiteType } from "../types";
import { OpportunitiesAction } from "./action-types";
import { autocompleteStates } from "components/compare/WebsiteQueryBar";

export type OpportunitiesState = {
    updatingList: boolean;
    selectedWebsite: WebsiteType | null;
    similarWebsites: unknown[];
    similarWebsitesLoading: boolean;
};

export const INITIAL_OPPORTUNITIES_STATE: OpportunitiesState = {
    updatingList: false,
    selectedWebsite: null,
    similarWebsites: [],
    similarWebsitesLoading: false,
};

const opportunitiesReducer = (
    state = INITIAL_OPPORTUNITIES_STATE,
    { type, payload }: OpportunitiesAction & AnyAction, // TODO: action type
): OpportunitiesState => {
    switch (type) {
        case COMMON_WORKSPACES_UPDATE_LIST_INFO_START:
        case COMMON_WORKSPACES_ADD_OPPORTUNITIES_START:
            return {
                ...state,
                updatingList: true,
            };
        case COMMON_WORKSPACES_UPDATE_LIST_INFO:
        case COMMON_WORKSPACES_ADD_OPPORTUNITIES_FAIL:
        case COMMON_WORKSPACES_ADD_OPPORTUNITIES_SUCCESS:
            return {
                ...state,
                updatingList: false,
            };
        case "@@sales/opportunities/SELECT_WEBSITE":
            return {
                ...state,
                selectedWebsite: payload as WebsiteType,
                similarWebsites: INITIAL_OPPORTUNITIES_STATE.similarWebsites,
            };
        case "@@sales/opportunities/FETCH_SIMILAR_WEBSITES_SUCCESS":
            return {
                ...state,
                similarWebsites: payload as unknown[],
                similarWebsitesLoading: false,
            };
        case "@@sales/opportunities/FETCH_SIMILAR_WEBSITES_LOADING.START":
            return {
                ...state,
                similarWebsitesLoading: true,
            };
        case "@@sales/opportunities/FETCH_SIMILAR_WEBSITES_LOADING.FINISH":
            return {
                ...state,
                similarWebsitesLoading: false,
            };
        default:
            return state;
    }
};

export default opportunitiesReducer;
