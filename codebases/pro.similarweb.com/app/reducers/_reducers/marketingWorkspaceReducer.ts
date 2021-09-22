import { IWebsiteLegend } from "components/Workspace/WorkspaceCompetitors/src/WorkspaceCompetitors";
import {
    MARKETING_WORKSPACE_ARENA_SET_SELECTED_TAB,
    MARKETING_WORKSPACE_CLEAR_ALL_PARAMS,
    MARKETING_WORKSPACE_SET_ALL_PARAMS,
    MARKETING_WORKSPACE_SET_CATEGORY,
    MARKETING_WORKSPACE_SET_COUNTRY,
    MARKETING_WORKSPACE_SET_DURATION,
    MARKETING_WORKSPACE_SET_FILTERS,
    MARKETING_WORKSPACE_SET_IS_WWW,
    MARKETING_WORKSPACE_SET_KEYWORDS_TYPE,
    MARKETING_WORKSPACE_SET_RECOMMENDATION_ENGINE_START,
    MARKETING_WORKSPACE_SET_RECOMMENDATION_ENGINE_FAILED,
    MARKETING_WORKSPACE_SET_RECOMMENDATION_ENGINE_SUCCESS,
    MARKETING_WORKSPACE_SET_SELECTED_WORKSPACE,
    MARKETING_WORKSPACE_SET_SITES,
    MARKETING_WORKSPACE_SET_WEBSOURCE,
    MARKETING_WORKSPACE_UNSET_NEWLY_CREATED,
    MARKETING_WORKSPACE_SET_RECOMMENDATION_ENGINE_CLEAR,
    MARKETING_WORKSPACE_SET_SELECTED_WORKSPACE_KEYWORD_GROUPS,
    MARKETING_WORKSPACE_UPDATE_SELECTED_WORKSPACE_KEYWORD_GROUP,
} from "../../action_types/marketing_workspace_action_types";

export interface IMarketingWorkspaceAssociatedAsset {
    id: string;
    sharedWithAccounts?: string[];
    sharedWithUsers: string[];
    ownerId?: number;
}

export enum EMarketingWorkspacePage {
    ARENA = "arena",
    KEYWORD_GROUP = "keywordGroup",
    WEBSITE_GROUP = "websiteGroup",
}

export interface IMarketingWorkspace {
    selectedArenaTab?: number;
    keys?: IWebsiteLegend[] | string[];
    id?: string;
    title?: string;
    customIndustries?: IMarketingWorkspaceAssociatedAsset[];
    arenas?: IMarketingWorkspaceAssociatedAsset[];
    keywordGroups?: IMarketingWorkspaceAssociatedAsset[];
    sharedKeywordGroups?: IMarketingWorkspaceAssociatedAsset[];
    filters?: {
        country?: number;
        duration?: string;
        websource?: string;
        sites?: string[];
        keywordsType?: string;
        isWWW?: string;
        category?: string;
    };
    isNewlyCreated?: boolean;
}

interface IMarketingWorkspaceState {
    allWorkspaces: IMarketingWorkspace[];
    selectedWorkspace: IMarketingWorkspace;
    selectedArenaTab: number;
    websiteGroupRecommendationEngineOn: string;
    websiteGroupRecommendationSuccess: string;
    websiteGroupRecommendationFailed: boolean;
}

const defaultState = {
    allWorkspaces: [],
    selectedArenaTab: 0,
    selectedWorkspace: {
        id: "",
        title: "",
        customIndustries: [],
        arenas: [],
        keywordGroups: [],
        sharedKeywordGroups: [],
        sha: [],
        filters: null,
        isNewlyCreated: false,
    },
    websiteGroupRecommendationEngineOn: null,
    websiteGroupRecommendationSuccess: null,
    websiteGroupRecommendationFailed: false,
};

const reducer = (
    state: IMarketingWorkspaceState = defaultState,
    action: any,
): IMarketingWorkspaceState => {
    switch (action.type) {
        case MARKETING_WORKSPACE_ARENA_SET_SELECTED_TAB:
            return {
                ...state,
                selectedArenaTab: action.selectedTab,
            };
        case MARKETING_WORKSPACE_SET_COUNTRY:
            return {
                ...state,
                selectedWorkspace: {
                    ...state.selectedWorkspace,
                    filters: {
                        ...state.selectedWorkspace.filters,
                        country: action.country,
                    },
                },
            };
        case MARKETING_WORKSPACE_SET_DURATION:
            return {
                ...state,
                selectedWorkspace: {
                    ...state.selectedWorkspace,
                    filters: {
                        ...state.selectedWorkspace.filters,
                        duration: action.duration,
                    },
                },
            };
        case MARKETING_WORKSPACE_SET_WEBSOURCE:
            return {
                ...state,
                selectedWorkspace: {
                    ...state.selectedWorkspace,
                    filters: {
                        ...state.selectedWorkspace.filters,
                        websource: action.websource,
                    },
                },
            };
        case MARKETING_WORKSPACE_SET_IS_WWW:
            return {
                ...state,
                selectedWorkspace: {
                    ...state.selectedWorkspace,
                    filters: {
                        ...state.selectedWorkspace.filters,
                        isWWW: action.isWWW,
                    },
                },
            };
        case MARKETING_WORKSPACE_SET_CATEGORY:
            return {
                ...state,
                selectedWorkspace: {
                    ...state.selectedWorkspace,
                    filters: {
                        ...state.selectedWorkspace.filters,
                        category: action.category,
                    },
                },
            };
        case MARKETING_WORKSPACE_SET_SITES:
            return {
                ...state,
                selectedWorkspace: {
                    ...state.selectedWorkspace,
                    filters: {
                        ...state.selectedWorkspace.filters,
                        sites: action.sites,
                    },
                },
            };
        case MARKETING_WORKSPACE_SET_KEYWORDS_TYPE:
            return {
                ...state,
                selectedWorkspace: {
                    ...state.selectedWorkspace,
                    filters: {
                        ...state.selectedWorkspace.filters,
                        keywordsType: action.keywordsType,
                    },
                },
            };
        case MARKETING_WORKSPACE_SET_FILTERS: {
            return {
                ...state,
                selectedWorkspace: {
                    ...state.selectedWorkspace,
                    filters: {
                        ...state.selectedWorkspace.filters,
                        ...action.filters,
                    },
                },
            };
        }
        case MARKETING_WORKSPACE_SET_ALL_PARAMS:
            return {
                ...state,
                allWorkspaces: action.allWorkspaces,
                selectedWorkspace: {
                    ...state.selectedWorkspace,
                    ...action.selectedWorkspace,
                    filters: {
                        ...action.selectedWorkspace.filters,
                    },
                },
            };
        case MARKETING_WORKSPACE_SET_SELECTED_WORKSPACE:
            return {
                ...state,
                selectedWorkspace: {
                    ...action.selectedWorkspace,
                    filters: {
                        ...state.selectedWorkspace.filters,
                        ...action.selectedWorkspace.filters,
                    },
                },
            };
        case MARKETING_WORKSPACE_UNSET_NEWLY_CREATED:
            return {
                ...state,
                selectedWorkspace: {
                    ...state.selectedWorkspace,
                    isNewlyCreated: false,
                },
            };
        case MARKETING_WORKSPACE_SET_RECOMMENDATION_ENGINE_START:
            return {
                ...state,
                websiteGroupRecommendationEngineOn: action.arenaId,
                websiteGroupRecommendationSuccess: null,
                websiteGroupRecommendationFailed: null,
            };
        case MARKETING_WORKSPACE_SET_RECOMMENDATION_ENGINE_CLEAR:
            return {
                ...state,
                websiteGroupRecommendationEngineOn: null,
                websiteGroupRecommendationSuccess: null,
                websiteGroupRecommendationFailed: null,
            };
        case MARKETING_WORKSPACE_SET_RECOMMENDATION_ENGINE_SUCCESS: {
            return {
                ...state,
                websiteGroupRecommendationEngineOn: null,
                websiteGroupRecommendationSuccess: action.websiteGroupRecommendationSuccess,
                websiteGroupRecommendationFailed: null,
            };
        }
        case MARKETING_WORKSPACE_SET_RECOMMENDATION_ENGINE_FAILED: {
            return {
                ...state,
                // websiteGroupRecommendationEngineOn: null,
                websiteGroupRecommendationSuccess: null,
                websiteGroupRecommendationFailed: true,
            };
        }
        case MARKETING_WORKSPACE_SET_SELECTED_WORKSPACE_KEYWORD_GROUPS: {
            return {
                ...state,
                selectedWorkspace: {
                    ...state.selectedWorkspace,
                    keywordGroups: action.keywordGroups,
                },
            };
        }
        case MARKETING_WORKSPACE_UPDATE_SELECTED_WORKSPACE_KEYWORD_GROUP: {
            const groupIndex = state.selectedWorkspace.keywordGroups.findIndex(
                (group) => group.id === action.group.id,
            );
            if (groupIndex > -1) {
                const newGroups = [...state.selectedWorkspace.keywordGroups];
                newGroups.splice(groupIndex, 1, {
                    ...state.selectedWorkspace.keywordGroups[groupIndex],
                    sharedWithAccounts: action.group.sharedWithAccounts || [],
                    sharedWithUsers: action.group.sharedWithUsers || [],
                });
                return {
                    ...state,
                    selectedWorkspace: {
                        ...state.selectedWorkspace,
                        keywordGroups: newGroups,
                    },
                };
            }
            return state;
        }
        case MARKETING_WORKSPACE_CLEAR_ALL_PARAMS:
            return {
                ...defaultState,
            };
        default:
            return state;
    }
};

function enableBatching(reducer) {
    return function batchingReducer(state, action) {
        switch (action.type) {
            case "BATCH_ACTIONS":
                return action.actions.reduce(batchingReducer, state);
            default:
                return reducer(state, action);
        }
    };
}

export default enableBatching(reducer);
