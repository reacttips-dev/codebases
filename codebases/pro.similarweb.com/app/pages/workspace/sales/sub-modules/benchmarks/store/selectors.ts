import { createSelector } from "reselect";
import { selectBenchmarksSlice } from "../../../store/selectors";
import {
    compareNumericPropDesc,
    createFormattedTopicsList,
    createStatePropertySelector,
} from "../../../helpers";
import { getMaxCountryShare, groupTopicsByPopular } from "../helpers";
import { BenchmarksMode } from "pages/workspace/sales/sub-modules/benchmarks/constants";

const select = createStatePropertySelector(selectBenchmarksSlice);

// Topics
export const selectTopicsList = select("topics");
export const selectTopicsFetching = select("topicsFetching");
export const selectTopicsFetchError = select("topicsFetchError");
export const selectTopicsGroupedByPopular = createSelector(selectTopicsList, groupTopicsByPopular);

// Settings
export const selectSettings = select("settings");
export const selectSettingsFetching = select("settingsFetching");
export const selectSettingsUpdating = select("settingsUpdating");
export const selectSettingsFetchError = select("settingsFetchError");
export const selectActiveTopic = createSelector(selectSettings, (settings) => settings.topic);
export const selectBenchmarkMode = createSelector(
    selectSettings,
    (settings) => settings.benchmarkMode,
);
export const selectSelectedCountry = createSelector(
    selectSettings,
    (settings) => settings.selectedCountry,
);

// Benchmarks
export const selectBenchmarks = select("benchmarks");
export const selectBenchmarksFetching = select("benchmarksFetching");
export const selectBenchmarksFetchError = select("benchmarksFetchError");
export const selectBenchmarksAreEmpty = createSelector(
    selectBenchmarks,
    (benchmarks) => benchmarks.length === 0,
);

// Quota
export const selectBenchmarksQuota = select("quota");
export const selectBenchmarksQuotaFetching = select("quotaFetching");
export const selectBenchmarksDomainToken = select("domainToken");

// Single benchmark
export const selectBenchmarkIdUpdating = select("benchmarkIdUpdating");

// Top benchmark
export const selectTopBenchmark = select("topBenchmark");
export const selectTopBenchmarkFetching = select("topBenchmarkFetching");

export const selectTopBenchmarkOrDefault = createSelector(
    selectTopBenchmark,
    selectTopBenchmarkFetching,
    (topBenchmark, topBenchmarkFetching) => {
        if (topBenchmarkFetching) {
            return null;
        }

        return topBenchmark;
    },
);

// benchmark id is being sending by email
export const selectBenchmarkIdSendingByEmail = select("benchmarkIdSending");

// Country Shares
export const selectCountryShares = select("countryShares");
export const selectCountrySharesFetching = select("countrySharesFetching");

// Competitors
export const selectCompetitors = select("competitors");
export const selectCompetitorsUpdating = select("competitorsUpdating");
export const selectCompetitorsFetching = select("competitorsFetching");
export const selectNotRemovedSimilarSites = createSelector(selectCompetitors, (competitors) => {
    return competitors.filter((c) => !c.removed);
});

// Mode
export const selectActiveBenchmarksMode = select("selectedMode");

// Categories
export const selectActiveBenchmarkCategory = select("selectedCategory");
export const selectBenchmarkCategories = select("categories");

// Combined
export const selectTopicFromSettings = createSelector(selectSettings, (s) => {
    return s.topic;
});

export const selectCountriesFromSettings = createSelector(selectSettings, (s) => {
    return s.countries;
});

export const selectActiveCountriesIds = createSelector(
    [selectCountriesFromSettings, selectBenchmarkMode, selectCountryShares, selectSelectedCountry],
    (countriesFromSettings, benchmarkMode, countryShares, selectedCountryId): number[] => {
        if (benchmarkMode === BenchmarksMode.TopCountry) {
            const { country } = getMaxCountryShare(countryShares);
            return [country];
        }

        if (benchmarkMode === BenchmarksMode.SelectedCountry) {
            if (selectedCountryId && typeof countryShares[selectedCountryId] !== "undefined") {
                return [selectedCountryId];
            }

            const { country } = getMaxCountryShare(countryShares);

            return country ? [country] : [];
        }

        return countriesFromSettings
            .map((countryId) => {
                const shareObject = countryShares[countryId];

                if (shareObject) {
                    return shareObject;
                }

                return {
                    country: countryId,
                    share: 0,
                };
            })
            .sort(compareNumericPropDesc("share"))
            .map((countryShare) => countryShare.country);
    },
);

export const preparedTopics = createSelector(selectTopicsList, createFormattedTopicsList);
