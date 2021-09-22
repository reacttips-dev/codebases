import { ISwSettings, SnapshotInterval } from "app/@types/ISwSettings";
import { swSettings } from "common/services/swSettings";
import { SalesSettings } from "./types";
import dateTimeService from "services/date-time/dateTimeService";

/**
 * Getting required for sales workspace data from SWSettings
 * @param swSettings
 */
export const createSalesSettingsHelper = (swSettings: ISwSettings) => {
    // These two values are taken from the old code (ReportResults.tsx)
    const LEAD_GENERATOR_RESULTS_MAX_LIMIT = 2147483647;
    const LEAD_GENERATOR_RESULTS_REGULAR_LIMIT = 50000;
    const FORMAT_DATE = "YYYY.MM";
    const { formatWithMoment } = dateTimeService;

    const { user } = swSettings;
    const { WebAnalysis, SalesWorkspace } = swSettings.components;

    const {
        allowedCountries,
        resources: {
            SupportedDate,
            InitialCountry,
            SavedSearchesLimit,
            WSLeadGeneratorFilters,
            LeadGeneratorNumberOfQueriesLimit,
            NumCompaniesTracked,
            MobileWebCountries,
            LeadGeneratorResults,
            ContactsFeatureEnabled,
        },
    } = (SalesWorkspace as unknown) as SalesSettings;

    return {
        /**
         * Returns last supported snapshot date
         */
        getLastSnapshotDate() {
            return SupportedDate;
        },
        /**
         * Returns initial country internal code
         */
        getInitialCountry() {
            return InitialCountry;
        },
        /**
         * Returns allowed saved searches quantity
         */
        getNumberOfAllowedSavedSearches() {
            return SavedSearchesLimit;
        },
        /**
         * Checks if lead generator is allowed to use
         */
        isLeadGeneratorLimited() {
            return LeadGeneratorNumberOfQueriesLimit;
        },
        /**
         * Checks if filter is allowed to use
         * @param filterName
         */
        isLeadGeneratorFilterAvailable(filterName: string) {
            // TODO: Make a constant for "All"
            return (
                WSLeadGeneratorFilters.includes("All") ||
                WSLeadGeneratorFilters.includes(filterName)
            );
        },
        /**
         * Checks if the user has only one country allowed
         */
        hasSingleCountryAllowed() {
            return allowedCountries.length === 1;
        },
        /**
         * Returns the sales track quota limit for the user
         */
        getQuotaLimit() {
            return NumCompaniesTracked;
        },
        /**
         * Returns the "lead-generator" search results limit for the user
         */
        getSearchResultsLimit() {
            return LeadGeneratorResults;
        },
        /**
         * Whether "lead-generator" search results are limited for the user
         */
        areSearchResultsLimited() {
            return (
                LeadGeneratorResults !== LEAD_GENERATOR_RESULTS_MAX_LIMIT &&
                LeadGeneratorResults !== LEAD_GENERATOR_RESULTS_REGULAR_LIMIT
            );
        },
        /**
         * @param country
         */
        getTrafficSourceForCountryId(country: number) {
            if (MobileWebCountries.includes(country)) {
                return "total";
            }

            return "desktop";
        },
        hasSolution2() {
            return user.hasSolution2;
        },
        isUserAFroUser() {
            return user.isFro;
        },
        isSiUser() {
            return user.hasSI;
        },
        isExcelAllowed() {
            return swSettings.components.Home.resources.IsExcelAllowed as boolean;
        },
        getAllowedCountries() {
            return allowedCountries;
        },
        getMobileWebCountries(): {} {
            return MobileWebCountries.reduce((acc, countryId) => {
                acc[countryId] = true;
                return acc;
            }, {});
        },
        isContactsFeatureEnabled() {
            return ContactsFeatureEnabled;
        },
        getSupportedDuration(): string {
            const defaultDuration = 3;
            const datePickerPresets = swSettings?.current?.datePickerPresets;
            const snapshotInterval = WebAnalysis.resources?.SnapshotInterval;

            if (!datePickerPresets || !snapshotInterval) {
                return `${defaultDuration}m`;
            }

            const { startdate, enddate, count } = (snapshotInterval as unknown) as SnapshotInterval;

            const matchedRange = datePickerPresets.filter(
                ({ value, locked }) => value === `${count}m` && !locked,
            );

            if (matchedRange.length) {
                return `${count}m`;
            }

            return startdate && enddate
                ? `${formatWithMoment(startdate, FORMAT_DATE)}-${formatWithMoment(
                      enddate,
                      FORMAT_DATE,
                  )}`
                : `${defaultDuration}m`;
        },
    };
};

const salesSettingsHelper = createSalesSettingsHelper(swSettings);

export const useSalesSettingsHelper = () => salesSettingsHelper;

export default salesSettingsHelper;
