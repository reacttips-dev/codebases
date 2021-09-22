import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import _ from "lodash";
import dayjs from "dayjs";
import DurationService from "services/DurationService";
import { DefaultFetchService, NoCacheHeaders } from "services/fetchService";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";

interface DefaultStateDetails {
    defaultStateOverride?: string;
}

const fetchService = DefaultFetchService.getInstance();

export async function fetchAll(state) {
    return await Promise.all([
        fetchSavedProperties(),
        swSettings.components.Home.resources.IsCCAllowed
            ? fetchCustomCategories(state.boxes[`customCategoriesBox`])
            : undefined,
        !swSettings.components.KeywordAnalysisOP.isDisabled
            ? fetchKeywordGroups(state.boxes[`keywordGroupsBox`])
            : undefined,
        fetchTrendingWebsites(state.boxes[`trendingWebsitesBox`]),
        fetchTrendingApps(state.boxes[`trendingAppsBox`]),
        fetchTrendingKeywords(state.boxes[`trendingKeywordsBox`]),
    ]).catch((err) => {
        throw new Error(
            `${err} or an implementation error: all promises should implement .then() & .catch() methods`,
        );
    });
}

export async function fetchSavedProperties() {
    return await fetchService
        .get(
            "/api/userdata/favorites",
            {
                display: true,
            },
            {
                headers: NoCacheHeaders,
            },
        )
        .then(onSuccess)
        .catch(onFailure);
}

export async function fetchCustomCategories(filters) {
    return await fetchService
        .get(
            "/api/userdata/customIndustry",
            {
                engagementData: true,
                country: filters.country,
                orderByLastUpdated: true,
            },
            {
                headers: NoCacheHeaders,
            },
        )
        .then(onSuccess)
        .catch(onFailure);
}

export async function fetchKeywordGroups(filters) {
    return await fetchService
        .get(
            "/api/userdata/KeywordGroups",
            {
                engagementData: true,
                country: filters.country,
                orderByLastUpdated: true,
            },
            {
                headers: NoCacheHeaders,
            },
        )
        .then(onSuccess)
        .catch(onFailure);
}

export async function fetchTrendingWebsites(filters) {
    const metric = "MobileWeb";
    const duration = DurationService.getDurationData(filters.duration, null, "IATopWebsites")
        .forAPI;
    const hasMobileWebData =
        swSettings.allowedDuration(filters.duration, metric) &&
        swSettings.allowedCountry(filters.country, metric);

    return await fetchService
        .get("/widgetApi/TopSitesExtended/TopTrendingWebsites/Table", {
            country: filters.country,
            keys: `$${filters.category}`,
            orderBy: "Change desc",
            from: duration.from,
            to: duration.to,
            latest: "1m",
            webSource: hasMobileWebData ? "Total" : "Desktop",
            customCategoryHash: filters.customCategoryHash,
            pageSize: 5,
            page: 1,
            isWindow: false,
            includeSubDomains: true,
        })
        .then(onSuccess)
        .catch(onFailure);
}

export async function fetchTrendingApps(filters) {
    return await fetchService
        .get(`/widgetApi/AppCategoryLeaderboard${filters.store}/AppCategoryTrendingApps/Table`, {
            country: filters.country,
            keys: filters.category,
            appMode: "Top Free",
            device: filters.store === "Google" ? "AndroidPhone" : "iPhone",
            store: filters.store,
            pageSize: 5,
            page: 1,
        })
        .then(onSuccess)
        .catch(onFailure);
}

export async function fetchTrendingKeywords(filters) {
    const duration = DurationService.getDurationData(
        filters.duration,
        null,
        "ResearchHomepageTopKeywords",
    ).forAPI;
    return await fetchService
        .get("/widgetApi/ResearchHomepageTopKeywords/SearchKeywordsTopTrending/Table", {
            country: filters.country,
            keys: `$${filters.category}`,
            from: duration.from,
            to: duration.to,
            latest: "1m",
            customCategoryHash: filters.customCategoryHash,
            pageSize: 5,
            page: 1,
        })
        .then(onSuccess)
        .catch(onFailure);
}

export async function fetchKeywordsCategories() {
    return await fetchService.get("/api/TopApps/StoreOptions").then(onSuccess).catch(onFailure);
}

function onSuccess(data) {
    return {
        success: true,
        payload: data,
    };
}

function onFailure(errMsg) {
    return {
        success: false,
        payload: errMsg,
    };
}

function transformCategoriesOrKeywords(key, data) {
    if (!data || !data.length) {
        return [];
    }
    let newData;
    newData = _.uniqBy(data, "Name");

    // limit 25 items max
    if (newData.length > 25) {
        newData = newData.slice(0, 25);
    }

    return newData;
}

export function transformCategories(data, filters) {
    const key = "category";
    const field = "Name";
    const swNavigator = Injector.get("swNavigator") as any;
    const state = "industryAnalysis-overview";
    const defaultParams = swSettings.components[swNavigator.getState(state).configId].defaultParams;
    const newData = data.map((item) => {
        const categoryName = item[field];
        const categoryObject = UserCustomCategoryService.getCustomCategoryByName(categoryName);
        return {
            ...item,
            url: swNavigator.href(state, {
                ...defaultParams,
                ...filters,
                [key]: categoryObject?.forUrl,
            }),
        };
    });
    return transformCategoriesOrKeywords(key, newData);
}

export function transformKeywords(data, filters) {
    const key = "keyword";
    const newData = enrichDataWithUrl(
        data.OwnerGroups,
        "keywordAnalysis-overview",
        filters,
        key,
        "Id",
        "*",
    );
    return transformCategoriesOrKeywords(key, newData);
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function transformSavedProperties(data: any, stateDetails: DefaultStateDetails = null) {
    if (!data || !data.items || !data.items.length) {
        return [];
    }

    const swNavigator = Injector.get("swNavigator") as any;
    const defaultWebsitePageState = "websites-worldwideOverview";
    const defaultAppPageState = "apps-performance";
    const websiteDefaultParams =
        swSettings.components[swNavigator.getState(defaultWebsitePageState).configId].defaultParams;
    const appDefaultParams =
        swSettings.components[swNavigator.getState(defaultAppPageState).configId].defaultParams;
    const stores = { Google: 0, Apple: 1 };
    let result = [];

    data.items.forEach((item) => {
        // sanity
        const itemData = item.data;
        if (!itemData) {
            return;
        }

        const resources = itemData.resources;
        if (!resources) {
            return;
        }

        if (itemData.type === "website" && !_.get(item, "data.comparedItems.length")) {
            result.push({
                Type: itemData.type,
                Name: itemData.mainItem,
                Icon: resources.mainItemFavIcon,
                url: swNavigator.href(
                    stateDetails?.defaultStateOverride ?? defaultWebsitePageState,
                    {
                        ...websiteDefaultParams,
                        key: itemData.mainItem,
                        isWWW: "*",
                        webSource: "Total",
                    },
                ),
                addedTime: item.addedTime,
                Id: item.id,
            });
        } else if (itemData.type === "app" && !_.get(item, "data.comparedItems.length")) {
            // sanity
            const mainItem = resources.mainItem;
            if (!mainItem) {
                return;
            }
            const tooltip = mainItem.tooltip;
            if (!tooltip) {
                return;
            }

            const appId = `${stores[tooltip.appStore]}_${itemData.mainItem}`;

            result.push({
                Id: item.id,
                Type: itemData.type,
                App: itemData.mainItem,
                Name: itemData.mainItem,
                url: swNavigator.href(stateDetails?.defaultStateOverride ?? defaultAppPageState, {
                    ...appDefaultParams,
                    appId,
                }),
                addedTime: item.addedTime,
                Tooltip: {
                    AppStore: tooltip.appStore,
                    Title: tooltip.title,
                    Icon: tooltip.icon,
                    Category: tooltip.category,
                    Author: tooltip.author,
                    Price: tooltip.price,
                },
            });
        }
    });

    result = _.uniqBy(result, "Name").sort((a, b) =>
        dayjs(a.addedTime).isBefore(dayjs(b.addedTime)) ? 1 : -1,
    );

    // limit 25 items max
    if (result.length > 25) {
        result = result.slice(0, 25);
    }

    return result;
}

export function transformTrendingWebsites(data, filters) {
    const metric = "MobileWeb";
    const hasMobileWebPermission = swSettings.components[metric].isAllowed;
    const hasMobileWebData =
        swSettings.allowedDuration(filters.duration, metric) &&
        swSettings.allowedCountry(filters.country, metric);

    const newFilters = {
        ...filters,
        isWWW: "*",
        webSource: hasMobileWebPermission && hasMobileWebData ? "Total" : "Desktop",
    };
    // limit 5 items max
    if (data.Data.length > 5) {
        data.Data = data.Data.slice(0, 5);
    }
    return enrichDataWithUrl(data.Data, "websites-worldwideOverview", newFilters, "key", "Domain");
}

export function transformTrendingApps(data, filters) {
    const prefix = filters.store === "Google" ? "0_" : "1_";
    return enrichDataWithUrl(data.Data, "apps-performance", filters, "appId", "App", prefix);
}

export function transformTrendingKeywords(data, filters) {
    // limit 5 items max
    if (data.Data.length > 5) {
        data.Data = data.Data.slice(0, 5);
    }
    return enrichDataWithUrl(
        data.Data,
        "keywordAnalysis-overview",
        filters,
        "keyword",
        "SearchTerm",
    );
}

function enrichDataWithUrl(data, pageState, filters, urlKey, urlValue, prefix?) {
    const swNavigator = Injector.get("swNavigator") as any;
    const defaultParams =
        swSettings.components[swNavigator.getState(pageState).configId].defaultParams;
    return data.map((item) => ({
        ...item,
        url: swNavigator.href(pageState, {
            ...defaultParams,
            ...filters,
            [urlKey]: prefix ? prefix + item[urlValue] : item[urlValue],
        }),
    }));
}

export const fetchersMap = {
    savedProperties: fetchSavedProperties,
    customCategories: fetchCustomCategories,
    keywordGroups: fetchKeywordGroups,
    trendingWebsites: fetchTrendingWebsites,
    trendingApps: fetchTrendingApps,
    trendingKeywords: fetchTrendingKeywords,
};

export const transformsMap = {
    savedProperties: transformSavedProperties,
    customCategories: transformCategories,
    keywordGroups: transformKeywords,
    trendingWebsites: transformTrendingWebsites,
    trendingApps: transformTrendingApps,
    trendingKeywords: transformTrendingKeywords,
};
