import { createAction, createAsyncAction } from "typesafe-actions";
import { TopicType } from "../types/topics";
import { CountrySharesByCountryId } from "../types/common";
import { BenchmarkResultType, BenchmarksQuotaType, BenchmarkType } from "../types/benchmarks";
import { BenchmarksSettingsType } from "../types/settings";
import {
    BenchmarkCompetitorUpdatePayload,
    BenchmarkAddCompetitorPayload,
    BenchmarkRemoveCompetitorPayload,
} from "../types/competitors";
import { SimilarSiteType } from "pages/sales-intelligence/sub-modules/right-sidebar/types/similar-sites";
import { BenchmarksMode } from "pages/workspace/sales/sub-modules/benchmarks/constants";
import { FetchError } from "pages/sales-intelligence/types";

// Topics
export const fetchTopicsAsyncAction = createAsyncAction(
    "@@sales/benchmarks/FETCH_TOPICS_START",
    "@@sales/benchmarks/FETCH_TOPICS_SUCCESS",
    "@@sales/benchmarks/FETCH_TOPICS_FAILURE",
)<void, TopicType[], string | undefined>();

// Settings
export const fetchSettingsAsyncAction = createAsyncAction(
    "@@sales/benchmarks/FETCH_SETTINGS_START",
    "@@sales/benchmarks/FETCH_SETTINGS_SUCCESS",
    "@@sales/benchmarks/FETCH_SETTINGS_FAILURE",
)<void, BenchmarksSettingsType, string | undefined>();

export const updateSettingsAsyncAction = createAsyncAction(
    "@@sales/benchmarks/UPDATE_SETTINGS_START",
    "@@sales/benchmarks/UPDATE_SETTINGS_SUCCESS",
    "@@sales/benchmarks/UPDATE_SETTINGS_FAILURE",
)<void, BenchmarksSettingsType, string | undefined>();

// Benchmarks
export const fetchBenchmarksAsyncAction = createAsyncAction(
    "@@sales/benchmarks/FETCH_BENCHMARKS_START",
    "@@sales/benchmarks/FETCH_BENCHMARKS_SUCCESS",
    "@@sales/benchmarks/FETCH_BENCHMARKS_FAILURE",
)<void, BenchmarkResultType[], string | undefined>();

// TOP Benchmark
export const fetchTopBenchmarkAsyncAction = createAsyncAction(
    "@@sales/benchmarks/FETCH_TOP_BENCHMARK_START",
    "@@sales/benchmarks/FETCH_TOP_BENCHMARK_SUCCESS",
    "@@sales/benchmarks/FETCH_TOP_BENCHMARK_FAILURE",
)<void, BenchmarkResultType, string | undefined>();

// Single benchmark
export const fetchSingleBenchmarkAsyncAction = createAsyncAction(
    "@@sales/benchmarks/FETCH_SINGLE_BENCHMARK_START",
    "@@sales/benchmarks/FETCH_SINGLE_BENCHMARK_SUCCESS",
    "@@sales/benchmarks/FETCH_SINGLE_BENCHMARK_FAILURE",
)<string, BenchmarkResultType, string | undefined>();

// Benchmark competitors
export const updateCompetitorInABenchmarkAction = createAction(
    "@@sales/benchmarks/UPDATE_BENCHMARK_COMPETITOR",
)<BenchmarkCompetitorUpdatePayload>();

export const addCompetitorInABenchmarkAction = createAction(
    "@@sales/benchmarks/ADD_BENCHMARK_COMPETITOR",
)<BenchmarkAddCompetitorPayload>();

export const removeCompetitorInABenchmarkAction = createAction(
    "@@sales/benchmarks/REMOVE_BENCHMARK_COMPETITOR",
)<BenchmarkRemoveCompetitorPayload>();

// Country Shares
export const fetchCountrySharesAsyncAction = createAsyncAction(
    "@@sales/benchmarks/FETCH_COUNTRY_SHARES_START",
    "@@sales/benchmarks/FETCH_COUNTRY_SHARES_SUCCESS",
    "@@sales/benchmarks/FETCH_COUNTRY_SHARES_FAILURE",
)<void, CountrySharesByCountryId, string | undefined>();

// Competitors
export const fetchCompetitorsAsyncAction = createAsyncAction(
    "@@sales/benchmarks/FETCH_COMPETITORS_START",
    "@@sales/benchmarks/FETCH_COMPETITORS_SUCCESS",
    "@@sales/benchmarks/FETCH_COMPETITORS_FAILURE",
)<void, SimilarSiteType[], string | undefined>();
export const addCompetitorAction = createAction("@@sales/similar-sites-panel/ADD_WEBSITE")<
    SimilarSiteType
>();
export const removeCompetitorAction = createAction("@@sales/similar-sites-panel/REMOVE_WEBSITE")<
    string
>();
export const undoUnsavedChangesAction = createAction(
    "@@sales/similar-sites-panel/UNDO_UNSAVED_CHANGES",
)();

export const updateCompetitorAsyncAction = createAsyncAction(
    "@@sales/benchmarks/UPDATE_COMPETITORS_START",
    "@@sales/benchmarks/UPDATE_COMPETITORS_SUCCESS",
    "@@sales/benchmarks/UPDATE_COMPETITORS_FAILURE",
)<void, SimilarSiteType[], string | undefined>();

// SEND EMAIL
export const sendBenchmarkEmailAsyncAction = createAsyncAction(
    "@@sales/benchmarks/SEND_BENCHMARK_EMAIL_START",
    "@@sales/benchmarks/SEND_BENCHMARK_EMAIL_SUCCESS",
    "@@sales/benchmarks/SEND_BENCHMARK_EMAIL_FAILURE",
)<string, void, void>();

// Benchmarks mode
export const setActiveBenchmarksModeAction = createAction("@@sales/benchmarks/SET_ACTIVE_MODE")<
    BenchmarksMode
>();

// Benchmark categories
export const setBenchmarkCategoriesAction = createAction("@@sales/benchmarks/SET_CATEGORIES")<
    BenchmarkType["category"][]
>();
export const setActiveBenchmarkCategoryAction = createAction(
    "@@sales/benchmarks/SET_ACTIVE_CATEGORY",
)<BenchmarkType["category"]>();

// Quota
export const fetchBenchmarksQuotaAsync = createAsyncAction(
    "@@sales/benchmarks/FETCH_BENCHMARKS_QUOTA_START",
    "@@sales/benchmarks/FETCH_BENCHMARKS_QUOTA_SUCCESS",
    "@@sales/benchmarks/FETCH_BENCHMARKS_QUOTA_FAILURE",
)<void, BenchmarksQuotaType, FetchError>();

export const setDomainTokenAction = createAction("@@sales/benchmarks/SET_DOMAIN_QUOTA")<string>();
