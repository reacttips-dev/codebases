import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import { allTrackers } from "services/track/track";
import * as _ from "lodash";
import { PreferencesService } from "services/preferences/preferencesService";
import categoryService from "common/services/categoryService";

export const getMaxKey = (map: { [key: string]: number }): string => {
    return Object.keys(map).reduce((a, b) => (map[a] > map[b] ? a : b), null);
};

export const BoxStates = {
    LOADING: 1,
    READY: 2,
    FAILED: 3,
    EMPTY: 4,
    SETTINGS: 5,
    UPGRADE: 6,
};

export const resourcesNames = {
    savedProperties: "savedProperties",
    customCategories: "customCategories",
    keywordGroups: "keywordGroups",
    trendingWebsites: "trendingWebsites",
    trendingApps: "trendingApps",
    trendingKeywords: "trendingKeywords",
};

export const halfFlipAnimationDuration = 250;
export const fakeLoadingTime = 1200;

export function getTitleUrl(navState, filters) {
    const swNavigator = Injector.get("swNavigator") as any;
    const state = swNavigator.getState(navState);
    const configId = typeof state.configId === "function" ? state.configId() : state.configId;
    const navStateDefaultParams = { ...swSettings.components[configId].defaultParams, ...filters };
    return swNavigator.href(navState, navStateDefaultParams);
}

export function getDefaultPageState() {
    const preferences = PreferencesService.get();
    const populars: any = getPopularFilters();
    const trendingWebsitesCategory = categoryService.getCategory(
        _.get(preferences, "trendingWebsitesFilters.category", populars.trendingWebsites.category),
    );
    const trendingKeywordsCategory = categoryService.getCategory(
        _.get(preferences, "trendingKeywordsFilters.category", populars.trendingKeywords.category),
    );
    const trendingWebsitesCustomCategoryHash = _.get(trendingWebsitesCategory, "categoryHash");
    const trendingKeywordCustomCategoryHash = _.get(trendingKeywordsCategory, "categoryHash");
    const trendingAppsStore = populars.trendingApps.store === "0" ? "Google" : "Apple";

    return {
        savedPropertiesBox: {
            prevState: BoxStates.LOADING,
            state: BoxStates.LOADING,
            isFlipping: false,
        },
        customCategoriesBox: {
            prevState: BoxStates.LOADING,
            state: BoxStates.LOADING,
            isFlipping: false,
            country:
                _.get(preferences, "customCategoriesFilters.country") ||
                getDefaultCountry("IndustryAnalysis", populars.customCategories.country),
            duration: "3m",
            //...preferences.customCategoriesFilters - Use when adding more filters (currently 1)
        },
        keywordGroupsBox: {
            prevState: BoxStates.LOADING,
            state: BoxStates.LOADING,
            isFlipping: false,
            country:
                _.get(preferences, "keywordGroupsFilters.country") ||
                getDefaultCountry("KeywordAnalysis", populars.keywordGroups.country),
            duration: "3m",
            //...preferences.keywordGroupsFilters - Use when adding more filters (currently 1)
        },
        trendingWebsitesBox: {
            prevState: BoxStates.LOADING,
            state: BoxStates.LOADING,
            isFlipping: false,
            country:
                _.get(preferences, "trendingWebsitesFilters.country") ||
                getDefaultCountry("IndustryAnalysis", populars.trendingWebsites.country),
            duration: "1m",
            customCategoryHash: trendingWebsitesCustomCategoryHash,
            ...preferences.trendingWebsitesFilters,
            category: _.get(trendingWebsitesCategory, "id") || "All",
        },
        trendingAppsBox: {
            prevState: BoxStates.LOADING,
            state: BoxStates.LOADING,
            isFlipping: false,
            store: trendingAppsStore,
            country: populars.trendingApps.country || "840",
            device:
                _.get(preferences, "trendingAppsFilters.store", trendingAppsStore) === "Google"
                    ? "AndroidPhone"
                    : "iPhone",
            duration: "1m",
            category: populars.trendingApps.category || "All",
            ...preferences.trendingAppsFilters,
        },
        trendingKeywordsBox: {
            prevState: BoxStates.LOADING,
            state: BoxStates.LOADING,
            isFlipping: false,
            country:
                _.get(preferences, "trendingKeywordsFilters.country") ||
                getDefaultCountry("KeywordAnalysis", populars.trendingKeywords.country),
            duration: "1m",
            customCategoryHash: trendingKeywordCustomCategoryHash,
            ...preferences.trendingKeywordsFilters,
            category: _.get(trendingKeywordsCategory, "id") || "All",
        },
    };
}

function getDefaultCountry(module, popularCountry) {
    const countries = swSettings.components[module].allowedCountries;
    const defaults = [999, 840];
    if (popularCountry && _.find(countries, { id: Number(popularCountry) })) {
        return Number(popularCountry);
    } else if (_.find(countries, { id: defaults[0] })) {
        return defaults[0];
    } else if (_.find(countries, { id: defaults[1] })) {
        return defaults[1];
    } else {
        return countries[0].id;
    }
}

export function getCustomCategoryHash(filters) {
    if (filters && filters.category && filters.category.indexOf("*") !== -1) {
        return categoryService.getCategory(filters.category).categoryHash;
    }
    return undefined;
}

export function trackEvents(resourceName, category, action, name = "") {
    allTrackers.trackEvent(category, action, `${resourceName}/${name}`);
}

export function onPaging(resourceName, page) {
    allTrackers.trackEvent("Pagination", "click", `${resourceName}/${page}`);
}

function getPopularFilters() {
    const counters = {
        customCategories: {
            countries: {},
        },
        keywordGroups: {
            countries: {},
        },
        trendingWebsites: {
            countries: {},
            categories: {},
        },
        trendingApps: {
            countries: {},
            categories: {},
            stores: {},
        },
        trendingKeywords: {
            countries: {},
            categories: {},
        },
    };

    const recents = (window as any).similarweb.config.userData.recent;
    recents.forEach((item) => {
        let catWeight = 1;
        let countryWeight = item.data.country === 999 ? 0.5 : 1; // WorldWide weighs 0.5 point
        const country = item.data.country;
        const category = item.data.category;

        if (item.data.type === "website") {
            const twCountry = counters.trendingWebsites.countries[country];
            const twCategory = counters.trendingWebsites.categories[category];
            counters.trendingWebsites.countries[country] = twCountry
                ? twCountry + countryWeight
                : countryWeight;
            counters.trendingWebsites.categories[category] = twCategory
                ? twCategory + catWeight
                : catWeight;
        } else if (item.data.type === "industry" && category) {
            if (category.startsWith("*")) {
                catWeight = 2;
            } // custom category weighs 2 points
            const ccCountry = counters.customCategories.countries[country];
            const twCountry = counters.trendingWebsites.countries[country];
            const twCategory = counters.trendingWebsites.categories[category];
            counters.customCategories.countries[country] = ccCountry
                ? ccCountry + countryWeight
                : countryWeight;
            counters.trendingWebsites.countries[country] = twCountry
                ? twCountry + countryWeight
                : countryWeight;
            counters.trendingWebsites.categories[category] = twCategory
                ? twCategory + catWeight
                : catWeight;
        } else if (item.data.type === "app") {
            const taCountry = counters.trendingApps.countries[country];
            const taCategory = counters.trendingApps.categories[category];
            const taStore = counters.trendingApps.stores[item.data.appStore];
            counters.trendingApps.countries[country] = taCountry
                ? taCountry + countryWeight
                : countryWeight;
            counters.trendingApps.categories[category] = taCategory
                ? taCategory + catWeight
                : catWeight;
            counters.trendingApps.stores[item.data.appStore] = taStore ? taStore + 1 : 1;
        } else if (item.data.type === "keyword") {
            if (country === "999") {
                countryWeight = 0;
            } // ignore worldwide on keyword analysis
            const kgCountry = counters.keywordGroups.countries[country];
            const twCountry = counters.trendingWebsites.countries[country];
            counters.keywordGroups.countries[country] = kgCountry
                ? kgCountry + countryWeight
                : countryWeight;
            counters.trendingWebsites.countries[country] = twCountry
                ? twCountry + countryWeight
                : countryWeight;
        } else if (item.data.type === "appCategory") {
            const taCountry = counters.trendingApps.countries[country];
            const taCategory = counters.trendingApps.categories[category];
            counters.trendingApps.countries[country] = taCountry
                ? taCountry + countryWeight
                : countryWeight;
            counters.trendingApps.categories[category] = taCategory
                ? taCategory + catWeight
                : catWeight;
        }
    });

    counters.trendingKeywords = counters.trendingWebsites; // trendingKeywords has the exact properties of trendingWebsites

    return {
        customCategories: {
            country: getMaxKey(counters.customCategories.countries),
        },
        keywordGroups: {
            country: getMaxKey(counters.keywordGroups.countries),
        },
        trendingWebsites: {
            country: getMaxKey(counters.trendingWebsites.countries),
            category: getMaxKey(counters.trendingWebsites.categories),
        },
        trendingApps: {
            country: getMaxKey(counters.trendingApps.countries),
            category: getMaxKey(counters.trendingApps.categories),
            store: getMaxKey(counters.trendingApps.stores),
        },
        trendingKeywords: {
            country: getMaxKey(counters.trendingKeywords.countries),
            category: getMaxKey(counters.trendingKeywords.categories),
        },
    };
}
