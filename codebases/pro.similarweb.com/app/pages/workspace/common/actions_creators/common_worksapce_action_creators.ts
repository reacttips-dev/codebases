/* eslint-disable @typescript-eslint/camelcase */
import { showErrorToast, showSuccessToast } from "actions/toast_actions";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { swSettings } from "common/services/swSettings";
import { getToastItemComponent } from "components/React/Toast/ToastItem";
import { countryTextByIdFilter, i18nFilter } from "filters/ngFilters";
import _ from "lodash";
import dayjs from "dayjs";
import { allTrackers } from "services/track/track";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import InvestorsWorkspaceApiService from "../../../../services/workspaces/investorsWorkspaceApiService";
import SalesWorkspaceApiService from "../../../../services/workspaces/salesWorkspaceApiService";
import {
    COMMON_WORKSPACE_LIST_SEARCH,
    COMMON_WORKSPACE_LIST_SORT,
    COMMON_WORKSPACES_ADD_OPPORTUNITIES_FAIL,
    COMMON_WORKSPACES_ADD_OPPORTUNITIES_START,
    COMMON_WORKSPACES_ADD_OPPORTUNITIES_SUCCESS,
    COMMON_WORKSPACES_ADD_OPPORTUNITY_LIST,
    COMMON_WORKSPACES_ADD_WORKSPACE,
    COMMON_WORKSPACES_DELETE_OPPORTUNITY_LIST,
    COMMON_WORKSPACES_FETCH_ENRICHED_DATA,
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
    COMMON_WORKSPACES_SET_FEED_ITEM_FEEDBACK,
    COMMON_WORKSPACES_SET_RANKS_DATA,
    COMMON_WORKSPACES_SET_UNSUPPORTED_FEATURES,
    COMMON_WORKSPACES_TOGGLE_RECOMMENDATIONS,
    COMMON_WORKSPACES_TOGGLE_RIGHTBAR,
    COMMON_WORKSPACES_UPDATE_LIST_INFO,
    COMMON_WORKSPACES_UPDATE_LIST_SETTINGS,
    COMMON_WORKSPACES_UPDATE_RECOMMENDATIONS,
    COMMON_WORKSPACES_UPDATE_SNAPSHOT_DATE,
    WORKSPACE_SALES_MANIPULATION_EMAIL_DIGEST,
    WORKSPACE_SALES_MANIPULATION_WEBSITES_WIZARD,
    WORKSPACE_SALES_SELECT_ACTIVE_SAVED_SEARCH_LIST,
    WORKSPACE_SALES_UNSELECT_ACTIVE_SAVED_SEARCH_LIST,
    WORKSPACE_SALES_UPDATE_SAVED_SEARCH_LIST,
    COMMON_WORKSPACES_UPDATE_LIST_INFO_START,
} from "../action_types/actionTypes";
import { ANALYSIS_TAB, FEED_TAB, INVESTORS_TYPE, LIST_SETTING_FEED, OVERVIEW_ID } from "../consts";
import { addToWatchlistModal, editListModal } from "../modals_creators";
import { ICommonWorkspaceState } from "../reducers/common_workspace_reducer";
import { selectActiveOpportunityList } from "../selectors";
import { IOpportunityListItem } from "../types";
import { isListActive, safeParse } from "../workspacesUtils";
import {
    fetchSignalsForAllOrInverseThunkAction,
    fetchSignalsForCountryThunkAction,
    removeListIdFromSignalsUseThunkAction,
} from "pages/workspace/sales/sub-modules/signals/store/effects";
import {
    selectActiveSignalFilterId,
    selectActiveSignalsTab,
    selectActiveSignalSubFilterId,
} from "pages/workspace/sales/sub-modules/signals/store/selectors";
import {
    fetchAdNetworksThunkAction,
    fetchFeedsThunkAction,
    fetchTopCountrysThunkAction,
    fetchSiteInfoThunkAction,
} from "pages/workspace/sales/sub-modules/feed/store/effects";
import { ThunkDispatchCommon, ThunkGetState } from "store/types";
import { toggleRightBar as toggleRightBarSales } from "../../sales/sub-modules/common/store/action-creators";
import {
    selectLeadListAction,
    selectWebsiteAction,
} from "pages/workspace/sales/sub-modules/opportunities-lists/store/action-creators";

export const commonActionCreators = ({ api, component }) => {
    let workspaceType = "";

    if (api instanceof SalesWorkspaceApiService) {
        workspaceType = "sales";
    }

    const selectActiveWorkspace = (workspaceId) => (dispatch) => {
        const swNavigator = Injector.get<SwNavigator>("swNavigator");
        const { workspaceId: idInUrl } = swNavigator.getParams();

        if (idInUrl !== workspaceId) {
            swNavigator.updateParams({ workspaceId });
        }
        return dispatch({
            type: COMMON_WORKSPACES_SELECT_ACTIVE_WORKSPACE,
            workspaceId,
        });
    };

    const updateSnapshotDate = () => {
        const lastSnapshotDate = component.resources.SupportedDate;
        return {
            type: COMMON_WORKSPACES_UPDATE_SNAPSHOT_DATE,
            lastSnapshotDate: dayjs.utc(lastSnapshotDate),
        };
    };

    const selectActiveList = (opportunityListId) => {
        return (dispatch) => {
            const swNavigator = Injector.get<SwNavigator>("swNavigator");
            const { listId } = swNavigator.getParams();
            if (listId !== opportunityListId) {
                swNavigator.updateParams({ listId: opportunityListId });
            }
            dispatch(selectLeadListAction(opportunityListId));
            // TODO: Keep this one until refactored
            return dispatch({
                type: COMMON_WORKSPACES_SELECT_ACTIVE_LIST,
                activeListId: opportunityListId,
            });
        };
    };

    const selectActiveSearchList = (searchQueryDefinitionId, rawQueryParams) => (dispatch) => {
        const MODE_CATEGORIES = "categories";
        const MODE_TECHNOLOGIES = "technologies";
        const FUNCTIONALITY_EXCLUDE = "exclude";
        const FUNCTIONALITY_INCLUDE = "include";

        const queryParams = _.cloneDeep(rawQueryParams);
        const swNavigator = Injector.get<SwNavigator>("swNavigator");
        const { searchId, newLeadsOnly } = swNavigator.getParams();

        if (searchId !== searchQueryDefinitionId) {
            swNavigator.updateParams({
                searchId: searchQueryDefinitionId,
            });
        }

        if (newLeadsOnly) queryParams.filters.newLeadsOnly = safeParse(newLeadsOnly);

        const { technographics_excluded, technographics_included } = queryParams.filters;

        if (technographics_excluded) {
            let mode;
            let values = [];
            const {
                technographics_parent_category,
                technographics_technology,
            } = technographics_excluded;
            if (technographics_technology) {
                values = technographics_technology.map((item) => ({ text: item }));
            }

            if (technographics_parent_category) {
                values = technographics_parent_category.map((text) => ({ text }));
                mode = MODE_CATEGORIES;
            }

            if (technographics_technology) {
                values = technographics_technology.map((text) => ({ text }));
                mode = MODE_TECHNOLOGIES;
            }

            queryParams.filters.technographics_excluded = {
                functionality: FUNCTIONALITY_EXCLUDE,
                mode,
                values,
            };
        }

        if (technographics_included) {
            let mode;
            let values = [];
            const {
                technographics_parent_category,
                technographics_technology,
            } = technographics_included;
            if (technographics_technology) {
                values = technographics_technology.map((item) => ({ text: item }));
            }

            if (technographics_parent_category) {
                values = technographics_parent_category.map((item) => ({ text: item }));
                mode = MODE_CATEGORIES;
            }

            if (technographics_technology) {
                values = technographics_technology.map((item) => ({ text: item }));
                mode = MODE_TECHNOLOGIES;
            }

            queryParams.filters.technographics_included = {
                functionality: FUNCTIONALITY_INCLUDE,
                mode,
                values,
            };
        }

        return dispatch({
            type: WORKSPACE_SALES_SELECT_ACTIVE_SAVED_SEARCH_LIST,
            searchId: searchQueryDefinitionId,
            queryParams,
        });
    };

    const unSelectActiveSearchList = () => {
        return (dispatch) => {
            const swNavigator = Injector.get<SwNavigator>("swNavigator");

            swNavigator.updateParams({
                searchId: null,
            });

            return dispatch({ type: WORKSPACE_SALES_UNSELECT_ACTIVE_SAVED_SEARCH_LIST });
        };
    };

    const fetchWorkspaces = () => {
        return async (dispatch, getState) => {
            try {
                dispatch({
                    type: COMMON_WORKSPACES_FETCH_WORKSPACES,
                });
                const workspaces = await api.getWorkspaces();
                dispatch({
                    type: COMMON_WORKSPACES_FETCH_WORKSPACES_SUCCESS,
                    workspaces,
                });
                return getState().commonWorkspace.workspaces;
            } catch (e) {
                dispatch({
                    type: COMMON_WORKSPACES_FETCH_WORKSPACES_FAILED,
                });
            }
        };
    };

    const fetchListOpportunities = (
        workspaceId,
        opportunitiesListId,
        params: any = {},
        holdRightBarOpen = false,
    ) => {
        return async (dispatch, getState) => {
            try {
                dispatch({
                    type: COMMON_WORKSPACES_FETCH_LIST_DATA_START,
                    holdRightBarOpen,
                });
                const {
                    lastSnapshotDate,
                    tableSearchTerm,
                    tableOrderBy,
                } = getState().commonWorkspace;
                const selectedSignalFilterId = selectActiveSignalFilterId(getState());
                const selectedSignalSubFilterId = selectActiveSignalSubFilterId(getState());
                const allCountriesSelected = selectActiveSignalsTab(getState()) !== 0;

                if (selectedSignalFilterId && !params.eventFilterType) {
                    params.eventFilterType = selectedSignalFilterId;
                }

                if (selectedSignalSubFilterId && !params.eventFilterSubType) {
                    params.eventFilterSubType = selectedSignalSubFilterId;
                }

                if (allCountriesSelected) {
                    params.allCountries = true;
                }

                if (tableSearchTerm) {
                    params.filter = `Site;contains;"${tableSearchTerm}"`;
                }
                if (tableOrderBy) {
                    params.orderBy = tableOrderBy;
                }
                const response = await api.getOpportunitiesList({
                    workspaceId,
                    opportunitiesListId,
                    ...params,
                    date: lastSnapshotDate.format("YYYY-MM"),
                });
                if (isListActive(opportunitiesListId, workspaceId)) {
                    const {
                        TotalCount = 0,
                        Data: Records = [],
                        KeysDataVerification,
                        Header,
                        Filters,
                    } = response;
                    dispatch({
                        type: COMMON_WORKSPACES_SET_ACTIVE_LIST_DATA_SUCCESS,
                        data: {
                            TotalCount,
                            Records,
                            KeysDataVerification,
                            Header,
                            Filters,
                        },
                    });
                }
                return response;
            } catch (e) {
                dispatch({
                    type: COMMON_WORKSPACES_FETCH_WORKSPACES_FAILED,
                });
            }
        };
    };

    const setLoadingTable = () => ({ type: COMMON_WORKSPACES_FETCH_WORKSPACES });

    const removeOpportunities = (items) => {
        const itemsToRemove = Array.isArray(items) ? items : [items];
        return async (dispatch, getState) => {
            try {
                dispatch({
                    type: COMMON_WORKSPACES_OPTIMISTIC_REMOVE_OPPORTUNITIES,
                    itemsToRemove,
                });
                const { activeWorkspaceId, activeListId, workspaces } = getState().commonWorkspace;
                await api.deleteOpportunities(
                    activeWorkspaceId,
                    activeListId,
                    itemsToRemove.map(({ site }) => ({
                        Domain: site,
                    })),
                );
                const getActiveList = () => {
                    const lists = workspaces[0].opportunityLists;
                    return lists.find(
                        ({ opportunityListId }) => opportunityListId === activeListId,
                    );
                };
                const activeList = getActiveList();
                dispatch(
                    fetchSignalsForAllOrInverseThunkAction(
                        activeWorkspaceId,
                        activeListId,
                        activeList.country,
                    ),
                );
            } catch (e) {
                dispatch({
                    type: COMMON_WORKSPACES_FETCH_WORKSPACES_FAILED,
                });
                throw e;
            }
        };
    };

    const createWorkspace = () => {
        return async (dispatch) => {
            try {
                const workspace = await api.createWorkspace();
                if (workspace.workspaceId) {
                    dispatch({
                        type: COMMON_WORKSPACES_ADD_WORKSPACE,
                        workspace,
                    });
                }
            } catch (e) {
                dispatch({
                    type: COMMON_WORKSPACES_FETCH_WORKSPACES_FAILED,
                    workspaces: null,
                });
            }
        };
    };

    const createOpportunitiesList = (listName, workspaceId, opportunities) => {
        return async (dispatch) => {
            try {
                const { InitialCountry: country } = component.resources;
                const res = await api.createOpportunitiesList(
                    workspaceId,
                    listName,
                    country,
                    opportunities,
                );
                const newList = {
                    ...res.opportunitiesList,
                };
                dispatch({
                    type: COMMON_WORKSPACES_ADD_OPPORTUNITY_LIST,
                    newList,
                    workspaceId,
                });
                return newList;
            } catch (e) {
                dispatch({
                    type: COMMON_WORKSPACES_FETCH_WORKSPACES_FAILED,
                });
            }
        };
    };

    const deleteOpportunityList = (workspaceId: string, listId: string) => async (
        dispatch: ThunkDispatchCommon,
    ) => {
        await api.deleteList(workspaceId, listId);

        dispatch(removeListIdFromSignalsUseThunkAction(listId));

        return dispatch({
            type: COMMON_WORKSPACES_DELETE_OPPORTUNITY_LIST,
            listId,
            workspaceId,
        });
    };

    const updateOpportunityList = (workspaceId, listId, { friendlyName, country }) => async (
        dispatch,
        getState,
    ) => {
        dispatch({ type: COMMON_WORKSPACES_UPDATE_LIST_INFO_START });
        await api.updateListInfo(workspaceId, listId, {
            friendlyName,
            country,
        });
        const res = dispatch({
            type: COMMON_WORKSPACES_UPDATE_LIST_INFO,
            friendlyName,
            country,
            listId,
            workspaceId,
        });
        const { isRightBarOpen } = getState().commonWorkspace;
        if (isRightBarOpen) {
            dispatch(getRightBarData());
        }
        return res;
    };

    const updateOpportunityListSettings = (workspaceId, opportunityListId, settings) => async (
        dispatch,
        getState,
    ) => {
        const res = await api.updateOpportunityListSettings({
            workspaceId,
            opportunityListId,
            settings,
        });
        const getActiveList = () => {
            const lists = getState().commonWorkspace.workspaces[0].opportunityLists;
            return lists.find(({ opportunityListId }) => opportunityListId === opportunityListId);
        };
        const activeList = getActiveList();

        dispatch(
            fetchSignalsForCountryThunkAction(workspaceId, opportunityListId, activeList.country),
        );
        dispatch(
            fetchSignalsForAllOrInverseThunkAction(
                workspaceId,
                opportunityListId,
                activeList.country,
            ),
        );

        if (!_.isEqual(settings.alerts, activeList.settings.alerts)) {
            dispatch(
                showSuccessToast(i18nFilter()("workspace.settings.update_countries.toast.success")),
            );
        }
        dispatch({
            type: COMMON_WORKSPACES_UPDATE_LIST_SETTINGS,
            settings,
            opportunityListId,
            workspaceId,
        });
        const { isRightBarOpen } = getState().commonWorkspace;
        if (isRightBarOpen) {
            dispatch(getRightBarData());
        }
        return res;
    };

    const editOpportunityList = (
        workspaceId,
        list: IOpportunityListItem,
        editFeedGeos?,
        selectedTab?,
    ) => {
        return async (dispatch: ThunkDispatchCommon, getState: ThunkGetState) => {
            try {
                const { unsupportedFeatures } = getState().commonWorkspace;
                const {
                    action,
                    list: { opportunityListId, friendlyName, country, settings },
                } = await editListModal({
                    unsupportedFeatures,
                    list,
                    mode: "edit",
                    editFeedGeos,
                    selectedTab,
                    variant: "old",
                });
                let p1 = Promise.resolve();
                let p2 = Promise.resolve();
                switch (action) {
                    case "update":
                        if (friendlyName !== list.friendlyName || country !== list.country) {
                            p1 = dispatch(
                                updateOpportunityList(workspaceId, opportunityListId, {
                                    friendlyName,
                                    country,
                                }),
                            );
                        }
                        if (!_.isEqual(settings, list.settings)) {
                            p2 = dispatch(
                                updateOpportunityListSettings(
                                    workspaceId,
                                    opportunityListId,
                                    settings,
                                ),
                            );
                        }
                        return Promise.all([p1, p2]);

                    case "delete":
                        await dispatch(deleteOpportunityList(workspaceId, opportunityListId));
                        dispatch(selectActiveList(OVERVIEW_ID));
                        return;
                }
            } catch (e) {
                dispatch({
                    type: COMMON_WORKSPACES_FETCH_WORKSPACES_FAILED,
                });
            }
        };
    };

    const addOpportunities = (
        workspaceId,
        opportunitiesListId,
        opportunities,
        holdRightBarOpen = false,
        isFeatureSavedSearchesEnabled = false,
    ) => {
        return async (dispatch, getState) => {
            try {
                dispatch({
                    type: COMMON_WORKSPACES_ADD_OPPORTUNITIES_START,
                });

                const commonWorkspaceObj = getState().commonWorkspace;

                const { leadsGeneratorReport } = commonWorkspaceObj;
                const activeList = selectActiveOpportunityList(commonWorkspaceObj);

                const updatedList = await api.addOpportunities(
                    workspaceId,
                    opportunitiesListId,
                    opportunities,
                    leadsGeneratorReport?.queryId,
                    leadsGeneratorReport?.runId,
                );

                dispatch({
                    type: COMMON_WORKSPACES_ADD_OPPORTUNITIES_SUCCESS,
                    updatedList: {
                        ...updatedList,
                    },
                    workspaceId,
                });

                if (activeList) {
                    dispatch(
                        fetchSignalsForCountryThunkAction(
                            workspaceId,
                            opportunitiesListId,
                            activeList.country,
                        ),
                    );
                    dispatch(
                        fetchSignalsForAllOrInverseThunkAction(
                            workspaceId,
                            opportunitiesListId,
                            activeList.country,
                        ),
                    );
                }

                if (updatedList?.query) {
                    dispatch({
                        type: WORKSPACE_SALES_UPDATE_SAVED_SEARCH_LIST,
                        workspaceId,
                        queryDefinition: updatedList.query.queryDefinition,
                        lastRun: updatedList.query.lastRun,
                    });
                }

                let successText = "";
                switch (workspaceType) {
                    case "sales":
                        successText =
                            opportunities.length > 1
                                ? "workspace.sales.add_opportunities.multiple"
                                : "workspace.sales.add_opportunities";
                        break;
                    default:
                        successText =
                            opportunities.length > 1
                                ? "wa.ao.header.trackSuccess.multiple"
                                : "wa.ao.header.trackSuccess";
                        break;
                }

                if (updatedList.opportunities.length < opportunities.length) {
                    successText = "workspace.add_opportunities.duplicates_error";
                }

                if (workspaceType === "sales" && isFeatureSavedSearchesEnabled) {
                    dispatch(
                        showSuccessToast(
                            getToastItemComponent({
                                text: i18nFilter()(successText),
                                linkText: i18nFilter()(
                                    "workspace.add_opportunities.success.see_list",
                                ),
                                onClick: () => {
                                    dispatch(toggleWebsitesWizard(false));
                                    dispatch(selectActiveList(opportunitiesListId));
                                    dispatch(
                                        fetchListOpportunities(
                                            workspaceId,
                                            opportunitiesListId,
                                            {},
                                            false,
                                        ),
                                    );
                                    dispatch(
                                        fetchRecommendations(workspaceId, opportunitiesListId),
                                    );
                                },
                            }),
                        ),
                    );
                } else {
                    dispatch(showSuccessToast(i18nFilter()(successText)));
                }

                if (isListActive(opportunitiesListId, workspaceId)) {
                    if (!activeList.opportunities.length) {
                        dispatch(fetchRecommendations(workspaceId, opportunitiesListId));
                    }
                }

                dispatch(
                    fetchListOpportunities(workspaceId, opportunitiesListId, {}, holdRightBarOpen),
                );

                return updatedList;
            } catch (e) {
                dispatch({
                    type: COMMON_WORKSPACES_ADD_OPPORTUNITIES_FAIL,
                });
                dispatch(showErrorToast(i18nFilter()("workspace.add_opportunities.quota_error")));
                TrackWithGuidService.trackWithGuid("workspace.add_opportunities.error", "show");
            }
        };
    };

    const subscribeEmailDigest = (workspaceId, opportunitiesListId) => {
        return async (dispatch) => {
            try {
                await api.subscribeEmailDigest(workspaceId, opportunitiesListId);

                dispatch({
                    type: WORKSPACE_SALES_MANIPULATION_EMAIL_DIGEST,
                    isSubscriptionActive: true,
                    workspaceId,
                    opportunitiesListId,
                });

                dispatch(
                    showSuccessToast(i18nFilter()("workspace.sales.email.digest.toast.subscribe")),
                );
            } catch (e) {
                dispatch(
                    showErrorToast(
                        i18nFilter()("workspace.sales.email.digest.toast.subscribe.error"),
                    ),
                );

                dispatch({
                    type: WORKSPACE_SALES_MANIPULATION_EMAIL_DIGEST,
                    isSubscriptionActive: false,
                    workspaceId,
                    opportunitiesListId,
                });
            }
        };
    };

    const unSubscribeEmailDigest = (workspaceId, opportunitiesListId) => {
        return async (dispatch, getState) => {
            try {
                await api.unSubscribeEmailDigest(workspaceId, opportunitiesListId);

                dispatch({
                    type: WORKSPACE_SALES_MANIPULATION_EMAIL_DIGEST,
                    isSubscriptionActive: false,
                    workspaceId,
                    opportunitiesListId,
                });

                dispatch(
                    showSuccessToast(
                        i18nFilter()("workspace.sales.email.digest.toast.unsubscribe"),
                    ),
                );
            } catch (e) {
                dispatch(
                    showErrorToast(
                        i18nFilter()("workspace.sales.email.digest.toast.unsubscribe.error"),
                    ),
                );

                dispatch({
                    type: WORKSPACE_SALES_MANIPULATION_EMAIL_DIGEST,
                    isSubscriptionActive: true,
                    workspaceId,
                    opportunitiesListId,
                });
            }
        };
    };

    const fetchRecommendations = (workspaceId, listId) => {
        return async (dispatch, getState) => {
            try {
                dispatch({
                    type: COMMON_WORKSPACES_FETCH_RECOMMENDATIONS,
                });
                const { lastSnapshotDate } = getState().commonWorkspace;
                const recommendations = await api.getRecommendations(
                    workspaceId,
                    listId,
                    lastSnapshotDate.format("YYYY-MM"),
                );
                if (isListActive(listId, workspaceId)) {
                    dispatch({
                        type: COMMON_WORKSPACES_UPDATE_RECOMMENDATIONS,
                        recommendations: recommendations.map((item) => ({
                            ...item,
                            TopCountryName: countryTextByIdFilter()(item.TopCountry),
                            Date: lastSnapshotDate.valueOf(),
                        })),
                    });
                }
            } catch (e) {
                dispatch(
                    showErrorToast(i18nFilter()("workspace.recommendation_sidebar.fetch.fail")),
                );
                dispatch({
                    type: COMMON_WORKSPACES_UPDATE_RECOMMENDATIONS,
                    recommendations: [],
                });
            }
        };
    };

    const dismissRecommendation = (workspaceId, listId, recommendation) => {
        return async (dispatch) => {
            try {
                dispatch(removeRecommendations([{ Domain: recommendation }]));
                await api.dismissRecommendation(workspaceId, listId, recommendation);
            } catch (err) {
                dispatch(
                    showErrorToast(i18nFilter()("workspace.recommendation_sidebar.dismiss.fail")),
                );
            }
        };
    };

    const addRecommendations = (
        workspaceId,
        opportunitiesListId,
        recommendations,
        holdRightBarOpen = false,
    ) => {
        return (dispatch) => {
            dispatch(removeRecommendations(recommendations));
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(
                        dispatch(
                            addOpportunities(
                                workspaceId,
                                opportunitiesListId,
                                recommendations,
                                holdRightBarOpen,
                            ),
                        ),
                    );
                }, 1000);
            });
        };
    };

    const removeRecommendations = (recommendations) => {
        return (dispatch) => {
            dispatch({
                type: COMMON_WORKSPACES_REMOVE_RECOMMENDATIONS,
                recommendations,
            });
        };
    };

    const toggleRightBar = (isRightBarOpen) => {
        return (dispatch, getState) => {
            const { selectedDomain, selectedTab } = getState().commonWorkspace;
            if (selectedDomain && selectedDomain.domain) {
                allTrackers.trackEvent(
                    "Expanded Side bar",
                    isRightBarOpen ? "open" : "close",
                    `${selectedDomain.domain}/Tab/${selectedTab.toLowerCase().replace("_", " ")}`,
                );
            }
            dispatch({
                type: COMMON_WORKSPACES_TOGGLE_RIGHTBAR,
                isRightBarOpen,
            });
        };
    };

    const toggleRecommendations = (isOpen) => ({
        type: COMMON_WORKSPACES_TOGGLE_RECOMMENDATIONS,
        isOpen,
    });

    const toggleWebsitesWizard = (isOpen) => ({
        type: WORKSPACE_SALES_MANIPULATION_WEBSITES_WIZARD,
        isOpen,
    });

    const toggleWebsitesModal = () => ({
        type: "COMMON_WORKSPACES_MANIPULATION_WEBSITES_MODAL",
    });

    const toggleUnlockModal = (isOpen) => ({
        type: "COMMON_WORKSPACES_MANIPULATION_UNLOCK_MODAL",
    });

    const getRightBarData = () => {
        return async (dispatch, getState) => {
            const { commonWorkspace }: { commonWorkspace: ICommonWorkspaceState } = getState();
            const {
                unsupportedFeatures,
                activeListId,
                activeWorkspaceId,
                lastSnapshotDate,
                selectedDomain,
            } = commonWorkspace;
            const { country } = selectActiveOpportunityList(commonWorkspace);
            if (selectedDomain) {
                const { domain } = selectedDomain;
                if (domain) {
                    dispatch(
                        getDescription({
                            country,
                            domain,
                            lastSnapshotDate,
                        }),
                    );
                    dispatch(
                        getRanksData({
                            country,
                            domain,
                            lastSnapshotDate,
                        }),
                    );
                    dispatch(
                        getEnrichedData({
                            opportunityListId: activeListId,
                            workspaceId: activeWorkspaceId,
                            country,
                            domain,
                            lastSnapshotDate,
                        }),
                    );
                    if (!unsupportedFeatures.has(LIST_SETTING_FEED)) {
                        dispatch(fetchFeedsThunkAction(activeWorkspaceId, activeListId, domain));
                        dispatch(fetchTopCountrysThunkAction(domain));
                        dispatch(fetchAdNetworksThunkAction(domain, country));
                        dispatch(fetchSiteInfoThunkAction(domain, country));
                    }
                }
            }
        };
    };

    const getDescription = ({ country, domain, lastSnapshotDate }) => {
        return async (dispatch) => {
            const startDate = lastSnapshotDate.format("YYYY|MM|DD");
            const endDate = lastSnapshotDate.endOf("month").format("YYYY|MM|DD");
            dispatch({
                type: COMMON_WORKSPACES_FETCH_RANKS_DATA,
            });
            try {
                const result = await api.getWebsiteHeader(domain, country, startDate, endDate);
                dispatch({
                    type: COMMON_WORKSPACES_SET_DESCRIPTION_DATA,
                    description: result[domain].description,
                });
            } catch (e) {
                dispatch({
                    type: COMMON_WORKSPACES_SET_DESCRIPTION_DATA,
                    description: "",
                });
            }
        };
    };

    const getRanksData = ({ country, domain, lastSnapshotDate }) => {
        return async (dispatch) => {
            const startDate = lastSnapshotDate.format("YYYY|MM|DD");
            const endDate = lastSnapshotDate.endOf("month").format("YYYY|MM|DD");
            dispatch({
                type: COMMON_WORKSPACES_FETCH_RANKS_DATA,
            });
            try {
                const result = await api.getWebsiteRanks(domain, country, startDate, endDate);
                dispatch({
                    type: COMMON_WORKSPACES_SET_RANKS_DATA,
                    data: result.Data[domain],
                });
            } catch (e) {
                dispatch({
                    type: COMMON_WORKSPACES_SET_RANKS_DATA,
                    data: {},
                });
            }
        };
    };

    const getEnrichedData = ({
        opportunityListId,
        workspaceId,
        country,
        domain,
        lastSnapshotDate,
    }) => {
        return async (dispatch) => {
            const to = lastSnapshotDate.format("YYYY|MM|DD");

            // TODO: Use `WebAllowedDuration`
            const months = swSettings.components.Home.resources.IsTrial ? 5 : 23;

            const from = lastSnapshotDate.clone().subtract(months, "months").format("YYYY|MM|DD");
            dispatch({
                type: COMMON_WORKSPACES_FETCH_ENRICHED_DATA,
            });
            const data = await api.getEnrichedTableRow({
                opportunityListId,
                workspaceId,
                country,
                domain,
                from,
                to,
            });
            dispatch({
                type: COMMON_WORKSPACES_SET_ENRICHED_DATA,
                data,
            });
        };
    };

    const searchTableList = (searchTerm) => {
        return {
            type: COMMON_WORKSPACE_LIST_SEARCH,
            searchTerm,
        };
    };

    const sortTableList = (orderBy) => {
        return {
            type: COMMON_WORKSPACE_LIST_SORT,
            orderBy,
        };
    };

    const onRowSelected = (
        e,
        {
            site,
            favicon,
            company_name,
            site_category,
            medium_image,
            large_image,
            number_of_unseen_alerts,
        },
    ) => {
        return (dispatch, getState) => {
            const { salesWorkspace, commonWorkspace } = getState();
            const { selectedDomain, isRightBarOpen, isRecommendationOpen } = commonWorkspace;
            const { isRightBarOpen: isRightBarOpenSales } = salesWorkspace.common;

            if (!selectedDomain || isRecommendationOpen || selectedDomain.domain !== site) {
                const selectedTab = number_of_unseen_alerts > 0 ? FEED_TAB : ANALYSIS_TAB;
                if (!isRightBarOpen) {
                    allTrackers.trackEvent(
                        "Expanded Side bar",
                        "open",
                        `${site}/Tab/${selectedTab.toLowerCase().replace("_", " ")}`,
                    );
                }
                dispatch({
                    type: COMMON_WORKSPACES_SELECT_DOMAIN,
                    site,
                    favicon,
                    company_name,
                    site_category,
                    medium_image,
                    large_image,
                    number_of_unseen_alerts,
                    selectedTab,
                });
                // New action for selecting a website
                dispatch(
                    selectWebsiteAction({
                        domain: site,
                        favicon,
                    }),
                );
                dispatch(getRightBarData());
                /**
                 * Action toggle right bar only for sales workspace
                 */
                if (workspaceType === "sales") {
                    dispatch(toggleRightBarSales(true));
                }
            } else {
                /**
                 * Action toggle right bar only for sales workspace
                 */

                if (workspaceType === "sales") {
                    dispatch(toggleRightBarSales(!isRightBarOpenSales));
                } else {
                    dispatch(toggleRightBar(!isRightBarOpen));
                }
            }
        };
    };

    const setFeedItemFeedback = (feedItemsId, feedbackType, feedbackText) => {
        return async (dispatch, getState) => {
            const { activeWorkspaceId, activeListId, selectedDomain } = getState().commonWorkspace;
            if (selectedDomain) {
                const { domain } = selectedDomain;
                if (domain) {
                    await api.setFeedItemFeedback(
                        activeWorkspaceId,
                        activeListId,
                        domain,
                        feedItemsId,
                        feedbackType,
                        feedbackText,
                    );
                    dispatch({
                        type: COMMON_WORKSPACES_SET_FEED_ITEM_FEEDBACK,
                        feedItemsId,
                        feedbackType,
                        feedbackText,
                    });
                    dispatch(
                        showSuccessToast(
                            i18nFilter()("workspace.feed_sidebar.feedback.toast.success"),
                        ),
                    );
                }
            }
        };
    };

    const setUnsupportedFeatures = (unsupportedFeatures) => ({
        type: COMMON_WORKSPACES_SET_UNSUPPORTED_FEATURES,
        unsupportedFeatures,
    });

    const reset = () => ({
        type: COMMON_WORKSPACES_RESET,
    });

    const unsubscribeFromMonthlyDigest = () => async (dispatch) => {
        try {
            await api.unsubscribeFromMonthlyDigest();

            dispatch(
                showSuccessToast(i18nFilter()("workspace.sales.email.digest.toast.unsubscribe")),
            );
        } catch (e) {
            dispatch(showErrorToast(i18nFilter()("workspaces.sales.digest.unsubscribe_error")));
        }
    };

    return {
        toggleUnlockModal,
        toggleWebsitesModal,
        selectActiveWorkspace,
        updateSnapshotDate,
        selectActiveList,
        selectActiveSearchList,
        unSelectActiveSearchList,
        fetchWorkspaces,
        fetchListOpportunities,
        setLoadingTable,
        removeOpportunities,
        createWorkspace,
        createOpportunitiesList,
        deleteOpportunityList,
        updateOpportunityList,
        editOpportunityList,
        addOpportunities,
        fetchRecommendations,
        dismissRecommendation,
        addRecommendations,
        setFeedItemFeedback,
        toggleWebsitesWizard,
        toggleRightBar,
        toggleRecommendations,
        onRowSelected,
        setUnsupportedFeatures,
        searchTableList,
        sortTableList,
        reset,
        subscribeEmailDigest,
        unSubscribeEmailDigest,
        unsubscribeFromMonthlyDigest,
    };
};

export const addSiteToWatchList = (domain) => {
    return async (dispatch) => {
        try {
            const { worksapceType, workspaceId, opportunityListId } = await addToWatchlistModal(
                domain,
            );
            try {
                const api =
                    worksapceType === INVESTORS_TYPE
                        ? new InvestorsWorkspaceApiService()
                        : new SalesWorkspaceApiService();
                const res = await dispatch(
                    commonActionCreators({
                        api,
                        component: null,
                    }).addOpportunities(workspaceId, opportunityListId, [
                        {
                            Domain: domain,
                        },
                    ]),
                );
                return res;
            } catch (e) {
                return null;
            }
        } catch (e) {
            return null;
        }
    };
};

export const selectTab = (selectedTab) => ({
    type: COMMON_WORKSPACES_SELECT_TAB,
    selectedTab,
});
