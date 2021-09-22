import { ActionType, createReducer } from "typesafe-actions";
import * as ac from "./action-creators";
import { CountrySharesByCountryId } from "../types/common";
import { TopicType } from "../types/topics";
import { BenchmarksSettingsType } from "../types/settings";
import { BenchmarkResultType, BenchmarksQuotaType } from "../types/benchmarks";
import { SimilarSiteType } from "pages/sales-intelligence/sub-modules/right-sidebar/types/similar-sites";
import { areBenchmarkResultsMatching, replaceCompetitor } from "../helpers";
import { BenchmarksMode } from "../constants";
import {
    removeSimilarSiteRemovedProperty,
    wasNotAdded,
} from "pages/sales-intelligence/sub-modules/right-sidebar/helpers/similar-sites";

export type BenchmarksState = {
    // Benchmarks
    benchmarks: BenchmarkResultType[];
    benchmarksFetching: boolean;
    benchmarksFetchError?: string;
    // Top benchmark
    topBenchmark: BenchmarkResultType | null;
    topBenchmarkFetching: boolean;
    // Single benchmark
    benchmarkIdUpdating: string | null;
    benchmarkIdSending: string | null;
    // Settings
    settings: BenchmarksSettingsType;
    settingsFetching: boolean;
    settingsUpdating: boolean;
    settingsFetchError?: string;
    // Topics
    topics: TopicType[];
    topicsFetching: boolean;
    topicsFetchError?: string;
    // Country shares
    countryShares: CountrySharesByCountryId;
    countrySharesFetching: boolean;
    countrySharesError?: string;
    // Competitors
    competitors: SimilarSiteType[];
    competitorsFetching: boolean;
    competitorsUpdating: boolean;
    competitorsError?: string;
    // Mode
    selectedMode: BenchmarksMode;
    // Categories
    categories: string[];
    selectedCategory: string;
    // Quota
    quota: BenchmarksQuotaType | null;
    quotaFetching: boolean;
    domainToken: string;
};

export const INITIAL_BENCHMARKS_STATE: BenchmarksState = {
    benchmarks: [],
    topBenchmark: null,
    topBenchmarkFetching: false,
    benchmarksFetching: false,
    benchmarkIdUpdating: null,
    benchmarkIdSending: null,
    settings: { countries: [] },
    settingsFetching: false,
    settingsUpdating: false,
    topics: [],
    topicsFetching: false,
    countryShares: {},
    countrySharesFetching: false,
    competitorsFetching: false,
    competitorsUpdating: false,
    competitors: [],
    selectedMode: BenchmarksMode.TopCountry,
    categories: [],
    selectedCategory: "",
    quota: null,
    quotaFetching: false,
    domainToken: "",
};

const benchmarksReducer = createReducer<BenchmarksState, ActionType<typeof ac>>(
    INITIAL_BENCHMARKS_STATE,
)
    .handleAction(ac.fetchTopicsAsyncAction.request, (state) => ({
        ...state,
        topicsFetching: true,
        topicsFetchError: INITIAL_BENCHMARKS_STATE.topicsFetchError,
    }))
    .handleAction(ac.fetchTopicsAsyncAction.success, (state, { payload }) => ({
        ...state,
        topicsFetching: false,
        topics: payload,
    }))
    .handleAction(ac.fetchTopicsAsyncAction.failure, (state, { payload }) => ({
        ...state,
        topicsFetching: false,
        topicsFetchError: payload,
    }))
    .handleAction(ac.fetchSettingsAsyncAction.request, (state) => ({
        ...state,
        settingsFetching: true,
        settingsFetchError: INITIAL_BENCHMARKS_STATE.settingsFetchError,
    }))
    .handleAction(ac.fetchSettingsAsyncAction.success, (state, { payload }) => ({
        ...state,
        settingsFetching: false,
        settings: payload,
    }))
    .handleAction(ac.fetchSettingsAsyncAction.failure, (state, { payload }) => ({
        ...state,
        settingsFetching: false,
        settingsFetchError: payload,
    }))
    .handleAction(ac.updateSettingsAsyncAction.request, (state) => ({
        ...state,
        settingsUpdating: true,
        settingsFetchError: INITIAL_BENCHMARKS_STATE.settingsFetchError,
    }))
    .handleAction(ac.updateSettingsAsyncAction.success, (state, { payload }) => ({
        ...state,
        settingsUpdating: false,
        settings: payload,
    }))
    .handleAction(ac.updateSettingsAsyncAction.failure, (state, { payload }) => ({
        ...state,
        settingsUpdating: false,
        settingsFetchError: payload,
    }))
    .handleAction(ac.fetchBenchmarksAsyncAction.request, (state) => ({
        ...state,
        benchmarks: [],
        benchmarksFetching: true,
        benchmarksFetchError: INITIAL_BENCHMARKS_STATE.benchmarksFetchError,
    }))
    .handleAction(ac.fetchBenchmarksAsyncAction.success, (state, { payload }) => ({
        ...state,
        benchmarksFetching: false,
        benchmarks: payload,
    }))
    .handleAction(ac.fetchBenchmarksAsyncAction.failure, (state, { payload }) => ({
        ...state,
        benchmarksFetching: false,
        benchmarksFetchError: payload,
    }))
    .handleAction(ac.fetchSingleBenchmarkAsyncAction.request, (state, { payload }) => ({
        ...state,
        benchmarkIdUpdating: payload,
    }))
    .handleAction(ac.fetchSingleBenchmarkAsyncAction.success, (state, { payload }) => ({
        ...state,
        benchmarks: state.benchmarks.map((b) => {
            if (areBenchmarkResultsMatching(b, payload)) {
                return payload;
            }

            return b;
        }),
        benchmarkIdUpdating: INITIAL_BENCHMARKS_STATE.benchmarkIdUpdating,
    }))
    .handleAction(ac.fetchSingleBenchmarkAsyncAction.failure, (state) => ({
        ...state,
        benchmarkIdUpdating: INITIAL_BENCHMARKS_STATE.benchmarkIdUpdating,
    }))
    .handleAction(ac.fetchCountrySharesAsyncAction.request, (state) => ({
        ...state,
        countrySharesFetching: true,
        countrySharesError: INITIAL_BENCHMARKS_STATE.countrySharesError,
    }))
    .handleAction(ac.fetchCountrySharesAsyncAction.success, (state, { payload }) => ({
        ...state,
        countrySharesFetching: false,
        countryShares: payload,
    }))
    .handleAction(ac.fetchCountrySharesAsyncAction.failure, (state, { payload }) => ({
        ...state,
        countrySharesFetching: false,
        countrySharesError: payload,
    }))
    .handleAction(ac.addCompetitorAction, (state, { payload }) => ({
        ...state,
        competitors: [payload, ...state.competitors],
    }))
    .handleAction(ac.removeCompetitorAction, (state, { payload }) => ({
        ...state,
        competitors: state.competitors.map((c) => {
            if (c.domain !== payload) {
                return c;
            }

            return {
                ...c,
                removed: true,
            };
        }),
    }))
    .handleAction(ac.undoUnsavedChangesAction, (state) => ({
        ...state,
        competitors: state.competitors.filter(wasNotAdded).map(removeSimilarSiteRemovedProperty),
    }))
    .handleAction(ac.fetchCompetitorsAsyncAction.request, (state) => ({
        ...state,
        competitorsFetching: true,
        competitorsError: INITIAL_BENCHMARKS_STATE.competitorsError,
    }))
    .handleAction(ac.fetchCompetitorsAsyncAction.success, (state, { payload }) => ({
        ...state,
        competitorsFetching: false,
        competitors: payload,
    }))
    .handleAction(ac.fetchCompetitorsAsyncAction.failure, (state, { payload }) => ({
        ...state,
        competitorsFetching: false,
        competitorsError: payload,
    }))
    .handleAction(ac.updateCompetitorAsyncAction.request, (state) => ({
        ...state,
        competitorsUpdating: true,
        competitorsError: INITIAL_BENCHMARKS_STATE.competitorsError,
    }))
    .handleAction(ac.updateCompetitorAsyncAction.success, (state, { payload }) => ({
        ...state,
        competitorsUpdating: false,
        competitors: payload,
    }))
    .handleAction(ac.updateCompetitorAsyncAction.failure, (state, { payload }) => ({
        ...state,
        competitorsUpdating: false,
        competitorsError: payload,
    }))
    .handleAction(ac.updateCompetitorInABenchmarkAction, (state, { payload }) => ({
        ...state,
        benchmarks: state.benchmarks.map((b) => {
            const { info, newCompetitor } = payload;

            if (areBenchmarkResultsMatching(b, info.benchmarkResult)) {
                return {
                    ...b,
                    competitors: replaceCompetitor(
                        { ...newCompetitor, isUserDefined: true },
                        info.prevDomain,
                    )(b.competitors),
                } as BenchmarkResultType;
            }

            return b;
        }),
    }))
    .handleAction(ac.removeCompetitorInABenchmarkAction, (state, { payload }) => ({
        ...state,
        benchmarks: state.benchmarks.map((b) => {
            const { domain, benchmarkResult } = payload;

            if (areBenchmarkResultsMatching(b, benchmarkResult)) {
                return {
                    ...b,
                    competitors: b.competitors.filter((c) => c.domain !== domain),
                } as BenchmarkResultType;
            }

            return b;
        }),
    }))
    .handleAction(ac.addCompetitorInABenchmarkAction, (state, { payload }) => ({
        ...state,
        benchmarks: state.benchmarks.map((b) => {
            const { newCompetitor, benchmarkResult } = payload;

            if (areBenchmarkResultsMatching(b, benchmarkResult)) {
                return {
                    ...b,
                    competitors: [
                        ...b.competitors,
                        {
                            ...newCompetitor,
                            value: 0,
                            isUserDefined: true,
                        },
                    ],
                } as BenchmarkResultType;
            }

            return b;
        }),
    }))
    .handleAction(ac.sendBenchmarkEmailAsyncAction.request, (state, { payload }) => ({
        ...state,
        benchmarkIdSending: payload,
    }))
    .handleAction(ac.sendBenchmarkEmailAsyncAction.success, (state) => ({
        ...state,
        benchmarkIdSending: null,
    }))
    .handleAction(ac.sendBenchmarkEmailAsyncAction.failure, (state) => ({
        ...state,
        benchmarkIdSending: null,
    }))
    .handleAction(ac.fetchTopBenchmarkAsyncAction.request, (state) => ({
        ...state,
        topBenchmark: null,
        topBenchmarkFetching: true,
    }))
    .handleAction(ac.fetchTopBenchmarkAsyncAction.success, (state, { payload }) => ({
        ...state,
        topBenchmark: payload,
        topBenchmarkFetching: false,
    }))
    .handleAction(ac.fetchTopBenchmarkAsyncAction.failure, (state) => ({
        ...state,
        topBenchmarkFetching: false,
    }))
    .handleAction(ac.setBenchmarkCategoriesAction, (state, { payload }) => ({
        ...state,
        categories: payload,
    }))
    .handleAction(ac.setActiveBenchmarkCategoryAction, (state, { payload }) => ({
        ...state,
        selectedCategory: payload,
    }))
    .handleAction(ac.setActiveBenchmarksModeAction, (state, { payload }) => ({
        ...state,
        selectedMode: payload,
    }))
    .handleAction(ac.fetchBenchmarksQuotaAsync.request, (state) => ({
        ...state,
        quotaFetching: true,
        benchmarks: [],
    }))
    .handleAction(ac.fetchBenchmarksQuotaAsync.success, (state, { payload }) => ({
        ...state,
        quota: payload,
        quotaFetching: false,
    }))
    .handleAction(ac.fetchBenchmarksQuotaAsync.failure, (state) => ({
        ...state,
        quotaFetching: false,
    }))
    .handleAction(ac.setDomainTokenAction, (state, { payload }) => ({
        ...state,
        domainToken: payload,
    }));

export default benchmarksReducer;
