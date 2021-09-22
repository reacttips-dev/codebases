/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { clone, forEach, capitalize, map, isString } from "lodash";
import DurationService, { IDurationObject } from "services/DurationService";
function noop() {}
/* Private */
/*********
 * ApiParamsBuilder
 * @param rawParams
 * @constructor
 */
const ApiParamsBuilder = function (rawParams) {
    /**
     * the raw state params
     * @type {{}}
     * @private
     */
    this._rawParams = clone(rawParams);

    /**
     * the result api params
     * @type {{}}
     * @private
     */
    this._apiParams = {};

    /**
     * track parser invocations
     * @type {{}}
     * @private
     */
    this._invoked = {};
};

/**
 * parser map
 * @type {{key: parser()}}
 */
ApiParamsBuilder.builders = {
    duration: parseDurationForApi,
    category: parseCategoryForApi,
    country: parseCountryForApi,
    appId: parseAppIdForApi,
    filter: parseFilterForApi,
    isWWW: parseIsWwwForApi,
    key: parseKeyForApi,
    keyword: parseKeywordForApi,
    page: parsePageForApi,
};

ApiParamsBuilder.fn = ApiParamsBuilder.prototype;

////////////////////
/// AUTO METHODS
////////////////////
const autoMethods = {
    addAppIdParams: noop,
    addCategoryParams: noop,
    addCountryParams: noop,
    addDurationParams: noop,
    addFilterParams: noop,
    addIsWWWParams: noop,
    addKeyParams: noop,
    addKeywordParams: noop,
    addPageParams: noop,
};
Object.assign(ApiParamsBuilder.fn, autoMethods);
registerParams(ApiParamsBuilder.fn);

/**
 * get the params object
 * @returns {{}}
 */
ApiParamsBuilder.fn.get = function () {
    return clone(this._apiParams);
};

//////////////////
// BULK METHODS
/////////////////
ApiParamsBuilder.fn.addAllParamsForApi = function () {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    forEach(this._rawParams, function (value, key) {
        const builder = ApiParamsBuilder.builders[key];
        // invoke builder
        if (builder) {
            // invoke
            const res = builder.call(self, value);
            // extend param result
            Object.assign(self._apiParams, res);
        } else {
            // copy the rest
            self._apiParams[key] = value;
        }
    });
    return this;
};

ApiParamsBuilder.fn.addSiteParams = function () {
    this.addKeyParams();
    this.addIsWWWParams();
    return this;
};

function registerParams(fn) {
    forEach(ApiParamsBuilder.builders, function (value, key) {
        registerParam(fn, key, value);
    });
}

function registerParam(fn, paramName, builder) {
    const funcName = "add" + capitalize(paramName) + "Params";
    fn[funcName] = function () {
        const value = this._rawParams[paramName];

        if (!this._invoked[paramName] && typeof value !== "undefined") {
            // invoke
            const res = builder.call(this, value);
            // extend param result
            Object.assign(this._apiParams, res);
        }

        this._invoked[paramName] = true;

        return this;
    };
}

/* Public */

/**
 * Used to transform all stateParams for API calls
 * @param rawParams
 * @returns {{}}
 */
function transformParamsForAPI(rawParams: any): any {
    const builder = new ApiParamsBuilder(rawParams);
    builder.addAllParamsForApi();
    return builder.get();
}

/**
 * return a new ApiParamsBuilder
 * @param rawParams
 * @returns {ApiParamsBuilder}
 */
function getApiParamsBuilder(rawParams: any): any {
    return new ApiParamsBuilder(rawParams);
}

// Deprecated, use parseFilterForApi instead
function transformFilterParam(stateParams: { filter: any }): string {
    return parseFilterForApi(stateParams.filter).filter;
}

////////////////////////////////
// PARAM PARSERS (value => object)
///////////////////////////////

/**
 * parse filter
 * @param filter
 * filter can be JSON string or string in format like 'domain;contains;abc'
 * @returns {{filter: string}}
 */
function parseFilterForApi(filter: any): { filter: string } {
    try {
        return {
            filter: map(JSON.parse(filter), function (val, key) {
                const operator = key == "Category" ? "category" : "contains";
                return key + ";" + operator + ';"' + val + '"';
            }).join(),
        };
    } catch (e) {
        return { filter };
    }
}

/**
 * parse is subdomain
 * @param isWWW
 * @returns {{isWWW: boolean}}
 */
function parseIsWwwForApi(isWWW) {
    return isWWW ? { isWWW: isWWW === "-" } : null;
}

/**
 * parse key string
 * @param key
 * @returns {{key: string}}
 */
function parseKeyForApi(key: string) {
    return key ? { key } : null;
}

/**
 * parse mobile app
 * @param rawAppId
 * @returns {{store: string, appId: string}}
 */
function parseAppIdForApi(rawAppId: any): { store: string; appId: string } {
    if (!isString(rawAppId)) return null;

    const parts = rawAppId.match(/([01])_(.*)/);
    const appStoreInt = parseInt(parts[1]);
    const appsArray = parts[2];

    return {
        store: appStoreInt > 0 ? "apple" : "google",
        appId: appsArray,
    };
}

/**
 * parse category
 * @param category
 * @returns {{category: string}}
 */
function parseCategoryForApi(category: any): { category: string } {
    return category ? { category: category.id || category } : null;
}

/**
 * parse Country
 * @param country
 * @returns {{country: *}}
 */
function parseCountryForApi(country: any): { country: any } {
    const countryInt = parseInt(country);
    return countryInt ? { country: countryInt } : null;
}

/**
 * parse keyword
 * @param keyword
 * @returns {{term: string}}
 */
function parseKeywordForApi(keyword) {
    return keyword ? { term: keyword } : null;
}

/**
 * parse page num
 * @param page
 * @returns {{page: number}}
 */
function parsePageForApi(page: any): { page: number } {
    return { page: page || 1 };
}

/**
 *  used to parse url "duration" parameter to "from" and "to" parameters in format of YYYY|MM|DD used for API calls
 * @param duration string
 * @returns {{from: 'YYYY|MM|DD', to: 'YYYY|MM|DD', isWindow: boolean}}
 */
function parseDurationForApi(duration: string): IDurationObject<string> {
    return duration ? DurationService.getDurationData(duration).forAPI : null;
}

/**
 * We define the ApiHelper type with this interface
 * (this improves development experience, in case we pass the apiHelper as a prop/param in components / functions)
 */
export interface IApiHelper {
    transformParamsForAPI: (rawParams: any) => any;
    getApiParamsBuilder: (rawParams: any) => any;
    transformFilterParam(stateParams: { filter: any }): string;
    parseFilterForApi: (
        filter: any,
    ) => {
        filter: string;
    };
    parseAppIdForApi: (
        rawAppId: any,
    ) => {
        store: string;
        appId: string;
    };
    parseCountryForApi: (
        country: any,
    ) => {
        country: number;
    };
    parseCategoryForApi: (
        category: any,
    ) => {
        category: string;
    };
    parseKeywordForApi: (
        keyword: string,
    ) => {
        term: string;
    };
    parseDurationForApi: (duration: any) => IDurationObject<string>;
}

export const apiHelper: IApiHelper = {
    transformParamsForAPI,
    getApiParamsBuilder,
    transformFilterParam,
    parseFilterForApi,
    parseAppIdForApi,
    parseCountryForApi,
    parseCategoryForApi,
    parseKeywordForApi,
    parseDurationForApi,
};
