import { createReducer } from "typesafe-actions";
import * as ac from "./action-creators";
import { Feed } from "../types/feed";
import { UseStatisticsMapByListId } from "../../usage-statistics/types";
import { updateUseStatisticsByList } from "../../usage-statistics/helpers";
import { FeedActions } from "../types/feed";
import { TTopCountries } from "../types/topCountries";
import { TechnologiesData } from "../types/technologies";
import { TAdNetworksAbout } from "../types/adNetwork";
import { TSiteInfo } from "../types/siteInfo";

export type FeedState = {
    feeds: Feed[];
    topCountries: TTopCountries;
    fetchingFeeds: boolean;
    fetchingFeedsError?: string;
    adNetworks: TAdNetworksAbout;
    adNetworksUseStatistics: UseStatisticsMapByListId;
    siteInfo: TSiteInfo;
    technologies: {
        data: TechnologiesData;
        technologiesError: string;
        isLoading: boolean;
        selectedTechnology: string | null;
    };
};

export const INITIAL_FEED_STATE: FeedState = {
    feeds: [],
    fetchingFeeds: false,
    adNetworksUseStatistics: {},
    topCountries: {
        topCountriesByGrowth: [],
        topCountriesByShare: [],
    },
    adNetworks: {
        topAdNetworks: [],
        newAdNetworks: [],
    },
    siteInfo: {
        category: "",
        description: "",
        functionality: "",
        monthlyVisits: 0,
        rank: 0,
        visitsMoM: 0,
        visitsYoY: 0,
        favIcon: "",
    },
    technologies: {
        data: {
            technographics: [],
            subdomains: [],
        },
        technologiesError: "",
        isLoading: false,
        selectedTechnology: null,
    },
};

const feedReducer = createReducer<FeedState, FeedActions>(INITIAL_FEED_STATE)
    .handleAction(ac.fetchFeedsAsyncAction.request, (state) => ({
        ...state,
        fetchingFeeds: true,
        fetchingFeedsError: INITIAL_FEED_STATE.fetchingFeedsError,
    }))
    .handleAction(ac.fetchFeedsAsyncAction.success, (state, { payload }) => ({
        ...state,
        feeds: payload,
        fetchingFeeds: false,
    }))
    .handleAction(ac.fetchFeedsAsyncAction.failure, (state, { payload }) => ({
        ...state,
        fetchingFeeds: false,
        fetchingFeedsError: payload,
    }))
    .handleAction(ac.getAdNetworksUseStatisticsAsyncAction.success, (state, { payload }) => ({
        ...state,
        adNetworksUseStatistics: payload,
    }))
    .handleAction(ac.updateAdNetworksUseStatisticsAction, (state, { payload }) => ({
        ...state,
        adNetworksUseStatistics: updateUseStatisticsByList(state.adNetworksUseStatistics, payload),
    }))
    .handleAction(ac.fetchTopCountrysAsyncAction.request, (state) => ({
        ...state,
        topCountries: INITIAL_FEED_STATE.topCountries,
    }))
    .handleAction(ac.fetchAdNetworksAsyncAction.request, (state) => ({
        ...state,
        adNetworks: INITIAL_FEED_STATE.adNetworks,
    }))
    .handleAction(ac.fetchSiteInfoAsyncAction.request, (state) => ({
        ...state,
        siteInfo: INITIAL_FEED_STATE.siteInfo,
    }))
    .handleAction(ac.fetchTopCountrysAsyncAction.success, (state, { payload }) => ({
        ...state,
        topCountries: payload,
    }))
    .handleAction(ac.fetchAdNetworksAsyncAction.success, (state, { payload }) => ({
        ...state,
        adNetworks: payload,
    }))
    .handleAction(ac.fetchSiteInfoAsyncAction.success, (state, { payload }) => ({
        ...state,
        siteInfo: payload,
    }))
    .handleAction(ac.fetchTechnologies.request, (state) => ({
        ...state,
        technologies: { ...state.technologies, isLoading: true },
    }))
    .handleAction(ac.fetchTechnologies.success, (state, { payload }) => ({
        ...state,
        technologies: { ...state.technologies, data: payload, isLoading: false },
    }))
    .handleAction(ac.fetchTechnologies.failure, (state, { payload }) => ({
        ...state,
        technologies: { ...state.technologies, isLoading: false, technologiesError: payload },
    }))
    .handleAction(ac.setTechnologiesCategory, (state, { payload }) => ({
        ...state,
        technologies: { ...state.technologies, selectedTechnology: payload },
    }))
    .handleAction(ac.clearTechnologies, (state) => ({
        ...state,
        technologies: { ...INITIAL_FEED_STATE.technologies },
    }));

export default feedReducer;
