/* eslint-disable @typescript-eslint/camelcase */
import { swSettings } from "common/services/swSettings";
import * as _ from "lodash";
import { PageId } from "userdata";
import { IConnectedAccountsService } from "../connectedAccounts.service";
import { IComponent } from "../../@types/ISwSettings";
import { Injector } from "common/ioc/Injector";
import * as ITrack from "@similarweb/sw-track";
import swLog from "@similarweb/sw-log";
import { IDashboardService } from "../../components/dashboard/services/DashboardService";
import { IDashboard } from "../../components/dashboard/services/IDashboard";
import { chosenItems } from "common/services/chosenItems";
import { UserCustomCategoryService } from "services/category/userCustomCategoryService";
import ABService from "services/ABService";
import { CookieManager } from "components/cookie-manager/CookieManager";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

/**
 *  Category divider
 *  Industry Analysis: "Arts_and_Entertainment~Fashion_and_Modeling"
 *  App Category Analysis: "Games > Educational"
 * @type {RegExp}
 */
const CATEGORY_DIVIDER = /~| > |\//;

interface IStateParams {
    [key: string]: string;
}

type ICustomUrlBuilder = (pageId: PageId, params: IStateParams) => ITrack.ICustomDimensionData;

let locale = "";

const cookieManager: CookieManager = new CookieManager();

/**
 * resolve the builder
 * @param {string} type
 * @returns {ICustomUrlBuilder}
 */
function getBuilder(type: string): ICustomUrlBuilder {
    switch (type) {
        case "apps":
            return appsBuilder;
        case "appAnalysis":
            return appsBuilder;
        case "topapps":
            return topappsBuilder;
        case "industryAnalysis":
        case "Market Research":
            return industryAnalysisBuilder;
        case "keywordAnalysis":
        case "Digital Marketing - Keywords":
            return keywordsBuilder;
        case "keywords":
            return googlePlayKeywords;
        case "website":
        case "Digital Marketing":
        case "websiteAnalysis":
            return websiteBuilder;
        case "dashboard":
            return dashboardBuilder;
        case "connectedAccounts":
            return connectedAccountsBuilder;
        case "DeepInsights":
            return deepInsightsBuilder;
        case "forbiddenState":
            return forbiddenStateBuilder;
        default:
            return commonBuilder;
    }
}

/**
 * build
 * @param {string} type
 * @param {PageId} pageId
 * @param params
 * @param {IComponent} component
 * @returns {ITrack.ICustomDimensionData}
 */
export const build = (
    type: string,
    pageId: PageId,
    params: any,
    component: IComponent,
): ITrack.ICustomDimensionData => {
    const transformFunc = getBuilder(type);

    try {
        const customUrlObj: ITrack.ICustomDimensionData = transformFunc(pageId, params);
        const notPermitted =
            !component || component.isDemo || component.isDisabled || component.tableResults === 0;

        if (notPermitted) {
            customUrlObj.query.not_permitted = true;
        }
        return customUrlObj;
    } catch (e) {
        swLog.exception("Error in CustomUrlBuilderService", e);
        try {
            return commonBuilder(pageId, params);
        } catch (e) {
            swLog.exception("Error in CustomUrlBuilderService", e);
            return null;
        }
    }
};

///////////////
// BUILDERS
///////////////
const removeEmojies = (str) =>
    (str || "").replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, "");

const appsBuilder: ICustomUrlBuilder = (
    pageId: PageId,
    params: IStateParams,
): ITrack.ICustomDimensionData => {
    const appObject = chosenItems.$first();
    const all = chosenItems.$all();

    const query: ITrack.ICustomDimensionQuery = {
        device_os: params.device,
        store: appObject.AppStore ? (appObject.AppStore === "Apple" ? "ios" : "google-play") : null,
    };

    let category: ITrack.ICustomDimensionCategory = null;
    const categoryStr = appObject.Category;

    if (categoryStr) {
        const categoryParts: string[] = categoryStr.split(CATEGORY_DIVIDER);

        category = {
            main_category: categoryParts[0],
            sub_category: categoryParts[1],
        };
    }

    const filters: ITrack.ICustomDimensionFilters = {
        app_mode: (params.mode && params.mode.toLowerCase().split(" ").join("_")) || null,
    };

    const entity: ITrack.ICustomDimensionEntity = {
        entity_id: joinId(all.map((i) => i.Id)),
        //For mobile app name we remove emojies because it breaks database query.
        entity_name: joinName(all.map((i) => removeEmojies(i.Title))),
    };

    return withCommon(pageId, params, { query, category, filters, entity });
};

const topappsBuilder: ICustomUrlBuilder = (
    pageId: PageId,
    params: IStateParams,
): ITrack.ICustomDimensionData => {
    const query: ITrack.ICustomDimensionQuery = {
        device_os: params.device,
        store: params.store ? (params.store === "Apple" ? "ios" : "google-play") : null,
    };

    let category: ITrack.ICustomDimensionCategory = null;
    const categoryStr = params.category;

    if (categoryStr) {
        const categoryParts: string[] = categoryStr.split(CATEGORY_DIVIDER);

        category = {
            main_category: categoryParts[0],
            sub_category: categoryParts[1],
        };
    }

    const filters: ITrack.ICustomDimensionFilters = {
        app_mode: (params.mode && params.mode.toLowerCase().split(" ").join("_")) || null,
    };

    return withCommon(pageId, params, { query, category, filters });
};

const industryAnalysisBuilder: ICustomUrlBuilder = (
    pageId: PageId,
    params: IStateParams,
): ITrack.ICustomDimensionData => {
    let category: ITrack.ICustomDimensionCategory;
    const categoryStr = params.category;

    if (categoryStr) {
        const categoryParts: string[] = categoryStr.split(CATEGORY_DIVIDER);
        const isCustomCategory = UserCustomCategoryService.isCustomCategory(categoryStr);
        if (!isCustomCategory) {
            category = {
                main_category: categoryParts[0],
                sub_category: categoryParts[1],
            };
        } else {
            const customCategory = UserCustomCategoryService.getCustomCategoryByName(
                categoryStr?.slice(1),
            );
            if (customCategory && customCategory.id) {
                category = {
                    custom_category_id: customCategory.id,
                    custom_category_name: customCategory.name,
                };
            } else {
                swLog.serverLogger(
                    `Custom Category not found`,
                    new Error(`Custom Category does not exist: ${categoryStr}`),
                );
                category = {
                    custom_category_id: 0,
                    custom_category_name: "NOTFOUND",
                };
            }
        }
    }

    const filters: ITrack.ICustomDimensionFilters = {
        app_mode: (params.mode && params.mode.toLowerCase().split(" ").join("_")) || null,
    };

    return withCommon(pageId, params, { category, filters });
};

const googlePlayKeywords: ICustomUrlBuilder = (
    pageId: PageId,
    params: IStateParams,
): ITrack.ICustomDimensionData => {
    const category: ITrack.ICustomDimensionCategory = {
        main_category: params.keyword,
        sub_category: null,
    };
    return withCommon(pageId, params, { category });
};

const keywordsBuilder: ICustomUrlBuilder = (
    pageId: PageId,
    params: IStateParams,
): ITrack.ICustomDimensionData => {
    const { keyword, keywordGroupId } = params;
    if (!keyword && !keywordGroupId) return withCommon(pageId, params, {});
    let category: ITrack.ICustomDimensionCategory;

    const keywordGroup = keyword
        ? keywordsGroupsService.findGroupById(keyword.substring(1))
        : keywordsGroupsService.findGroupById(keywordGroupId);

    if (keywordGroup && Object.values(keywordGroup).length) {
        if (keywordGroup && keywordGroup.Id) {
            category = {
                custom_category_id: keywordGroup.Id,
                custom_category_name: keywordGroup.Name,
            };
        } else {
            swLog.serverLogger(
                `Keyword Group not found`,
                new Error(`Keyword Group does not exist: ${keywordGroup}`),
            );
            category = {
                custom_category_id: 0,
                custom_category_name: "NOTFOUND",
            };
        }
    } else {
        category = {
            main_category: params.keyword,
            sub_category: null,
        };
    }

    return withCommon(pageId, params, { category });
};

const deepInsightsBuilder: ICustomUrlBuilder = (
    pageId: PageId,
    params: IStateParams,
): ITrack.ICustomDimensionData => {
    const custom_data: ITrack.ICustomDimensionCustomData = {
        di_types: params.types,
    };

    return withCommon(pageId, params, { custom_data });
};

const websiteBuilder: ICustomUrlBuilder = (
    pageId: PageId,
    params: IStateParams,
): ITrack.ICustomDimensionData => {
    const chosenSites: any = Injector.get("chosenSites");
    const sites: string[] = chosenSites.get();
    const siteInfo = chosenSites.getInfo(sites[0]);

    const entity: ITrack.ICustomDimensionEntity = {
        entity_id: joinId(sites),
        entity_name: joinName(sites),
    };

    const query: ITrack.ICustomDimensionQuery = {
        country: parseInt(params.country) || undefined,
        date_range: params.duration,
    };

    let category: ITrack.ICustomDimensionCategory = null;

    if (siteInfo && siteInfo.category) {
        const categoryParts: string[] = siteInfo.category.split(CATEGORY_DIVIDER);

        category = {
            main_category: categoryParts[0],
            sub_category: categoryParts[1],
            custom_category_id: null,
        };
    }
    const filters: ITrack.ICustomDimensionFilters = {
        domain_type: getDomainType(params.isWWW),
        web_source: getWebSourceType(params.state || params.webSource),
    };

    const custom_data: ITrack.ICustomDimensionCustomData = {
        keywords_filters: params.Keywords_filters,
    };

    _.forEach(params, function (value, key) {
        if (key.indexOf("_orderby") > -1) {
            query.order_by = value;
        } else if (key.indexOf("_page") > -1) {
            filters.page_number = parseInt(value) || undefined;
        }
    });

    return withCommon(pageId, params, {
        entity,
        category,
        query,
        filters,
        custom_data,
    });
};

const dashboardBuilder: ICustomUrlBuilder = (
    pageId: PageId,
    params: IStateParams,
): ITrack.ICustomDimensionData => {
    const dashboardService: IDashboardService = Injector.get("dashboardService");
    let category: ITrack.ICustomDimensionCategory;

    switch (pageId.subSection) {
        case "exist": // existing dashboard
        case "created": // created dashboard
            const dashboard: IDashboard = dashboardService.getDashboardById(params.dashboardId);
            if (dashboard) {
                category = {
                    custom_category_id: dashboard.id,
                    custom_category_name: dashboard.title,
                };
            } else {
                category = {
                    custom_category_id: params.dashboardId,
                    custom_category_name: "",
                };
            }
            break;
        case "new": // new dashboard page
            category = null;
    }

    return withCommon(pageId, params, {
        category,
    });
};

const connectedAccountsBuilder: ICustomUrlBuilder = (pageId: PageId, params: IStateParams) => {
    const swConnectedAccountsService: IConnectedAccountsService = Injector.get(
        "swConnectedAccountsService",
    );

    const res = appsBuilder(pageId, params);
    res.custom_data = res.custom_data || {};
    res.custom_data.connected_accounts = swConnectedAccountsService.hasGooglePlayConnectedAccount();

    return res;
};

const forbiddenStateBuilder: ICustomUrlBuilder = (pageId: PageId, params: IStateParams) => {
    return withCommon(pageId, params, { query: { not_permitted: true } });
};

/////////////
// HELPERS
/////////////
const getABTestData = () => {
    if (ABService.isVwoRunning()) {
        const { experimentId, variationName, variationId } = ABService.getABTestData();
        if (experimentId) {
            return {
                ab_test_name: `VWO-${experimentId}`,
                ab_test_value: variationName,
                ab_test_variation_id: variationId,
            };
        } else return {};
    }
    return {};
};

function commonBuilder(pageId: PageId, params: IStateParams) {
    let query: ITrack.ICustomDimensionQuery, filters: ITrack.ICustomDimensionFilters;

    if (!_.isEmpty(params)) {
        query = {
            country: parseInt(params.country) || undefined,
            date_range: params.duration,
            order_by: params.orderby,
        };

        filters = {
            tab: params.selectedTab || params.tab || undefined,
            page_number: parseInt(params.page) || undefined,
            web_source: getWebSourceType(params.webSource),
        };
    }
    return {
        page_id: getPageId(pageId),
        path: getPath(pageId, params),
        identity: getIdentity(),
        is_sw_user: getIsSwUser(),
        lang: getLocale(),
        query,
        filters,
    };
}

function withCommon<TSource1, TSource2, TSource3>(
    pageId: PageId,
    params: IStateParams,
    source1: TSource1,
    source2?: TSource2,
    source3?: TSource3,
) {
    return _.merge(
        {},
        { custom_data: getABTestData() },
        commonBuilder(pageId, params),
        source1,
        source2,
        source3,
    );
}

function getIdentity(): ITrack.ICustomDimensionIdentity {
    const user = swSettings.user;

    if (user.impersonateSource) {
        return {
            subscription_id: null,
            base_product: null,
            user_id: user.impersonateSource.id,
            account_id: null,
            email: user.impersonateSource.username,
        };
    }

    return {
        subscription_id: user.subscription,
        base_product: user.plan,
        user_id: user.id,
        account_id: user.accountId,
        email: user.username,
    };
}

export function getIsSwUser() {
    const user = swSettings.user;
    return user.impersonateSource != null || user.username.endsWith("@similarweb.com");
}

export function getIsAutomationUser() {
    const user = swSettings.user;
    return user.username.startsWith("galil+pro") && user.username.endsWith("@similarweb.com");
}

function getPageId(pageId: PageId) {
    return pageId.pageId || `${pageId.section}-${pageId.subSection}-${pageId.subSubSection}`;
}

function getPath(pageId: PageId, params): ITrack.ICustomDimensionPath {
    return {
        section: _.isFunction(pageId.section) ? pageId.section(params) : pageId.section,
        sub_section: _.isFunction(pageId.subSection)
            ? pageId.subSection(params)
            : pageId.subSection,
        sub_sub_section: _.isFunction(pageId.subSubSection)
            ? pageId.subSubSection(params)
            : pageId.subSubSection,
        page_id: getPageId(pageId),
    };
}

function getDomainType(type): ITrack.DOMAIN_TYPE {
    switch (type) {
        case "*":
            return "WITH_SUBDOMAINS";
        case "-":
            return "WITHOUT_SUBDOMAINS";
        default:
            return undefined;
    }
}

function getWebSourceType(type): ITrack.WEB_SOURCE {
    if (!_.isString(type)) return undefined;

    switch (type.toLowerCase()) {
        case "total":
            return "TOTAL";
        case "desktop":
            return "DESKTOP";
        case "mobile":
        case "mobileweb":
            return "MOBILEWEB";
        default:
            return undefined;
    }
}

function getLocale() {
    if (!locale) {
        locale = cookieManager.getCookie("locale") || "en-us";
    }
    return locale;
}

const joinId = (arr) => arr.join(",");
const joinName = (arr) => arr.join(" | ");
