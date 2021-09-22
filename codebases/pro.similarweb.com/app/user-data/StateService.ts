import angular from "angular";
import * as _ from "lodash";

import {
    IStateObject,
    AppStore,
    StateObjectType,
    PageId,
    AppStoreStr,
    IBaseDataObject,
    IFavoriteObject,
    IRecentObject,
} from "userdata";
import { swSettings } from "common/services/swSettings";
import { Injector } from "common/ioc/Injector";
import categoryService from "common/services/categoryService";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

export class StateService {
    private swSettings = swSettings;
    constructor(private swNavigator: any) {}

    /* Private */
    private HASH_DELIMITER = "_";

    private PAGEID_DEFAULTS = {
        websiteDefaultPageId: [
            {
                pageId: {
                    section: "website",
                    subSection: "worldwideOverview",
                    subSubSection: null,
                },
                pageName: "analysis.worldwideoverview.title",
            },
        ],
        appDefaultPageId: [
            {
                pageId: {
                    section: "apps",
                    subSection: "overview",
                    subSubSection: "performance",
                },
                pageName: "app.performance.title",
            },
        ],
    };

    private websiteDefaultParams = this.swSettings.components.WebAnalysis.defaultParams;
    private appDefaultParams = this.swSettings.components.AppRanks.defaultParams;
    private industryDefaultParams = this.swSettings.components.IndustryAnalysis.defaultParams;
    private appCategoryDefaultParams = this.swSettings.components.TopApps.defaultParams;

    private websiteDefault: IStateObject = {
        type: "website",
        mainItem: "cnn.com",
        comparedItems: [],
        country: this.websiteDefaultParams.country,
        duration: this.websiteDefaultParams.duration,
        pageId: {
            section: "website",
            subSection: "worldwideOverview",
            subSubSection: null,
        },
    };

    private virtualDefault: IStateObject = {
        type: "virtual",
        country: this.websiteDefaultParams.country,
        duration: this.websiteDefaultParams.duration,
        mainItem: "",
        domains: [],
        pageId: {
            section: "website",
            subSection: "audience",
            subSubSection: "overview",
        },
    };

    private appDefault: IStateObject = {
        type: "app",
        mainItem: "",
        appStore: 0,
        country: this.appDefaultParams.country,
        duration: this.appDefaultParams.duration,
        pageId: {
            section: "apps",
            subSection: "overview",
            subSubSection: this.appDefaultParams.pageUrl,
        },
    };

    private industryDefault: IStateObject = {
        mainItem: "",
        type: "industry",
        country: this.industryDefaultParams.country,
        duration: this.industryDefaultParams.duration,
        webSource: "Desktop",
        pageId: {
            section: "industry",
            subSection: "overview",
            subSubSection: "overview",
        },
    };

    private appCategoryDefault: IStateObject = {
        mainItem: "",
        type: "appCategory",
        store: this.appCategoryDefaultParams.store,
        country: this.appCategoryDefaultParams.country,
        category: this.appCategoryDefaultParams.category,
        device: this.appCategoryDefaultParams.device,
        mode: this.appCategoryDefaultParams.mode,
        pageId: {
            section: "topapps",
            subSection: "category",
            subSubSection: "categoryanalysis",
        },
    };

    private conversionIndustryDefault: IStateObject = {
        mainItem: "",
        type: "conversionIndustry",
        country: 840,
        category: "",
        pageId: {
            section: "DeepInsights",
            subSection: "buyerjourney",
            subSubSection: "Category conversion overview",
        },
    };

    private defaults: { [key: string]: IStateObject } = {
        website: this.websiteDefault,
        virtual: this.virtualDefault,
        app: this.appDefault,
        industry: this.industryDefault,
        appCategory: this.appCategoryDefault,
        conversionIndustry: this.conversionIndustryDefault,
    };

    private persistentProperties: {
        [key: string]: { serialize: string[]; deSerialize: string[] };
    } = {
        website: {
            serialize: [
                "type",
                "mainItem",
                "comparedItems",
                "duration",
                "comparedDuration",
                "country",
                "pageId",
            ],
            deSerialize: ["key", "isWWW", "country", "duration"],
        },
        virtual: {
            serialize: ["type", "mainItem", "comparedItems", "duration", "country", "pageId"],
            deSerialize: ["key", "isWWW", "country", "duration"],
        },
        app: {
            serialize: [
                "type",
                "mainItem",
                "comparedItems",
                "appStore",
                "duration",
                "country",
                "pageId",
            ],
            deSerialize: ["appId", "country", "duration"],
        },
        keyword: {
            serialize: ["type", "mainItem", "duration", "country", "pageId", "keyword"],
            deSerialize: ["duration", "country", "keyword"],
        },
        industry: {
            serialize: [
                "type",
                "mainItem",
                "duration",
                "country",
                "pageId",
                "category",
                "webSource",
            ],
            deSerialize: ["country", "duration", "category", "webSource"],
        },
        appCategory: {
            serialize: [
                "type",
                "store",
                "country",
                "country",
                "category",
                "device",
                "mode",
                "pageId",
            ],
            deSerialize: ["store", "country", "country", "category", "device", "mode"],
        },
        conversionIndustry: {
            serialize: [
                "type",
                "mainItem",
                "duration",
                "country",
                "pageId",
                "industry",
                "category",
            ],
            deSerialize: ["country", "duration", "industry", "category"],
        },
    };

    /**
     * Generate a hash from an object
     * @param obj Object
     * @returns String
     */
    private getObjectHash(obj): string {
        if (!obj) {
            return "";
        }
        let hash = "";
        if (_.isArray(obj)) {
            hash += obj.join(this.HASH_DELIMITER);
        } else if (_.isObject(obj)) {
            _.each(_.values(obj), (val) => {
                hash += this.HASH_DELIMITER + this.getObjectHash(val);
            });
        } else {
            hash += obj.toString();
        }

        return hash === this.HASH_DELIMITER ? "" : hash;
    }

    /**
     * Generate a hash from state object
     * @param stateObj Object  The state object
     * @param hashProperties Array  Array of properties which should be in the hash
     * @returns String
     */
    private getHash(stateObj: IStateObject, hashProperties: string[]): string {
        const defaultProperties = this.persistentProperties[stateObj.type].serialize;
        const properties =
            angular.isArray(hashProperties) && hashProperties.length
                ? hashProperties
                : defaultProperties;
        let hash = "";
        _.each(properties, (prop) => {
            hash += this.HASH_DELIMITER + this.getObjectHash(stateObj[prop]);
        });

        return hash;
    }

    /**
     * parse an appId
     * "0_com.sq.dragonsworld"
     * "1_5678765986,345345435,"
     * @param appId
     * @returns [number, string, string[]]
     */
    private parseAppId(appId: string): [number, string, string[]] {
        if (!appId) return null;
        const parts = appId.match(/([01])_(.*)/);
        const appStoreInt = parseInt(parts[1]);
        const appsArray = parts[2].split(",");
        return [appStoreInt, appsArray.shift(), appsArray];
    }

    /**
     * checks whether serialized state has compared apps or websites
     * @param serializedState
     * @returns {boolean}
     */
    private isCompare(serializedState: IStateObject) {
        return (
            angular.isArray(serializedState.comparedItems) &&
            serializedState.comparedItems.length > 0
        );
    }

    /**
     * validate serialized object structure
     * @param serializedObj
     * @returns {{missing, extra}} if the validation passed, object if there are missing and/or extra properties
     */
    private validateSerializedObject(
        serializedObj: IStateObject,
    ): { missing: string[]; extra: string[] } {
        const validProperties = this.persistentProperties[serializedObj.type].serialize;
        const missing = _.difference(validProperties, _.keys(serializedObj));
        const extra = _.difference(_.keys(serializedObj), validProperties);
        if (missing.length > 0 || extra.length > 0) {
            return { missing: missing, extra: extra };
        }
    }

    /* Public */

    /**
     * serailzes the current state to a persistent object
     * @returns {*}
     */
    public serializeState(pageSettings = null) {
        // for favorites and recent
        let serializedObj: IStateObject;
        const params = (pageSettings && pageSettings.params) || this.swNavigator.getParams();
        const state = (pageSettings && pageSettings.state) || this.swNavigator.current();
        if (!params || _.isEmpty(params)) return null;

        switch (true) {
            case this.swNavigator.isAppAnalysis(state):
                const parsedAppId = this.parseAppId(params.appId);
                serializedObj = {
                    type: "app",
                    mainItem: parsedAppId[1],
                    comparedItems: parsedAppId[2],
                    appStore: parsedAppId[0],
                    duration: params.duration,
                    country: parseInt(params.country),
                };
                break;
            case this.swNavigator.isKeywordAnalysis(state):
                serializedObj = {
                    type: "keyword",
                    mainItem: params.keyword.startsWith("*")
                        ? keywordsGroupsService.findGroupById(params.keyword.substring(1)).Name
                        : params.keyword,
                    category: params.keyword.startsWith("*")
                        ? keywordsGroupsService.findGroupByName(params.keyword).Id
                        : null,
                    keyword: params.keyword,
                    duration: params.duration,
                    country: parseInt(params.country),
                };
                break;
            case this.swNavigator.isIndustryAnalysis(state):
                serializedObj = {
                    type: "industry",
                    category: categoryService.categoryQueryParamToCategoryObject(params.category)
                        ?.categoryId,
                    mainItem: params.category,
                    duration: params.duration,
                    country: parseInt(params.country),
                    webSource: params.webSource || "Desktop",
                };
                break;
            case this.swNavigator.isAppCategory(state):
                serializedObj = {
                    type: "appCategory",
                    store: params.store,
                    country: parseInt(params.country),
                    category: params.category,
                    device: params.device,
                    mode: params.mode,
                    mainItem: params.category,
                };
                break;
            case this.swNavigator.isIndustryConversion(state):
                serializedObj = {
                    type: "conversionIndustry",
                    country: parseInt(params.country),
                    industry: params.industry, // parent
                    category: params.category, // child
                    duration: params.duration,
                    mainItem: params.industry,
                };
                break;
            case this.swNavigator.isLeadGenerator(state):
                return null;
            default:
                if (!params.key && !params.category) return null;
                const siteParts: string[] = params.key.split(",");
                const mainSite: string = siteParts[0];
                const isVirtual = mainSite[0] === "*";
                serializedObj = {
                    type: isVirtual ? "virtual" : "website",
                    mainItem: isVirtual ? mainSite.substr(1) : mainSite,
                    comparedItems: _.tail(siteParts) as string[],
                    duration: params.duration,
                    country: parseInt(params.country),
                    comparedDuration: params.comparedDuration,
                };
                break;
        }
        serializedObj.pageId = state ? state.pageId : this.swNavigator.getCurrentPageId();
        serializedObj.hideFromRecents = state ? state.hideFromRecents : false;
        if (state && state.origin) {
            serializedObj.origin = state.origin;
        }

        // validate serialized object
        const validationResult = this.validateSerializedObject(serializedObj);
        if (validationResult) {
            let msg = "";
            if (validationResult.extra.length > 0) {
                msg +=
                    serializedObj.type +
                    " serialized object should not contain " +
                    validationResult.extra.join(",") +
                    "\n";
            }
            if (validationResult.missing.length > 0) {
                msg +=
                    serializedObj.type +
                    " serialized object should contain " +
                    validationResult.missing.join(",");
            }
            //throw new Error(msg);
        }

        return serializedObj;
    }

    /**
     * deserialize a state object to a URL
     * @param serializedState
     * @returns string url
     */
    public deSerializeState(serializedState: IStateObject) {
        const pageId = serializedState.pageId;
        if (!pageId) return "";

        const params = this.toNavigationParams(serializedState);

        const state: any = _.find(this.swNavigator.allStates, {
            section: pageId.section,
            subSection: pageId.subSection,
            subSubSection: pageId.subSubSection,
        });

        return this.swNavigator.getStateUrl(
            state.name,
            Object.assign(params, state.defaultQueryParams),
        );
    }

    public toNavigationParams(serializedState: IStateObject): any {
        const comparedStr = this.isCompare(serializedState)
            ? "," + serializedState.comparedItems.join()
            : "";

        switch (serializedState.type) {
            case "website":
                return {
                    key: serializedState.mainItem + comparedStr,
                    isWWW: "*",
                    country: serializedState.country,
                    duration: serializedState.duration,
                    comparedDuration: serializedState.comparedDuration,
                };

            case "virtual":
                return {
                    key: "*" + serializedState.mainItem + comparedStr,
                    isWWW: "*",
                    country: serializedState.country,
                    duration: serializedState.duration,
                };

            case "app":
            case "keyword":
                return {
                    appId: serializedState.appStore + "_" + serializedState.mainItem + comparedStr,
                    country: serializedState.country,
                    duration: serializedState.duration,
                    keyword: serializedState.keyword,
                };
            case "industry":
                return {
                    category: serializedState.mainItem,
                    country: serializedState.country,
                    duration: serializedState.duration,
                    webSource: serializedState.webSource,
                };
            case "appCategory":
                return {
                    store: serializedState.store,
                    country: serializedState.country,
                    category: serializedState.category,
                    device: serializedState.device,
                    mode: serializedState.mode,
                };
            default:
                return {};
        }
    }

    public applyDefaults<T extends IBaseDataObject>(favoritesOrRecentObj: T[]): T[] {
        _.each(favoritesOrRecentObj, (obj: T, index: number) => {
            favoritesOrRecentObj[index].data = this.applyStateDefaults(obj.data);
        });
        return favoritesOrRecentObj || [];
    }

    public applyStateDefaults(stateObj: IStateObject): IStateObject {
        let defaultParams = {};
        if (stateObj.pageId) {
            const navState = this.swNavigator.getStateForPageId(stateObj.pageId);
            const component = this.swNavigator.getConfigId(navState);
            defaultParams =
                component && this.swSettings.components[component]
                    ? this.swSettings.components[component].defaultParams
                    : {};
        }
        return Object.assign({}, this.defaults[stateObj.type], defaultParams, stateObj);
    }

    public isEqual(stateObj1: IStateObject, stateObj2: IStateObject): boolean {
        if (stateObj1.type !== stateObj2.type) {
            return false;
        }
        const params: string[] = this.persistentProperties[stateObj1.type].serialize;

        return !_.some(params, function (param: any) {
            let val1 = stateObj1[param],
                val2 = stateObj2[param];
            if (param === "appStore") {
                [val1, val2] = [val1, val2].map((val) =>
                    /^\d$/.test(val) ? +val : /google/i.test(val) ? 0 : 1,
                );
            }
            return !_.isEqual(val1, val2);
        });
    }

    public getUniques(items: IBaseDataObject[], hashProperties: string[]) {
        const hashMap: { [key: string]: number } = {};
        const uniques: IBaseDataObject[] = [];
        _.each(items, (item: IBaseDataObject, index: number) => {
            const hash = this.getHash(item.data, hashProperties),
                existingIndex = hashMap[hash];
            if (!_.isUndefined(existingIndex)) {
                if (
                    (<IFavoriteObject>item).addedTime >
                        (<IFavoriteObject>uniques[existingIndex]).addedTime ||
                    (<IRecentObject>item).updatedTime >
                        (<IRecentObject>uniques[existingIndex]).updatedTime
                ) {
                    uniques[existingIndex] = item;
                }
            } else {
                uniques.push(item);
                hashMap[hash] = uniques.length - 1;
            }
        });

        return uniques;
    }

    //mainItem - 'websites'/'virtual' - item.name; 'app' - item.id
    public buildItemUrl(
        itemType: StateObjectType,
        mainItem: string,
        comparedItems?: string[],
        itemStore?: AppStoreStr,
        pageId?: PageId,
    ) {
        let stateObject: IStateObject;
        const _pageId: PageId = pageId
            ? pageId
            : itemType === "app"
            ? this.PAGEID_DEFAULTS.appDefaultPageId[0].pageId
            : this.PAGEID_DEFAULTS.websiteDefaultPageId[0].pageId;

        const defaults: IStateObject = {
            type: itemType,
            mainItem: mainItem,
            comparedItems: comparedItems,
            pageId: _pageId,
        };
        if (itemStore) {
            defaults.appStore = itemStore == "google" ? AppStore.Google : AppStore.Apple;
        }
        stateObject = this.applyStateDefaults(defaults);

        return this.deSerializeState(stateObject);
    }
}

angular.module("sw.common").factory("stateService", (swNavigator) => {
    return new StateService(swNavigator);
});
