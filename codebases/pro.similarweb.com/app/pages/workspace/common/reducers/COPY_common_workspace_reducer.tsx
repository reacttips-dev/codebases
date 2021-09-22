// [InvestorsSeparation] Copy of the original file. Will be removed soon.
import dayjs, { Dayjs } from "dayjs";
import { IRecommendationTile } from "pages/workspace/common components/RecommendationsSidebar/RecommendationsSidebar";
import {
    COMMON_WORKSPACE_LIST_SEARCH,
    COMMON_WORKSPACE_LIST_SORT,
    COMMON_WORKSPACES_ADD_OPPORTUNITIES_FAIL,
    COMMON_WORKSPACES_ADD_OPPORTUNITIES_START,
    COMMON_WORKSPACES_ADD_OPPORTUNITIES_SUCCESS,
    COMMON_WORKSPACES_ADD_OPPORTUNITY_LIST,
    COMMON_WORKSPACES_ADD_WORKSPACE,
    COMMON_WORKSPACES_CHANGE_ACTIVE_LIST,
    COMMON_WORKSPACES_DELETE_OPPORTUNITY_LIST,
    COMMON_WORKSPACES_FETCH_ENRICHED_DATA,
    COMMON_WORKSPACES_FETCH_FEED_DATA,
    COMMON_WORKSPACES_FETCH_LIST_DATA_START,
    COMMON_WORKSPACES_FETCH_RANKS_DATA,
    COMMON_WORKSPACES_FETCH_RECOMMENDATIONS,
    COMMON_WORKSPACES_FETCH_WORKSPACES,
    COMMON_WORKSPACES_FETCH_WORKSPACES_FAILED,
    COMMON_WORKSPACES_FETCH_WORKSPACES_SUCCESS,
    COMMON_WORKSPACES_OPTIMISTIC_REMOVE_OPPORTUNITIES,
    COMMON_WORKSPACES_REMOVE_RECOMMENDATIONS,
    COMMON_WORKSPACES_RESET,
    COMMON_WORKSPACES_SELECT_ACTIVE_LIST,
    COMMON_WORKSPACES_SELECT_ACTIVE_WORKSPACE,
    COMMON_WORKSPACES_SELECT_DOMAIN,
    COMMON_WORKSPACES_SELECT_TAB,
    COMMON_WORKSPACES_SET_ACTIVE_LIST_DATA_SUCCESS,
    COMMON_WORKSPACES_SET_DESCRIPTION_DATA,
    COMMON_WORKSPACES_SET_ENRICHED_DATA,
    COMMON_WORKSPACES_SET_FEED_DATA,
    COMMON_WORKSPACES_SET_FEED_ITEM_FEEDBACK,
    COMMON_WORKSPACES_SET_FEED_ITEMS_SEEN,
    COMMON_WORKSPACES_SET_RANKS_DATA,
    COMMON_WORKSPACES_SET_UNSUPPORTED_FEATURES,
    COMMON_WORKSPACES_TOGGLE_RECOMMENDATIONS,
    COMMON_WORKSPACES_CLOSE_RECOMMENDATIONS,
    COMMON_WORKSPACES_TOGGLE_RIGHTBAR,
    COMMON_WORKSPACES_UPDATE_LIST_INFO,
    COMMON_WORKSPACES_UPDATE_LIST_SETTINGS,
    COMMON_WORKSPACES_UPDATE_RECOMMENDATIONS,
    COMMON_WORKSPACES_UPDATE_SNAPSHOT_DATE,
    COMMON_WORKSPACES_MANIPULATION_WEBSITES_MODAL,
    WORKSPACE_SALES_ADD_SAVED_SEARCH_LIST,
    WORKSPACE_SALES_MANIPULATION_EMAIL_DIGEST,
    WORKSPACE_SALES_MANIPULATION_WEBSITES_WIZARD,
    WORKSPACE_SALES_REMOVE_LEADS_GENERATOR_REPORT,
    WORKSPACE_SALES_SELECT_ACTIVE_SAVED_SEARCH_LIST,
    WORKSPACE_SALES_SET_LEADS_GENERATOR_REPORT,
    WORKSPACE_SALES_UNSELECT_ACTIVE_SAVED_SEARCH_LIST,
    WORKSPACE_SALES_UPDATE_SAVED_SEARCH_LIST,
    COMMON_WORKSPACES_MANIPULATION_UNLOCK_MODAL,
} from "../action_types/COPY_actionTypes";
import { ANALYSIS_TAB } from "../consts";
import { selectActiveOpportunityList, selectActiveWorkSpace } from "../selectors";
import {
    ILeadsGeneratorReport,
    IOpportunitiesListTable,
    IWebsiteFeedItem,
    IWorkspace,
} from "../types";

export interface ISelectedSite {
    domain: string;
    companyName: string;
    favicon: string;
    image: string;
    largeImage: string;
    category: string;
    alertsCount: number;
    enrichedData: any;
    feedData: IWebsiteFeedItem[];
    ranksData: any;
    description: string;
}

export type availableTab = "FEED_TAB" | "DASHBOARDS_TAB" | "ANALYSIS_TAB";

export interface ICommonWorkspaceState {
    workspaces: IWorkspace[];
    activeWorkspaceId: string;
    activeListId: string;
    activeListData: IOpportunitiesListTable;
    activeSavedSearchQueryId: string;
    activeSavedSearchFilterData: any;
    isTableLoading: boolean;
    isError: boolean;
    lastSnapshotDate: Dayjs;
    recommendations: IRecommendationTile[];
    isRecommendationsLoading: boolean;
    isEnrichedDataLoading: boolean;
    isFeedDataLoading: boolean;
    isRanksDataLoading: boolean;
    isRightBarOpen: boolean;
    isRecommendationOpen: boolean;
    selectedDomain: ISelectedSite;
    selectedTab: availableTab;
    previouslySelectedTab: availableTab;
    unsupportedFeatures: Set<string>;
    tableSearchTerm: string;
    tableOrderBy: string;
    leadsGeneratorReport: ILeadsGeneratorReport;
    isWebsitesWizardOpen: boolean;
    isWebsitesModalOpen: boolean;
    isUnlockModalOpen: boolean;
}

export const defaultState: ICommonWorkspaceState = {
    workspaces: [],
    activeWorkspaceId: null,
    activeListId: null,
    activeListData: null,
    activeSavedSearchQueryId: null,
    activeSavedSearchFilterData: {},
    isTableLoading: false,
    isError: false,
    lastSnapshotDate: dayjs(),
    recommendations: [],
    isRecommendationsLoading: false,
    isEnrichedDataLoading: false,
    isFeedDataLoading: false,
    isRanksDataLoading: false,
    isRightBarOpen: false,
    isRecommendationOpen: false,
    selectedDomain: null,
    selectedTab: ANALYSIS_TAB,
    previouslySelectedTab: null,
    unsupportedFeatures: new Set(),
    tableSearchTerm: "",
    tableOrderBy: "",
    leadsGeneratorReport: null,
    isWebsitesWizardOpen: false,
    isWebsitesModalOpen: false,
    isUnlockModalOpen: false,
};

const innerCommonWorkspace = (state: ICommonWorkspaceState = defaultState, action) => {
    switch (action.type) {
        case COMMON_WORKSPACES_FETCH_WORKSPACES:
            return {
                ...state,
                isTableLoading: true,
            };
        case COMMON_WORKSPACES_FETCH_WORKSPACES_SUCCESS:
            return {
                ...state,
                workspaces: action.workspaces,
                isTableLoading: false,
                isError: false,
            };
        case COMMON_WORKSPACES_FETCH_WORKSPACES_FAILED:
            return {
                ...state,
                isTableLoading: false,
                isError: true,
            };
        case COMMON_WORKSPACES_SELECT_ACTIVE_WORKSPACE:
            return {
                ...state,
                activeWorkspaceId: action.workspaceId,
            };
        case COMMON_WORKSPACES_SELECT_ACTIVE_LIST:
            return {
                ...state,
                activeListId: action.activeListId,
                selectedDomain: null,
                tableSearchTerm: null,
                tableOrderBy: null,
            };
        case WORKSPACE_SALES_SELECT_ACTIVE_SAVED_SEARCH_LIST:
            return {
                ...state,
                activeSavedSearchQueryId: action.searchId,
                activeSavedSearchFilterData: action.queryParams,
            };
        case WORKSPACE_SALES_UNSELECT_ACTIVE_SAVED_SEARCH_LIST:
            return {
                ...state,
                activeSavedSearchQueryId: null,
                activeSavedSearchFilterData: {},
            };
        case COMMON_WORKSPACES_FETCH_LIST_DATA_START:
            return {
                ...state,
                isTableLoading: true,
                isRightBarOpen: action.holdRightBarOpen,
            };
        case COMMON_WORKSPACES_SET_ACTIVE_LIST_DATA_SUCCESS:
            return {
                ...state,
                activeListData: action.data,
                isTableLoading: false,
            };
        case COMMON_WORKSPACES_UPDATE_SNAPSHOT_DATE:
            return {
                ...state,
                lastSnapshotDate: action.lastSnapshotDate,
            };

        case COMMON_WORKSPACES_OPTIMISTIC_REMOVE_OPPORTUNITIES: {
            const activeWorkspace = selectActiveWorkSpace(state);
            const { opportunities } = selectActiveOpportunityList(state);
            const { activeListData, selectedDomain } = state;
            const { TotalCount: prevTotalCount } = activeListData;
            const newOpportunitiesFiltered = opportunities.filter(({ Domain }) =>
                action.itemsToRemove.every(({ site }) => site !== Domain),
            );
            const newActiveListData = activeListData.Records.filter(({ site: s }) =>
                action.itemsToRemove.every(({ site }) => site !== s),
            );
            const TotalCount =
                prevTotalCount - (opportunities.length - newOpportunitiesFiltered.length);
            let isRightBarOnRemovedItem = false;
            const { domain } = selectedDomain || ({} as ISelectedSite);
            action.itemsToRemove.map((crr) => {
                if (crr.site === domain) {
                    isRightBarOnRemovedItem = true;
                }
            });
            return {
                ...state,
                activeListData: {
                    ...state.activeListData,
                    Records: newActiveListData,
                    TotalCount,
                },
                workspaces: state.workspaces.map((workspace) => {
                    return workspace !== activeWorkspace
                        ? workspace
                        : {
                              ...workspace,
                              opportunityLists: workspace.opportunityLists.map((list) => {
                                  return list.opportunityListId !== state.activeListId
                                      ? list
                                      : {
                                            ...list,
                                            opportunities: newOpportunitiesFiltered,
                                        };
                              }),
                          };
                }),
                isRightBarOpen: state.isRightBarOpen && !isRightBarOnRemovedItem && TotalCount > 0,
                recommendations: TotalCount > 0 ? state.recommendations : [],
            };
        }
        case COMMON_WORKSPACES_ADD_OPPORTUNITY_LIST: {
            return {
                ...state,
                workspaces: state.workspaces.map((workspace) => {
                    return workspace.workspaceId !== action.workspaceId
                        ? workspace
                        : {
                              ...workspace,
                              opportunityLists: [...workspace.opportunityLists, action.newList],
                          };
                }),
            };
        }
        case COMMON_WORKSPACES_ADD_OPPORTUNITIES_START: {
            return {
                ...state,
                isTableLoading: true,
            };
        }
        case COMMON_WORKSPACES_ADD_OPPORTUNITIES_SUCCESS: {
            const { opportunities } = action.updatedList;
            return {
                ...state,
                workspaces: state.workspaces.map((workspace) => {
                    return workspace.workspaceId !== action.workspaceId
                        ? workspace
                        : {
                              ...workspace,
                              opportunityLists: workspace.opportunityLists.map((list) => {
                                  return list.opportunityListId !==
                                      action.updatedList.opportunityListId
                                      ? list
                                      : {
                                            ...list,
                                            opportunities: [
                                                ...list.opportunities,
                                                ...opportunities,
                                            ],
                                        };
                              }),
                          };
                }),
            };
        }
        case COMMON_WORKSPACES_ADD_OPPORTUNITIES_FAIL: {
            return {
                ...state,
                isTableLoading: false,
            };
        }
        case COMMON_WORKSPACES_CHANGE_ACTIVE_LIST:
            return {
                ...state,
                activeListId: action.activeListId,
            };
        case COMMON_WORKSPACES_ADD_WORKSPACE:
            return {
                ...state,
                workspaces: [...state.workspaces, action.workspace],
            };
        case COMMON_WORKSPACES_UPDATE_LIST_INFO: {
            return {
                ...state,
                workspaces: state.workspaces.map((workspace) => {
                    return workspace.workspaceId !== action.workspaceId
                        ? workspace
                        : {
                              ...workspace,
                              opportunityLists: workspace.opportunityLists.map((list) => {
                                  return list.opportunityListId !== action.listId
                                      ? list
                                      : {
                                            ...list,
                                            friendlyName: action.friendlyName,
                                            country: action.country,
                                        };
                              }),
                          };
                }),
            };
        }
        case COMMON_WORKSPACES_DELETE_OPPORTUNITY_LIST: {
            const workspaces = state.workspaces.map((workspace) => {
                return workspace.workspaceId !== action.workspaceId
                    ? workspace
                    : {
                          ...workspace,
                          opportunityLists: workspace.opportunityLists.filter((list) => {
                              return list.opportunityListId !== action.listId;
                          }),
                      };
            });
            const isDeletedListActivated = state.activeListId === action.activeListId;
            return {
                ...state,
                workspaces,
                activeListId: isDeletedListActivated ? null : state.activeListId,
                activeListData: isDeletedListActivated ? null : state.activeListData,
            };
        }
        case COMMON_WORKSPACES_FETCH_RECOMMENDATIONS: {
            return {
                ...state,
                isRecommendationsLoading: true,
            };
        }
        case COMMON_WORKSPACES_UPDATE_RECOMMENDATIONS: {
            return {
                ...state,
                isRecommendationsLoading: false,
                recommendations: action.recommendations,
            };
        }
        case COMMON_WORKSPACES_REMOVE_RECOMMENDATIONS: {
            return {
                ...state,
                recommendations: state.recommendations.map((exist) => {
                    if (action.recommendations.find((removed) => removed.Domain === exist.Domain)) {
                        return {
                            ...exist,
                            Removed: true,
                        };
                    }
                    return exist;
                }),
            };
        }
        case COMMON_WORKSPACES_TOGGLE_RIGHTBAR: {
            const { isRightBarOpen = !state.isRightBarOpen } = action;
            return {
                ...state,
                isRightBarOpen,
            };
        }
        case COMMON_WORKSPACES_CLOSE_RECOMMENDATIONS: {
            return {
                ...state,
                isRecommendationOpen: false,
            };
        }
        case COMMON_WORKSPACES_TOGGLE_RECOMMENDATIONS: {
            const { isRightBarOpen, isRecommendationOpen } = state;
            const { isOpen } = action;
            if (typeof isOpen === "boolean") {
                return {
                    ...state,
                    isRecommendationOpen: isOpen,
                };
            }

            if (isRightBarOpen) {
                if (isRecommendationOpen) {
                    return {
                        ...state,
                        isRightBarOpen: false,
                    };
                }
                return {
                    ...state,
                    isRecommendationOpen: true,
                };
            }

            return {
                ...state,
                isRecommendationOpen: true,
                isRightBarOpen: true,
            };
        }
        case COMMON_WORKSPACES_SELECT_DOMAIN: {
            return {
                ...state,
                selectedDomain: {
                    domain: action.site,
                    favicon: action.favicon,
                    companyName: action.company_name,
                    category: action.site_category,
                    image: action.medium_image,
                    largeImage: action.large_image,
                    alertsCount: action.number_of_unseen_alerts,
                    enrichedData: null,
                    feedData: [],
                },
                isRightBarOpen: true,
                isRecommendationOpen: false,
                selectedTab: action.selectedTab,
                previouslySelectedTab: state.selectedTab,
            };
        }
        case COMMON_WORKSPACES_FETCH_ENRICHED_DATA: {
            return {
                ...state,
                isEnrichedDataLoading: true,
            };
        }
        case COMMON_WORKSPACES_SET_ENRICHED_DATA: {
            return {
                ...state,
                selectedDomain: {
                    ...state.selectedDomain,
                    enrichedData: action.data,
                },
                isEnrichedDataLoading: false,
            };
        }
        case COMMON_WORKSPACES_FETCH_RANKS_DATA: {
            return {
                ...state,
                isRanksDataLoading: true,
            };
        }
        case COMMON_WORKSPACES_SET_RANKS_DATA: {
            return {
                ...state,
                selectedDomain: {
                    ...state.selectedDomain,
                    ranksData: action.data,
                },
                isRanksDataLoading: false,
            };
        }
        case COMMON_WORKSPACES_SET_DESCRIPTION_DATA: {
            return {
                ...state,
                selectedDomain: {
                    ...state.selectedDomain,
                    description: action.description,
                },
            };
        }
        case COMMON_WORKSPACES_FETCH_FEED_DATA: {
            return {
                ...state,
                isFeedDataLoading: true,
            };
        }
        case COMMON_WORKSPACES_SET_FEED_DATA: {
            return {
                ...state,
                selectedDomain: {
                    ...state.selectedDomain,
                    feedData: action.data,
                },
                isFeedDataLoading: false,
            };
        }
        case COMMON_WORKSPACES_SET_FEED_ITEMS_SEEN: {
            const { activeListData, selectedDomain } = state;
            const newActiveListData = activeListData.Records.map((record) => {
                if (action.domain === record.site) {
                    return {
                        ...record,
                        // eslint-disable-next-line @typescript-eslint/camelcase
                        number_of_unseen_alerts: 0,
                    };
                }
                return record;
            });
            const newFeedData = selectedDomain.feedData.map((item) => {
                if (action.seenItems.find((seen) => seen === item.Id)) {
                    return {
                        ...item,
                        LastSeenDate: dayjs.utc().format("YYYY-MM-DD"),
                    };
                }
                return item;
            });
            return {
                ...state,
                activeListData: {
                    ...state.activeListData,
                    Records: newActiveListData,
                },
                selectedDomain: {
                    ...selectedDomain,
                    feedData: newFeedData,
                },
            };
        }
        case COMMON_WORKSPACES_SET_FEED_ITEM_FEEDBACK: {
            const { selectedDomain } = state;
            const newFeedData = selectedDomain.feedData.map((item) => {
                if (action.feedItemsId === item.Id) {
                    return {
                        ...item,
                        FeedbackItemFeedback: {
                            Type: action.feedbackType,
                            text: action.feedbackText,
                        },
                    };
                }
                return item;
            });
            return {
                ...state,
                selectedDomain: {
                    ...selectedDomain,
                    feedData: newFeedData,
                },
            };
        }
        case COMMON_WORKSPACES_UPDATE_LIST_SETTINGS: {
            const workspaceToUpdate = state.workspaces.find(
                ({ workspaceId }) => workspaceId === action.workspaceId,
            );
            const listToUpdate = workspaceToUpdate.opportunityLists.find(
                ({ opportunityListId }) => opportunityListId === action.opportunityListId,
            );
            return {
                ...state,
                workspaces: state.workspaces.map((workspace) => {
                    return workspace !== workspaceToUpdate
                        ? workspace
                        : {
                              ...workspace,
                              opportunityLists: workspace.opportunityLists.map((list) => {
                                  return list !== listToUpdate
                                      ? list
                                      : {
                                            ...list,
                                            settings: {
                                                ...list.settings,
                                                ...action.settings,
                                            },
                                        };
                              }),
                          };
                }),
            };
        }

        case COMMON_WORKSPACES_SELECT_TAB: {
            return {
                ...state,
                previouslySelectedTab: state.selectedTab,
                selectedTab: action.selectedTab,
            };
        }

        case COMMON_WORKSPACES_SET_UNSUPPORTED_FEATURES: {
            return {
                ...state,
                unsupportedFeatures: action.unsupportedFeatures,
            };
        }

        case COMMON_WORKSPACE_LIST_SEARCH: {
            return {
                ...state,
                tableSearchTerm: action.searchTerm,
            };
        }

        case COMMON_WORKSPACE_LIST_SORT: {
            return {
                ...state,
                tableOrderBy: action.orderBy,
            };
        }

        case COMMON_WORKSPACES_MANIPULATION_WEBSITES_MODAL: {
            return {
                ...state,
                isWebsitesModalOpen: !state.isWebsitesModalOpen,
            };
        }

        case COMMON_WORKSPACES_MANIPULATION_UNLOCK_MODAL: {
            return {
                ...state,
                isUnlockModalOpen: action.isOpen,
            };
        }

        case WORKSPACE_SALES_MANIPULATION_EMAIL_DIGEST: {
            return {
                ...state,
                workspaces: state.workspaces.map((workspace) => {
                    return workspace.workspaceId !== action.workspaceId
                        ? workspace
                        : {
                              ...workspace,
                              opportunityLists: workspace.opportunityLists.map((list) => {
                                  return list.opportunityListId !== action.opportunitiesListId
                                      ? list
                                      : {
                                            ...list,
                                            isSubscriptionActive: action.isSubscriptionActive,
                                        };
                              }),
                          };
                }),
            };
        }

        case WORKSPACE_SALES_ADD_SAVED_SEARCH_LIST: {
            const { workspaceId, queryDefinition, lastRun } = action;
            return {
                ...state,
                workspaces: state.workspaces.map((workspace) => {
                    return workspace.workspaceId !== workspaceId
                        ? workspace
                        : {
                              ...workspace,
                              savedSearches: [
                                  ...workspace.savedSearches,
                                  { lastRun, queryDefinition },
                              ],
                          };
                }),
            };
        }

        case WORKSPACE_SALES_UPDATE_SAVED_SEARCH_LIST: {
            const { workspaceId, queryDefinition, lastRun } = action;
            return {
                ...state,
                workspaces: state.workspaces.map((workspace) => {
                    return workspace.workspaceId !== workspaceId
                        ? workspace
                        : {
                              ...workspace,
                              savedSearches: workspace.savedSearches.map((list) => {
                                  return list.queryDefinition.id !== action.queryDefinition.id
                                      ? list
                                      : Object.assign({}, list, { lastRun, queryDefinition });
                              }),
                          };
                }),
            };
        }

        case WORKSPACE_SALES_SET_LEADS_GENERATOR_REPORT: {
            const { queryId, runId } = action;

            return {
                ...state,
                leadsGeneratorReport: Object.assign({}, state.leadsGeneratorReport, {
                    queryId,
                    runId,
                }),
            };
        }

        case WORKSPACE_SALES_MANIPULATION_WEBSITES_WIZARD: {
            return {
                ...state,
                isWebsitesWizardOpen: action.isOpen,
            };
        }

        case WORKSPACE_SALES_REMOVE_LEADS_GENERATOR_REPORT: {
            return {
                ...state,
                leadsGeneratorReport: null,
            };
        }

        case COMMON_WORKSPACES_RESET: {
            return {
                ...defaultState,
            };
        }

        default:
            return state;
    }
};

export const legacySalesWorkspace = (state: ICommonWorkspaceState, action: any) => {
    const newState = innerCommonWorkspace(state, action);
    if (newState !== state) {
        return {
            ...newState,
            workspaces:
                state && state.workspaces && newState.workspaces !== state.workspaces
                    ? newState.workspaces.map((workspace) => {
                          return {
                              ...workspace,
                              opportunityLists: workspace.opportunityLists.sort((a, b) => {
                                  if (a.friendlyName < b.friendlyName) {
                                      return -1;
                                  }
                                  if (a.friendlyName > b.friendlyName) {
                                      return 1;
                                  }
                                  return 0;
                              }),
                          };
                      })
                    : newState.workspaces,
        };
    }
    return state;
};
