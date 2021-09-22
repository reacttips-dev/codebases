import { ThunkDependencies } from "single-spa/store/thunk-dependencies";
import { ThunkDispatchCommon, ThunkGetState } from "single-spa/store/types";
import * as ac from "./action-creators";
import {
    createGetStatisticsEffect,
    createSyncStatisticsEffect,
} from "../../usage-statistics/store/effects";
import { selectAdNetworksUseStatistics } from "./selectors";
import { AD_NETWORKS_MOST_USED_STORE_KEY } from "../constants";
import {
    COMMON_WORKSPACES_SET_FEED_DATA,
    COMMON_WORKSPACES_SET_FEED_ITEMS_SEEN,
} from "pages/workspace/common/action_types/COPY_actionTypes";
import { setItemsFeedSeenListTable } from "pages/sales-intelligence/sub-modules/opportunities/store/action-creators";
import { selectOpportunityListId } from "pages/sales-intelligence/sub-modules/opportunities/store/selectors";

export const getAdNetworksUseThunkAction = createGetStatisticsEffect(
    AD_NETWORKS_MOST_USED_STORE_KEY,
    ac.getAdNetworksUseStatisticsAsyncAction,
);

export const syncSignalsUseThunkAction = createSyncStatisticsEffect(
    AD_NETWORKS_MOST_USED_STORE_KEY,
    selectAdNetworksUseStatistics,
);

export const fetchFeedsThunkAction = (
    domain: string,
    workspaceId?: string,
    opportunityListId?: string,
) => async (dispatch: ThunkDispatchCommon, getState: ThunkGetState, deps: ThunkDependencies) => {
    dispatch(ac.fetchFeedsAsyncAction.request());

    const salesIntelligenceListId = selectOpportunityListId(getState());
    const id = opportunityListId || salesIntelligenceListId;

    try {
        const feeds = await deps.si.api.feed.fetchWebsiteFeed({ domain });
        dispatch(ac.fetchFeedsAsyncAction.success(feeds));

        // FIXME: Copied from "common_workspace_action_creators.ts" for compatibility. Will be fixed in further migration.
        dispatch({
            type: COMMON_WORKSPACES_SET_FEED_DATA,
            data: feeds,
        });

        if (feeds && id) {
            const seenItems = feeds.filter((item) => !item?.lastSeenDate).map((item) => item?.id);

            if (seenItems.length > 0) {
                await deps.si.api.feed.setFeedItemsSeen({
                    domain,
                    workspaceId,
                    opportunityListId: id,
                    feedItemsIds: seenItems,
                });
                // sales 2.0
                dispatch(setItemsFeedSeenListTable(domain));

                dispatch({
                    type: COMMON_WORKSPACES_SET_FEED_ITEMS_SEEN,
                    domain,
                    seenItems,
                });
            }
        }
    } catch (e) {
        dispatch(ac.fetchFeedsAsyncAction.failure(e));
    }
};

export const fetchTopCountrysThunkAction = (domain: string) => async (
    dispatch: ThunkDispatchCommon,
    _: ThunkGetState,
    deps: ThunkDependencies,
) => {
    dispatch(ac.fetchTopCountrysAsyncAction.request());
    try {
        const topCountries = await deps.si.api.feed.fetchTopCountries(domain);
        dispatch(ac.fetchTopCountrysAsyncAction.success(topCountries));
    } catch (error) {
        dispatch(ac.fetchTopCountrysAsyncAction.failure(error));
    }
};
export const fetchAdNetworksThunkAction = (domain: string, country: string | number) => async (
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
    deps: ThunkDependencies,
) => {
    dispatch(ac.fetchAdNetworksAsyncAction.request());
    try {
        const networks = await deps.si.api.feed.fetchAdNetworks(domain, country);
        dispatch(ac.fetchAdNetworksAsyncAction.success(networks));
    } catch (error) {
        dispatch(ac.fetchAdNetworksAsyncAction.failure(error));
    }
};
export const fetchSiteInfoThunkAction = (domain: string, country: number) => async (
    dispatch: ThunkDispatchCommon,
    _: ThunkGetState,
    deps: ThunkDependencies,
) => {
    dispatch(ac.fetchSiteInfoAsyncAction.request());
    try {
        const siteInfo = await deps.si.api.feed.fetchSiteInfo(domain, country);
        dispatch(ac.fetchSiteInfoAsyncAction.success(siteInfo));
    } catch (error) {
        dispatch(ac.fetchSiteInfoAsyncAction.failure(error));
    }
};

export const fetchTechnologies = (domain: string) => async (
    dispatch: ThunkDispatchCommon,
    _: ThunkGetState,
    deps: ThunkDependencies,
) => {
    dispatch(ac.fetchTechnologies.request(domain));
    try {
        const technologiesData = await deps.si.api.feed.fetchTechnologies(domain);
        dispatch(ac.fetchTechnologies.success(technologiesData));
    } catch (error) {
        dispatch(ac.fetchTechnologies.failure(error));
    }
};
