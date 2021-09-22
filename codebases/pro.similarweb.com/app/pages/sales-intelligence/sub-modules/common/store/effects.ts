import { ThunkDispatchCommon, ThunkGetState } from "single-spa/store/types";
import SalesWorkspaceApiService from "services/workspaces/salesWorkspaceApiService";
import { OpportunityListType } from "../../opportunities/types";
import { SavedSearchType } from "../../saved-searches/types";
import { fetchSavedSearchesAsync } from "../../saved-searches/store/action-creators";
import { fetchOpportunityListsAsync } from "../../opportunities/store/action-creators";
import * as actionCreators from "./action-creators";
import { legacyTransformTechnologiesFilters } from "../../saved-searches/helpers";
import { ThunkDependencies } from "store/thunk-dependencies";
import { TypeOfSelectors } from "pages/sales-intelligence/common-components/MultiSelector/types";
import { toggleMultiSelectorPanel } from "./action-creators";
import { toggleRightBar } from "pages/workspace/sales/sub-modules/common/store/action-creators";
import { selectActiveSelectorPanel } from "./selectors";
import { getActionSetDefaultItemConfig } from "pages/sales-intelligence/helpers/multiSelectorPanel/helpers";

// This is legacy workspaces fetch that includes opportunity lists and saved searches.
// Should be removed asap and split on API side
export const fetchWorkspacesThunk = () => async (dispatch: ThunkDispatchCommon) => {
    dispatch(actionCreators.fetchLegacyWorkspaces.request());

    const api = new SalesWorkspaceApiService();

    try {
        const workspaces = await api.getWorkspaces();
        const [first] = workspaces;

        if (typeof first === "undefined") {
            throw Error("Empty workspace was not handled");
        }

        dispatch(actionCreators.setWorkspaceId(first.workspaceId));
        dispatch(
            fetchOpportunityListsAsync.success(
                (first.opportunityLists as unknown) as OpportunityListType[],
            ),
        );
        dispatch(
            fetchSavedSearchesAsync.success(
                ((first.savedSearches as unknown) as SavedSearchType[]).map(
                    legacyTransformTechnologiesFilters,
                ),
            ),
        );
        dispatch(actionCreators.fetchLegacyWorkspaces.success());
    } catch (e) {
        dispatch(fetchOpportunityListsAsync.failure(e));
        dispatch(fetchSavedSearchesAsync.failure(e));
        dispatch(actionCreators.fetchLegacyWorkspaces.failure(e));
    }
};

export const fetchSimilarWebsitesThunk = (domain: string, size?: number) => async (
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
    deps: ThunkDependencies,
) => {
    dispatch(actionCreators.fetchSimilarWebsitesAsync.request());

    try {
        const similarWebsites = await deps.si.api.fetchSimilarWebsites(domain, size);

        dispatch(
            actionCreators.fetchSimilarWebsitesAsync.success({
                domain,
                similarWebsites,
            }),
        );
    } catch (e) {
        dispatch(actionCreators.fetchSimilarWebsitesAsync.failure(e));
    }
};

export const fetchWebsiteInfoThunk = (domain: string) => async (
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
    deps: ThunkDependencies,
) => {
    dispatch(actionCreators.fetchWebsitesInfoAsync.request());

    try {
        const { [domain]: info = {} } = await deps.si.api.fetchWebsiteInfo(domain);

        dispatch(
            actionCreators.fetchWebsitesInfoAsync.success({
                info,
                domain,
            }),
        );
    } catch (e) {
        dispatch(actionCreators.fetchWebsitesInfoAsync.failure(e));
    }
};

export const fetchExcelQuotaThunk = () => async (
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
    deps: ThunkDependencies,
) => {
    dispatch(actionCreators.fetchExcelQuota.request());

    try {
        const excelQuota = await deps.si.api.fetchExcelQuota();

        dispatch(actionCreators.fetchExcelQuota.success(excelQuota));
    } catch (e) {
        dispatch(actionCreators.fetchExcelQuota.failure(e));
    }
};

export const toggleMultiSelectorPanelThunk = (panel: TypeOfSelectors | null) => (
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
) => {
    const {
        salesWorkspace: { common },
    } = getState();

    if (common.isRightBarOpen) {
        dispatch(toggleRightBar(false));
    }

    dispatch(toggleMultiSelectorPanel(panel));
};

export const setMultiSelectorPanelByDefaultThunk = () => (
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
) => {
    const currentStateSelectedPanel = selectActiveSelectorPanel(getState());

    if (currentStateSelectedPanel) {
        dispatch(getActionSetDefaultItemConfig(currentStateSelectedPanel)());
        dispatch(toggleMultiSelectorPanel(null));
    }
};
