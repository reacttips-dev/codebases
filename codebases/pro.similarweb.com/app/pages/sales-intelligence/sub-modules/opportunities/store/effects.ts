import { compose } from "redux";
import { RootState, ThunkDispatchCommon, ThunkGetState } from "store/types";
import { ThunkDependencies } from "store/thunk-dependencies";
import * as actionCreators from "./action-creators";
import { selectLegacyWorkspaceId } from "../../common/store/selectors";
import { i18nFilter } from "filters/ngFilters";
import { showSuccessToast } from "actions/toast_actions";
import {
    fetchSignalsForAllOrInverseThunkAction,
    fetchSignalsForCountryThunkAction,
    removeListIdFromSignalsUseThunkAction,
} from "pages/workspace/sales/sub-modules/signals/store/effects";
import { getSearchId, getSearchUsedResultCount } from "../../saved-searches/helpers";
import { updateSearchUsedResultCount } from "../../saved-searches/store/action-creators";
import {
    AddOpportunitiesToListDto,
    ListRecommendationsRequestParams,
    ListTableDataRequestParams,
    OpportunityListSettings,
    OpportunityListType,
    OpportunityType,
    UpdateOpportunityListDto,
} from "../types";
import {
    selectOpportunityLists,
    selectOpportunityListTable,
    selectOpportunityListTableFilters,
} from "pages/sales-intelligence/sub-modules/opportunities/store/selectors";
import dateTimeService from "services/date-time/dateTimeService";
import {
    selectActiveSignalFilterId,
    selectActiveSignalsTab,
    selectActiveSignalSubFilterId,
} from "pages/workspace/sales/sub-modules/signals/store/selectors";
import { appendTableRequestParam } from "../../../sub-modules/opportunities/helpers";
import { getToastItemComponent } from "components/React/Toast/ToastItem";
import { Injector } from "common/ioc/Injector";
import { STATIC_LIST_PAGE_ROUTE } from "pages/sales-intelligence/constants/routes";
import { getType } from "typesafe-actions";
import { setListTableFiltersAction } from "./action-creators";
import { fetchExcelQuotaThunk } from "pages/sales-intelligence/sub-modules/common/store/effects";
import { selectActiveWorkspaceId } from "pages/workspace/sales/store/selectors";

export const getParamsForListTable = (
    listId: string,
    state: RootState,
    deps: ThunkDependencies,
) => {
    const date = dateTimeService.formatWithMoment(
        deps.si.settingsHelper.getLastSnapshotDate(),
        "YYYY-MM",
    );
    const tableFilters = selectOpportunityListTableFilters(state);
    const selectedSignalFilterId = selectActiveSignalFilterId(state);
    const selectedSignalSubFilterId = selectActiveSignalSubFilterId(state);
    const allCountriesSelected = selectActiveSignalsTab(state) !== 0;

    const requestParams: ListTableDataRequestParams = compose(
        appendTableRequestParam("page", tableFilters.page),
        appendTableRequestParam("filter", tableFilters.search),
        appendTableRequestParam("orderBy", tableFilters.orderBy),
        appendTableRequestParam("pageSize", tableFilters.pageSize),
        appendTableRequestParam("allCountries", allCountriesSelected),
        appendTableRequestParam("eventFilterType", selectedSignalFilterId),
        appendTableRequestParam("eventFilterSubType", selectedSignalSubFilterId),
    )({
        workspaceId: selectLegacyWorkspaceId(state),
        opportunitiesListId: listId,
        date,
    });

    return requestParams;
};

// Copied most of it from legacy "action_creators" file
// TODO: Refactor if there is time for it.
export const fetchOpportunityListTableDataThunk = (
    listId: OpportunityListType["opportunityListId"],
) => async (dispatch: ThunkDispatchCommon, getState: ThunkGetState, deps: ThunkDependencies) => {
    dispatch(actionCreators.fetchListTableDataAsync.request());

    const state = getState();

    const requestParams: ListTableDataRequestParams = getParamsForListTable(listId, state, deps);

    try {
        const data = await deps.si.api.opportunities.fetchOpportunityListTableData(requestParams);

        dispatch(actionCreators.fetchListTableDataAsync.success(data));
    } catch (e) {
        dispatch(actionCreators.fetchListTableDataAsync.failure(e));
    }
};

export const createOpportunityListThunk = (
    name: string,
    domains: { Domain: string }[] = [],
    queryId = "",
    runId = "",
) => async (dispatch: ThunkDispatchCommon, getState: ThunkGetState, deps: ThunkDependencies) => {
    dispatch(actionCreators.createOpportunityListAsync.request());

    const workspaceId = selectLegacyWorkspaceId(getState()) as string;
    const country = deps.si.settingsHelper.getInitialCountry();

    try {
        const response = await deps.si.api.opportunities.createOpportunityList({
            name,
            domains,
            country,
            workspaceId,
            runId,
            queryId,
        });

        dispatch(actionCreators.createOpportunityListAsync.success(response.opportunitiesList));

        // Update saved search object with new "usedResultCount"
        if (typeof response.query !== "undefined") {
            dispatch(
                updateSearchUsedResultCount({
                    searchQueryId: getSearchId(response.query),
                    count: getSearchUsedResultCount(response.query),
                }),
            );
        }

        return response;
    } catch (e) {
        dispatch(actionCreators.createOpportunityListAsync.failure(e));
    }
};

export const createOpportunityListFromSearchThunk = (
    name: string,
    domains: { Domain: string }[] = [],
    queryId = "",
    runId = "",
) => async (dispatch: ThunkDispatchCommon) => {
    const { opportunitiesList } = await dispatch(
        createOpportunityListThunk(name, domains, queryId, runId),
    );

    if (!domains.length) {
        return;
    }

    // Copied from old code
    const translate = i18nFilter();
    const toastTextKey =
        domains.length > 1
            ? "si.pages.search_result.add_leads_to_list.success.plural"
            : "si.pages.search_result.add_leads_to_list.success";

    dispatch(
        showSuccessToast(
            getToastItemComponent({
                text: translate(toastTextKey),
                linkText: translate("workspace.add_opportunities.success.see_list"),
                onClick: () => {
                    Injector.get("swNavigator").go(STATIC_LIST_PAGE_ROUTE, {
                        id: opportunitiesList.opportunityListId,
                    });
                },
            }),
        ),
    );
};

export const updateOpportunityListThunk = (
    listId: OpportunityListType["opportunityListId"],
    dto: UpdateOpportunityListDto,
) => async (dispatch: ThunkDispatchCommon, getState: ThunkGetState, deps: ThunkDependencies) => {
    dispatch(actionCreators.updateOpportunityListAsync.request());

    const workspaceId = selectLegacyWorkspaceId(getState()) as string;

    // TODO: Remove when BE is ready
    const listFromStore = selectOpportunityLists(getState()).find(
        (l) => l.opportunityListId === listId,
    );

    try {
        const opportunitiesList = await deps.si.api.opportunities.updateOpportunityListOld(
            workspaceId,
            listId,
            dto,
        );

        dispatch(
            actionCreators.updateOpportunityListAsync.success({
                // FIXME: Fix when BE is ready
                ...listFromStore,
                ...opportunitiesList,
            }),
        );
    } catch (e) {
        dispatch(actionCreators.updateOpportunityListAsync.failure(e));
    }
};

export const updateOpportunityListSettingsThunk = (
    list: OpportunityListType,
    dto: OpportunityListSettings,
) => async (dispatch: ThunkDispatchCommon, getState: ThunkGetState, deps: ThunkDependencies) => {
    dispatch(actionCreators.updateOpportunityListSettingsAsync.request());

    const workspaceId = selectLegacyWorkspaceId(getState()) as string;

    try {
        await deps.si.api.opportunities.updateOpportunityListSettings(
            workspaceId,
            list.opportunityListId,
            dto,
        );

        dispatch(
            actionCreators.updateOpportunityListSettingsAsync.success({
                id: list.opportunityListId,
                settings: dto,
            }),
        );
        // TODO: These two should be moved away from here
        dispatch(
            fetchSignalsForCountryThunkAction(workspaceId, list.opportunityListId, list.country),
        );
        dispatch(
            fetchSignalsForAllOrInverseThunkAction(
                workspaceId,
                list.opportunityListId,
                list.country,
            ),
        );
    } catch (e) {
        dispatch(actionCreators.updateOpportunityListSettingsAsync.failure(e));
    }
};

export const updateListOpportunitiesThunk = (
    list: OpportunityListType,
    dto: AddOpportunitiesToListDto,
) => async (dispatch: ThunkDispatchCommon, getState: ThunkGetState, deps: ThunkDependencies) => {
    dispatch(actionCreators.updateListOpportunitiesAsync.request());

    const workspaceId = selectLegacyWorkspaceId(getState()) || selectActiveWorkspaceId(getState());

    try {
        const response = await deps.si.api.opportunities.addOpportunitiesToList(
            workspaceId,
            list.opportunityListId,
            dto,
        );

        dispatch(
            actionCreators.updateListOpportunitiesAsync.success({
                ...response,
                // FIXME: Remove this mapping. Ask BE to adjust response model
                opportunities: response.opportunities.map((opportunity) => {
                    return {
                        Domain: opportunity.domain,
                        OpportunityId: opportunity.opportunityId,
                    } as OpportunityType;
                }),
            }),
        );

        // Update saved search object with new "usedResultCount"
        if (typeof response.query !== "undefined") {
            dispatch(
                updateSearchUsedResultCount({
                    searchQueryId: getSearchId(response.query),
                    count: getSearchUsedResultCount(response.query),
                }),
            );
        }

        return response;
    } catch (e) {
        dispatch(actionCreators.updateListOpportunitiesAsync.failure(e));
    }
};

export const updateListOpportunitiesAndReFetchThunk = (
    list: OpportunityListType,
    dto: AddOpportunitiesToListDto,
) => async (dispatch: ThunkDispatchCommon, getState: ThunkGetState) => {
    const workspaceId = selectLegacyWorkspaceId(getState()) as string;

    await dispatch(updateListOpportunitiesThunk(list, dto));

    // FIXME: Better to move these calls to a component, which should react to updateListOpportunitiesAsync.success action
    dispatch(fetchOpportunityListTableDataThunk(list.opportunityListId));
    dispatch(fetchSignalsForCountryThunkAction(workspaceId, list.opportunityListId, list.country));
    dispatch(
        fetchSignalsForAllOrInverseThunkAction(workspaceId, list.opportunityListId, list.country),
    );
};

export const updateListOpportunitiesFromSearchThunk = (
    list: OpportunityListType,
    dto: AddOpportunitiesToListDto,
) => async (dispatch: ThunkDispatchCommon) => {
    const { opportunities } = await dispatch(updateListOpportunitiesThunk(list, dto));
    // Copied from old code
    const translate = i18nFilter();
    const toastTextKey =
        opportunities.length > 1
            ? "si.pages.search_result.add_leads_to_list.success.plural"
            : "si.pages.search_result.add_leads_to_list.success";

    dispatch(
        showSuccessToast(
            getToastItemComponent({
                text: translate(toastTextKey),
                linkText: translate("workspace.add_opportunities.success.see_list"),
                onClick: () => {
                    Injector.get("swNavigator").go(STATIC_LIST_PAGE_ROUTE, {
                        id: list.opportunityListId,
                    });
                },
            }),
        ),
    );
};

export const deleteOpportunityListThunk = (
    listId: OpportunityListType["opportunityListId"],
) => async (dispatch: ThunkDispatchCommon, getState: ThunkGetState, deps: ThunkDependencies) => {
    dispatch(actionCreators.deleteOpportunityListAsync.request());

    const workspaceId = selectLegacyWorkspaceId(getState()) as string;

    try {
        await deps.si.api.opportunities.deleteOpportunityList(workspaceId, listId);

        dispatch(removeListIdFromSignalsUseThunkAction(listId));
        dispatch(actionCreators.deleteOpportunityListAsync.success(listId));
    } catch (e) {
        dispatch(actionCreators.deleteOpportunityListAsync.failure(e));
    }
};

// TODO: Refactor
export const changeListCountryThunk = (list: OpportunityListType, country: number) => async (
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
) => {
    const workspaceId = selectLegacyWorkspaceId(getState()) as string;

    await dispatch(
        updateOpportunityListThunk(list.opportunityListId, {
            friendlyName: list.friendlyName,
            country,
        }),
    );
    dispatch(fetchSignalsForCountryThunkAction(workspaceId, list.opportunityListId, country));
    dispatch(fetchOpportunityListTableDataThunk(list.opportunityListId));
};

export const fetchWebsitesByTermThunk = (term: string, limit = 10) => async (
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
    deps: ThunkDependencies,
) => {
    dispatch(actionCreators.searchForWebsites.request());

    try {
        const results = await deps.si.api.fetchWebsitesByName(term, limit);

        dispatch(actionCreators.searchForWebsites.success(results));
    } catch (e) {
        dispatch(actionCreators.searchForWebsites.failure(e));
    }
};

export const removeOpportunitiesFromTheListThunk = (
    list: OpportunityListType,
    opportunities: string[],
) => async (dispatch: ThunkDispatchCommon, getState: ThunkGetState, deps: ThunkDependencies) => {
    dispatch(actionCreators.removeOpportunitiesFromList.request());

    const workspaceId = selectLegacyWorkspaceId(getState());

    try {
        await deps.si.api.opportunities.removeOpportunitiesFromList(
            workspaceId,
            list.opportunityListId,
            opportunities,
        );

        // FIXME: Move this call to a component
        dispatch(
            fetchSignalsForAllOrInverseThunkAction(
                workspaceId,
                list.opportunityListId,
                list.country,
            ),
        );

        return dispatch(actionCreators.removeOpportunitiesFromList.success(opportunities));
    } catch (e) {
        dispatch(actionCreators.removeOpportunitiesFromList.failure(e));
    }
};

const feFetchThunk = (
    listId: string,
    action: any,
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
) => {
    const { TotalCount } = selectOpportunityListTable(getState());
    const tableFilters = selectOpportunityListTableFilters(getState());

    if (action.type === getType(actionCreators.removeOpportunitiesFromList.success)) {
        const expectedNumberOfPages = Math.ceil(TotalCount / tableFilters.pageSize);

        // Do nothing if all websites were removed
        if (TotalCount === 0) {
            return dispatch(actionCreators.setListTableLoadingAction(false));
        }

        if (tableFilters.page > expectedNumberOfPages) {
            // Set the correct page number
            const newPage = expectedNumberOfPages || 1;

            dispatch(setListTableFiltersAction({ ...tableFilters, page: newPage }));
        } else {
            // Re-fetch data with current table filters
            dispatch(fetchOpportunityListTableDataThunk(listId));
        }
    }
};

export const removeOpportunitiesFromTheListAndReFetchThunk = (
    list: OpportunityListType,
    opportunities: string[],
) => async (dispatch: ThunkDispatchCommon, getState: ThunkGetState) => {
    const action = await dispatch(removeOpportunitiesFromTheListThunk(list, opportunities));
    feFetchThunk(list.opportunityListId, action, dispatch, getState);
};
// TODO helper
const getListTableData = async (
    params: ListTableDataRequestParams,
    deps: ThunkDependencies,
): Promise<string[]> => {
    const { Data } = await deps.si.api.opportunities.fetchOpportunityListTableData(params);
    return Data.map(({ site }) => site);
};

export const removeOpportunitiesFromTheListAndReFetchWithTopThunk = (
    list: OpportunityListType,
    opportunities: number | string[],
) => async (dispatch: ThunkDispatchCommon, getState: ThunkGetState, deps: ThunkDependencies) => {
    dispatch(actionCreators.removeOpportunitiesFromList.request());

    let updatedOpportunities = opportunities;

    if (!Array.isArray(opportunities)) {
        const state = getState();
        const requestParams = getParamsForListTable(list.opportunityListId, state, deps);

        try {
            updatedOpportunities = await getListTableData(
                { ...requestParams, pageSize: opportunities },
                deps,
            );
        } catch (e) {
            dispatch(actionCreators.removeOpportunitiesFromList.failure(e));
            return;
        }
    }

    const action = await dispatch(
        removeOpportunitiesFromTheListThunk(list, updatedOpportunities as string[]),
    );

    feFetchThunk(list.opportunityListId, action, dispatch, getState);
};

export const downloadListTableExcelThunk = (
    listId: OpportunityListType["opportunityListId"],
    domains: number | string[],
    orderBy: string,
) => async (dispatch: ThunkDispatchCommon, getState: ThunkGetState, deps: ThunkDependencies) => {
    dispatch(actionCreators.downloadListTableExcelAsync.request());
    const lastSnapshotDate = deps.si.settingsHelper.getLastSnapshotDate();
    let result;

    if (Array.isArray(domains)) {
        result = await deps.si.api.opportunities.downloadSelectedListTableExcel({
            opportunitiesListId: listId,
            workspaceId: selectLegacyWorkspaceId(getState()),
            date: dateTimeService.formatWithMoment(lastSnapshotDate, "YYYY-MM"),
            body: domains,
        });
    } else {
        result = await deps.si.api.opportunities.downloadTopListTableExcel({
            opportunitiesListId: listId,
            workspaceId: selectLegacyWorkspaceId(getState()),
            date: dateTimeService.formatWithMoment(lastSnapshotDate, "YYYY-MM"),
            top: domains,
            orderBy,
        });
    }

    if (result.success) {
        dispatch(actionCreators.downloadListTableExcelAsync.success());
        await dispatch(fetchExcelQuotaThunk());
    } else {
        dispatch(actionCreators.downloadListTableExcelAsync.failure(result.error));
    }
};

export const fetchListRecommendationsThunk = (
    listId: OpportunityListType["opportunityListId"],
) => async (dispatch: ThunkDispatchCommon, getState: ThunkGetState, deps: ThunkDependencies) => {
    dispatch(actionCreators.fetchListRecommendationsAsync.request());

    const params: ListRecommendationsRequestParams = {
        numberOfResults: 20,
        opportunityListId: listId,
        workspaceId: selectLegacyWorkspaceId(getState()),
        date: dateTimeService.formatWithMoment(
            deps.si.settingsHelper.getLastSnapshotDate(),
            "YYYY-MM",
        ),
    };

    try {
        const recommendations = await deps.si.api.opportunities.fetchListRecommendations(params);

        dispatch(actionCreators.fetchListRecommendationsAsync.success(recommendations));
    } catch (e) {
        dispatch(actionCreators.fetchListRecommendationsAsync.failure(e));
    }
};

export const dismissRecommendationThunk = (
    listId: OpportunityListType["opportunityListId"],
    domain: string,
) => async (dispatch: ThunkDispatchCommon, getState: ThunkGetState, deps: ThunkDependencies) => {
    dispatch(actionCreators.dismissRecommendationAsync.request(domain));

    const workspaceId = selectLegacyWorkspaceId(getState());

    try {
        await deps.si.api.opportunities.dismissRecommendation(workspaceId, listId, domain);

        dispatch(actionCreators.dismissRecommendationAsync.success(domain));
    } catch (e) {
        dispatch(actionCreators.dismissRecommendationAsync.failure(e));
    }
};

export const addRecommendationsToListThunk = (
    list: OpportunityListType,
    domains: string[],
) => async (dispatch: ThunkDispatchCommon, getState: ThunkGetState) => {
    dispatch(actionCreators.removeRecommendedDomains(domains));

    const workspaceId = selectLegacyWorkspaceId(getState());
    const response = await dispatch(updateListOpportunitiesThunk(list, { opportunities: domains }));

    if (typeof response.opportunityListId !== "undefined") {
        // Reloading table data to include added domains
        dispatch(fetchOpportunityListTableDataThunk(list.opportunityListId));

        // Reloading signals dropdown to include new data
        dispatch(
            fetchSignalsForCountryThunkAction(workspaceId, list.opportunityListId, list.country),
        );
        dispatch(
            fetchSignalsForAllOrInverseThunkAction(
                workspaceId,
                list.opportunityListId,
                list.country,
            ),
        );

        // Copied from old code
        const translate = i18nFilter();
        const toastTextKey =
            response.opportunities.length > 1
                ? "si.pages.search_result.add_leads_to_list.success.plural"
                : "si.pages.search_result.add_leads_to_list.success";

        dispatch(showSuccessToast(translate(toastTextKey)));
    }
};
