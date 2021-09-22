import RegexPatterns from "services/RegexPatterns";
import { i18nFilter } from "filters/ngFilters";
import { isAlphaNumericOrJapaneseText } from "UtilitiesAndConstants/UtilityFunctions/assetsNameValidation";
import { ICountry } from "components/filters-bar/country-filter/CountryFilterTypes";
import { buildTrackerBase } from "../common/handlers/CompetitiveTrackingDataAdapter";
import { CompetitiveTrackerService } from "services/competitiveTracker/competitiveTrackerService";
import dayjs from "dayjs";
import { SwNavigator } from "common/services/swNavigator";
import { ITrackerAsset } from "components/SecondaryBar/NavBars/MarketResearch/NavBarSections/CompetitiveTracking/CompetitiveTrackingTypes";
import { ITrackerID } from "services/competitiveTracker/types";

export const TITLE_MAX_LENGTH = 26;
const i18n = i18nFilter();

export interface ITrackerNameValidationResult {
    isValid: boolean;
    errorMessage?: string;
}

const error = (errorMessage: string): ITrackerNameValidationResult => ({
    isValid: false,
    errorMessage: i18n(errorMessage),
});

export const validateTrackerName = (
    trackerName: string,
    trackerId: ITrackerID = String(),
): ITrackerNameValidationResult => {
    if (!trackerName || trackerName.length === 0)
        return error("competitive.tracker.wizard.name.required");
    if (trackerName.length > TITLE_MAX_LENGTH)
        return error("competitive.tracker.wizard.name.too.long");

    const isFormatValid = RegexPatterns.isUnicodeRegexSupported()
        ? RegexPatterns.unicodeOrWhitespaceOnly(trackerName)
        : isAlphaNumericOrJapaneseText(trackerName);
    if (!isFormatValid) return error("competitive.tracker.wizard.name.invalid.characters");

    const trackers = CompetitiveTrackerService.get();
    const isNameExists = trackers.some(({ name, id }) => name === trackerName && trackerId !== id);
    if (isNameExists) return error("competitive.tracker.wizard.name.already.exists");

    return {
        isValid: true,
    };
};

export const createNewTrackerFromWizard = async (
    name,
    selectedIndustry,
    country: ICountry,
    selectedAsset: ITrackerAsset,
    selectedCompetitors: ITrackerAsset[],
) => {
    const newTracker = buildTrackerBase(
        name,
        selectedIndustry,
        country,
        selectedAsset,
        selectedCompetitors,
    );
    return CompetitiveTrackerService.add(newTracker);
};

export const navigateToNewestTrackerPage = (navigator: SwNavigator) => {
    const trackers = CompetitiveTrackerService.get();
    const sortedByLastUpdateDescTrackers = trackers.sort(
        ({ lastUpdated }, { lastUpdated: lastUpdatedB }) => {
            return dayjs
                .utc(dayjs.utc(lastUpdatedB).unix())
                .diff(dayjs.utc(dayjs.utc(lastUpdated).unix()));
        },
    );
    const trackerId = sortedByLastUpdateDescTrackers?.[0].id;
    navigator.go("companyResearch_competitiveTracking_tracker", { trackerId });
};
