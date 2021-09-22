import { createSelector } from "reselect";
import { mapAllowedAndCountryShares } from "pages/workspace/sales/sub-modules/benchmarks/helpers";
import {
    selectCountryShares,
    selectBenchmarkMode,
    selectBenchmarksFetching,
    selectSelectedCountry,
    selectActiveTopic,
    selectActiveCountriesIds,
    selectTopicsFetching,
} from "../../store/selectors";
import { useSalesSettingsHelper } from "pages/sales-intelligence/services/salesSettingsHelper";
import { RootState } from "store/types";
import { BenchmarksMode } from "../../constants";
import { selectPreparedTopics } from "pages/workspace/sales/selectors";

const salesSettings = useSalesSettingsHelper();
const allowedCountries = salesSettings.getAllowedCountries();

const selectBenchmarksCountries = createSelector(selectCountryShares, (countryShares) => {
    return mapAllowedAndCountryShares(allowedCountries, countryShares, "share");
});

const benchmarkOptions = [
    {
        id: BenchmarksMode.TopCountry,
        icon: "global-rank",
        text: `si.insights.mode.${BenchmarksMode.TopCountry}.name`,
        description: `si.insights.mode.${BenchmarksMode.TopCountry}.description`,
    },
    {
        id: BenchmarksMode.SelectedCountry,
        icon: "location",
        text: `si.insights.mode.${BenchmarksMode.SelectedCountry}.name`,
        description: `si.insights.mode.${BenchmarksMode.SelectedCountry}.description`,
    },
    {
        id: BenchmarksMode.TopOpportunities,
        icon: "rocket",
        text: `si.insights.mode.${BenchmarksMode.TopOpportunities}.name`,
        description: `si.insights.mode.${BenchmarksMode.TopOpportunities}.description`,
    },
    {
        id: BenchmarksMode.TopAchievements,
        icon: "trophy",
        text: `si.insights.mode.${BenchmarksMode.TopAchievements}.name`,
        description: `si.insights.mode.${BenchmarksMode.TopAchievements}.description`,
    },
];

const selectIsSingleCountryDropdown = createSelector(selectBenchmarkMode, (mode) => mode < 2);

const selectIsCountryDropdownDisabled = createSelector(
    selectBenchmarkMode,
    (mode) => mode === BenchmarksMode.TopCountry,
);
const selectIsShowAllMyCountries = createSelector(
    selectBenchmarkMode,
    (mode) => !(mode === BenchmarksMode.SelectedCountry),
);

const selectSelectedCountriesIdsForDropdown = createSelector(selectActiveCountriesIds, (ids) => {
    return ids.reduce<{ [key: string]: boolean }>((map, id) => {
        map[id] = true;

        return map;
    }, {});
});

export const mapStateToProps = (state: RootState) => {
    return {
        selectedCountry: selectSelectedCountry(state),
        selectedCountriesIds: selectSelectedCountriesIdsForDropdown(state),
        selectedTopic: selectActiveTopic(state),
        countryShares: selectCountryShares(state),
        benchmarkCountries: selectBenchmarksCountries(state),
        benchmarkModeId: JSON.stringify(selectBenchmarkMode(state)),
        benchmarkModeOptions: benchmarkOptions,
        isBenchmarksLoading: selectBenchmarksFetching(state),
        isSingleSelectCountryDropdown: selectIsSingleCountryDropdown(state),
        isCountryDropdownDisabled: selectIsCountryDropdownDisabled(state),
        isShowAllMyCountries: selectIsShowAllMyCountries(state),
        preparedTopics: selectPreparedTopics(state),
        topicsFetching: selectTopicsFetching(state),
    };
};
