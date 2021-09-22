import { RootState } from "single-spa/store/types";
import { SalesWorkspaceState } from "./reducer";
import { createStatePropertySelector } from "../helpers";
import { INRoutingState } from "reducers/_reducers/routingReducer";
import { createSelector } from "reselect";

/**
 * Helper selector function for SalesWorkspaceState slice
 * @param state - the root redux state object
 */
const selectSalesWorkspaceStateSlice = (state: RootState): SalesWorkspaceState =>
    state.salesWorkspace;

const select = createStatePropertySelector(selectSalesWorkspaceStateSlice);

export const selectFeedSlice = select("feed");
export const selectSignalsSlice = select("signals");
export const selectOpportunitiesSlice = select("opportunities");
export const selectBenchmarksSlice = select("benchmarks");
export const selectCommonSlice = select("common");
export const selectSiteTrendsSlice = select("siteTrends");

// TODO: Improve when migrating this part of the store
export const selectWorkspaceId = (state: RootState): string =>
    state.legacySalesWorkspace.activeWorkspaceId;

/**
 * Helper selector function for Routing slice
 * @param state - the root redux state object
 */
const selectRoutingStateSlice = (state: RootState): INRoutingState => state.routing;
const selectRouting = createStatePropertySelector(selectRoutingStateSlice);

export const selectRouterCurrentModule = selectRouting("currentModule");

const selectLegacySalesWorkspaceStateSlice = (state: RootState) => state.legacySalesWorkspace;

const selectLegacySalesWorkspace = createStatePropertySelector(
    selectLegacySalesWorkspaceStateSlice,
);

export const selectWorkspaces = selectLegacySalesWorkspace("workspaces");
export const selectActiveListId = selectLegacySalesWorkspace("activeListId");
export const selectActiveWorkspaceId = selectLegacySalesWorkspace("activeWorkspaceId");

export const selectedCountryByOpportunityList = createSelector(
    selectWorkspaces,
    selectActiveListId,
    selectActiveWorkspaceId,
    (workspaces, listId, activeWorkspaceId) => {
        const activeWorkspace = workspaces.find(
            ({ workspaceId }) => workspaceId === activeWorkspaceId,
        );

        const opportunity = activeWorkspace?.opportunityLists.find(
            ({ opportunityListId }) => opportunityListId === listId,
        );

        return opportunity?.country || -1;
    },
);

export const selectOpportunities = createStatePropertySelector(selectOpportunitiesSlice);

export const selectIsSimilarWebsitesLoading = selectOpportunities("similarWebsitesLoading");
export const selectSelectedWebsite = selectOpportunities("selectedWebsite");

export const selectLegacyOpportunityLists = createSelector(selectWorkspaces, (salesWorkspaces) => {
    if (salesWorkspaces.length) {
        return salesWorkspaces[0].opportunityLists;
    }
    return [];
});
