import categoryService from "common/services/categoryService";
import { swSettings } from "common/services/swSettings";
import { categoryTextToIconFilter, i18nFilter } from "filters/ngFilters";
import * as _ from "lodash";
import CountryService from "services/CountryService";
import { mapServerFilters } from "./LeadGeneratorFiltersServer";

class LeadGeneratorUtils {
    public static REPORT_NAME_MAX_LENGTH = 100;

    public static formatReportPeriod(date) {
        const monthNames = [
            "common.month.january",
            "common.month.february",
            "common.month.march",
            "common.month.april",
            "common.month.may",
            "common.month.june",
            "common.month.july",
            "common.month.august",
            "common.month.september",
            "common.month.october",
            "common.month.november",
            "common.month.december",
        ];
        const d = new Date(date);
        return `${i18nFilter()(monthNames[d.getMonth()])} ${d.getUTCFullYear()}`;
    }

    public static getComponentDate() {
        return this.formatReportPeriod(swSettings.components.LeadGenerationReport.startDate._d);
    }

    public static getGroupSitesCalc(countries, categories, top) {
        countries = countries || 1;
        categories = categories || 1;
        top = top || 1;
        return Math.floor(top / (countries * categories)) || 1;
    }

    public static getComponentCategories() {
        const categoryTextToIcon = categoryTextToIconFilter();
        return categoryService
            .getFlattenedCategoriesList()
            .filter((category) => !category.isCustomCategory)
            .filter((category) => !category.isOldCategory)
            .map((item) => ({
                ...item,
                icon: categoryTextToIcon(item.text),
            }));
    }

    public static getComponentCountries() {
        const LeadGeneratorCountries = swSettings.components.LeadGenerationReport.allowedCountries;
        const crrCountries = swSettings.current.resources.Countries;
        return LeadGeneratorCountries.filter((country) =>
            crrCountries.find((id) => id === country.id),
        );
    }

    public static getComponentDesktopOnlyCountries() {
        const mobileWebCountries =
            swSettings.components.LeadGenerationReport.resources.MobileWebCountries;
        return this.getComponentCountries().filter(
            (country) => !mobileWebCountries.find((mobileWeb) => country.id === mobileWeb),
        );
    }

    public static getCompanyInformationCountries() {
        return CountryService.countries.reduce((all, country) => {
            if (country.id === 0 || country.id === 999) {
                return [...all];
            }
            if (country.children && country.children.length > 0) {
                return [...all, country, ...country.children];
            }
            return [...all, country];
        }, []);
    }

    public static getBoxSubtitleFilters(top, orderBy, filters) {
        let countriesHQFilters = [{}];
        let countriesHQZipCodeFilters = [{}];

        const serverFilters = mapServerFilters;
        const topSubtitle = top
            ? [
                  {
                      filter: "top",
                      value: serverFilters.top.getFilterSubtitle(top),
                  },
              ]
            : [];
        const orderBySubtitle = orderBy
            ? [
                  {
                      filter: "order_by",
                      value: serverFilters.order_by.getFilterSubtitle(orderBy),
                  },
              ]
            : [];
        const {
            countries,
            categories = [],
            company_zip,
            company_country_code_list,
            company_country_code_functionality,
            ...rest
        } = filters;

        const categoriesFilter = serverFilters.categories.getFilterSubtitle(categories);
        const categoriesFilters = [];
        categoriesFilter.forEach((category) => {
            if (category) {
                categoriesFilters.push({
                    filter: "icon",
                    value: category.text,
                    iconName:
                        category.id === "All"
                            ? "all-categories"
                            : category.isChild
                            ? _.kebabCase(category.parentItem.name)
                            : _.kebabCase(category.name),
                });
            }
        });

        const countriesFilters = serverFilters.countries
            .getFilterSubtitle(countries)
            .filter((country) => Boolean(country))
            .map((country) => ({
                filter: "country",
                value: country.text,
                countryCode: country.id,
            }));

        if (company_country_code_list && company_country_code_functionality) {
            const companyCountryCodeList = serverFilters.company_country_code_list.getFilterSubtitle(
                company_country_code_list,
            );
            const customTitle = serverFilters.company_country_code_functionality.getFilterSubtitle(
                company_country_code_functionality,
            )
                ? "grow.lead_generator.new.general.functional_flag.company_country_code.exclude"
                : "grow.lead_generator.new.general.functional_flag.company_country_code.include";

            countriesHQFilters = [
                {
                    filter: "company_country_code_list",
                    value: `${i18nFilter()(customTitle)}: ${companyCountryCodeList}`,
                },
            ];
        }

        if (company_zip) {
            const companyZip = serverFilters.company_zip.getFilterSubtitle(company_zip);
            const customTitle = serverFilters.company_country_code_functionality.getFilterSubtitle(
                company_country_code_functionality,
            )
                ? "grow.lead_generator.new.general.functional_flag.hq.company_zip.exclude"
                : "grow.lead_generator.new.general.functional_flag.hq.company_zip.include";

            countriesHQZipCodeFilters = [
                {
                    filter: "company_zip",
                    value: `${i18nFilter()(customTitle)}: ${companyZip}`,
                },
            ];
        }

        const restFilters = [];
        Object.keys(mapServerFilters).forEach((filter) => {
            if (rest[filter]) {
                const filterValue = serverFilters[filter].getFilterSubtitle(rest[filter]);
                restFilters.push({
                    filter,
                    [typeof filterValue !== "function" ? "value" : "getFilterValue"]: filterValue,
                });
            }
        });
        return [
            ...topSubtitle,
            ...orderBySubtitle,
            ...countriesFilters,
            ...categoriesFilters,
            ...countriesHQFilters,
            ...countriesHQZipCodeFilters,
            ...restFilters,
        ];
    }

    public static disableLeadGenerator() {
        return swSettings.components.LeadGenerationReport.isDisabled;
    }

    public static isReportNameValid(name) {
        return name.trim() !== "";
    }

    public static isOnlyFirstChanged(crrValue, initValue) {
        return crrValue[0] !== initValue[0] && crrValue[1] === initValue[1];
    }

    public static isOnlySecondChanged(crrValue, initValue) {
        return crrValue[0] === initValue[0] && crrValue[1] !== initValue[1];
    }
}

export default LeadGeneratorUtils;
