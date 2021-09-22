import { ISwSettings } from "app/@types/ISwSettings";
import { swSettings } from "common/services/swSettings";
import { categoryTextToIconFilter } from "filters/ngFilters";
import { SalesSettings } from "pages/sales-intelligence/services/types";
import { WORLDWIDE_COUNTRY_ID } from "pages/sales-intelligence/constants/common";
import categoryService, { createCategoryService } from "common/services/categoryService";
import CountryService, { ICountryObject, ICountryService } from "services/CountryService";
import { AdvancedSearchSettingsService } from "../types/services";

const createAdvancedSearchSettingsService = (
    swSettings: ISwSettings,
    countryService: ICountryService,
    categoryService: ReturnType<typeof createCategoryService>,
): AdvancedSearchSettingsService => {
    const {
        components: { LeadGenerationReport, SalesWorkspace },
    } = swSettings;
    const { resources } = (SalesWorkspace as unknown) as SalesSettings;

    const getCurrentComponentCategories = () => {
        const categoryTextToIcon = categoryTextToIconFilter();

        return categoryService
            .getFlattenedCategoriesList()
            .filter((category) => !category.isCustomCategory)
            .filter((category) => !category.isOldCategory)
            .map((item) => ({
                ...item,
                icon: categoryTextToIcon(item.text),
            }));
    };

    const getCompanyInformationCountries = () => {
        return countryService.countries.reduce<ICountryObject[]>((countries, country) => {
            if (country.id === 0 || country.id === WORLDWIDE_COUNTRY_ID) {
                return countries;
            }

            if (country.children?.length > 0) {
                return countries.concat(country).concat(country.children);
            }

            return countries.concat(country);
        }, []);
    };

    const getCurrentComponentCountries = () => {
        const currentCountries = swSettings.current.resources.Countries;

        return LeadGenerationReport.allowedCountries.filter((country) => {
            return currentCountries.includes(country.id);
        });
    };

    const getCurrentComponentDesktopCountries = () => {
        const mobileWebCountriesIds = LeadGenerationReport.resources.MobileWebCountries;

        return getCurrentComponentCountries().filter(
            (c) => !mobileWebCountriesIds.find((id) => c.id === id),
        );
    };

    const getWorldwideOrFirstCountryCode = () => {
        const availableUserCountries = SalesWorkspace.resources.Countries;

        if (availableUserCountries.includes(WORLDWIDE_COUNTRY_ID)) {
            return WORLDWIDE_COUNTRY_ID;
        }

        return availableUserCountries[0];
    };

    return {
        isAdvancedSearchEnabled: Boolean(resources.LeadGen2Enabled),
        getWorldwideOrFirstCountryCode,
        getCurrentComponentCategories,
        getCompanyInformationCountries,
        getCurrentComponentCountries,
        getCurrentComponentDesktopCountries,
    };
};

export default createAdvancedSearchSettingsService(swSettings, CountryService, categoryService);
