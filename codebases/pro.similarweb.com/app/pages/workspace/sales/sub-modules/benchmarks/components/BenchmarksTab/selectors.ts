import { createSelector } from "reselect";
import { selectSelectedWebsite } from "pages/workspace/sales/store/selectors";
import {
    selectBenchmarkMode,
    selectCountriesFromSettings,
    selectCountryShares,
    selectSelectedCountry,
} from "../../store/selectors";
import { i18nFilter } from "filters/ngFilters";
import { BenchmarksMode } from "../../constants";

const EMPTY_LIMIT = 5000;

const MAIN_MESSAGE_NOT_ENOUGH_DATA = "si.insights.empty.mainMessage";
const MAIN_MESSAGE_NO_DATA = "si.insights.empty.mainMessage.noData";
const SUB_MESSAGE_NOT_ENOUGH_DATA = "si.insights.empty.subMessage";

export const selectEmptyStateMessages = createSelector(
    selectCountryShares,
    selectSelectedCountry,
    selectCountriesFromSettings,
    selectSelectedWebsite,
    selectBenchmarkMode,
    (countryShares, country, countriesList, website, benchmarkMode) => {
        let isSelectedVisitsHigherLimit;

        if (
            benchmarkMode === BenchmarksMode.TopCountry ||
            benchmarkMode === BenchmarksMode.SelectedCountry
        ) {
            isSelectedVisitsHigherLimit = countryShares[country]?.visits > EMPTY_LIMIT;
        }

        if (
            benchmarkMode === BenchmarksMode.TopOpportunities ||
            benchmarkMode === BenchmarksMode.TopAchievements
        ) {
            isSelectedVisitsHigherLimit = countriesList.some((currentCountry) => {
                return countryShares[currentCountry]?.visits > EMPTY_LIMIT;
            });
        }

        if (isSelectedVisitsHigherLimit) {
            return undefined;
        }

        const isAnyVisitsHigher = Object.values(countryShares).some((countryItem) => {
            return countryItem.visits > EMPTY_LIMIT;
        });

        const messages = {
            mainMessage: isAnyVisitsHigher
                ? i18nFilter()(MAIN_MESSAGE_NOT_ENOUGH_DATA)
                : `${i18nFilter()(MAIN_MESSAGE_NO_DATA)} ${website?.domain}`,
            subMessage: isAnyVisitsHigher ? SUB_MESSAGE_NOT_ENOUGH_DATA : "",
        };

        return messages;
    },
);
