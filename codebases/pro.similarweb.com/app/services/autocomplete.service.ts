import angular, {
    ICacheFactoryService,
    ICacheObject,
    IHttpPromiseCallbackArg,
    IHttpService,
    IQService,
} from "angular";
import {
    IAutoCompleteAppItem,
    IAutoCompleteCategoryItem,
    IAutoCompleteItem,
    IAutoCompleteKeywordItem,
    IAutoCompleteKeywordResponse,
    IAutoCompleteResponse,
    IAutoCompleteSiteItem,
    IAutoCompleteUniversalResponse,
} from "autocomplete";
import searchTypesHelperService, { SearchTypes } from "common/services/searchTypesHelperService";
import { swSettings } from "common/services/swSettings";
import * as _ from "lodash";
import { ignoreIndustryAnalysisParams } from "routes/industryAnalysisConfig";
import { ignoreWebsiteAnalysisParams } from "routes/websiteStateConfig";
import { AppStore, AppStoreStr, IFavoriteObject } from "userdata";
import { StateService } from "../user-data/StateService";
import { AssetsService } from "./AssetsService";
import { IAutoCompleteRelatedService } from "./autocomplete.related.service";
import { UserCustomCategoryService } from "./category/userCustomCategoryService";
import { FavoritesService } from "services/favorites/favoritesService";
import categoryService from "common/services/categoryService";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

/**
 * Created by dannyr on 20/05/2016.
 */

export interface IAutoCompletePromise {
    promise: angular.IPromise<IAutoCompleteResponse>;
    abort: (reason?: string) => void;
}
export interface IAutoCompleteService {
    getAutoCompleteSuggestions: (
        query: string,
        searchTypeStr: string,
        appStore?: AppStoreStr,
        resultSize?: number,
        excludeList?: string[],
        addUserData?: boolean,
    ) => IAutoCompletePromise;
    getDefaultWebsite: (query: any) => any;
    getCategoriesSection: (query: string) => any;
    getCurrentSection: () => string;
}

angular
    .module("sw.common")
    .factory("autoCompleteService", function (
        $http: IHttpService,
        $cacheFactory: ICacheFactoryService,
        $q: IQService,
        stateService: StateService,
        autoCompleteRelatedService: IAutoCompleteRelatedService,
        swNavigator,
        i18nFilter,
    ) {
        const autoCompleteCache: ICacheObject =
            $cacheFactory.get("autocomplete-cache") || $cacheFactory("autocomplete-cache");

        function findVirtualSites(query) {
            const virtuals = _.filter<IFavoriteObject>(
                FavoritesService.getFavorites().virtualItems,
                (item: IFavoriteObject) => {
                    return item.data.mainItem.toLowerCase().indexOf(query.toLowerCase()) > -1;
                },
            );
            return virtuals;
        }

        function addVirtualSites(items: IAutoCompleteSiteItem[], virtuals: IFavoriteObject[]) {
            virtuals.forEach((item: IFavoriteObject) => {
                items.unshift({
                    type: "virtual",
                    name: item.data.mainItem,
                    isVirtual: true,
                    image: item.data.resources.mainItemFavIcon,
                    url: null,
                });
            });
        }

        function limitResultCount(data: IAutoCompleteResponse, limit) {
            if (_.isArray(data)) {
                const res = data as any[];
                data = _.take(res, limit);
            } else if (_.isObject(data)) {
                const res = data as IAutoCompleteUniversalResponse;
                res.Apps = _.take(res.Apps, limit);
                res.Domains = _.take(res.Domains, limit);
                data = res;
            } else {
                data = {
                    Apps: [],
                    Domains: [],
                    Categories: [],
                    Keywords: [],
                };
            }

            return data;
        }

        function excludeSearchResults(items: IAutoCompleteItem[], excludeList) {
            return items.filter((item: IAutoCompleteItem) => {
                let itemKey: string = null;
                switch (item.type) {
                    case "website":
                    case "virtual":
                        const siteItem = item as IAutoCompleteSiteItem;
                        itemKey = siteItem.isVirtual ? "*" + siteItem.name : siteItem.name;
                        break;
                    case "app":
                        const appItem = item as IAutoCompleteAppItem;
                        itemKey = appItem.id;
                        break;
                }
                return excludeList.indexOf(itemKey) == -1;
            });
        }

        function setDomainUrl(item) {
            // SIM-29004 - remove deep linking params from autocomplete
            const params = { ...swNavigator.getParams(), ...ignoreWebsiteAnalysisParams };
            params.key = item.name;
            if (_.get(swNavigator.current(), "pageId.subSubSection") === "popular") {
                params.selectedSite = item.name;
            }
            item.url =
                swNavigator.isWebsiteAnalysis() && !swNavigator.isHomePage() && !item.isVirtual
                    ? swNavigator.href(swNavigator.current().name, params)
                    : stateService.buildItemUrl(item.type, item.name);
        }

        function setAppUrl(item) {
            const params = swNavigator.getParams();
            const keyAppStore = item.store == "google" ? 0 : 1;
            params.appId = keyAppStore + "_" + item.id;
            item.url =
                swNavigator.isAppAnalysis() && !swNavigator.isHomePage()
                    ? swNavigator.href(swNavigator.current().name, params)
                    : stateService.buildItemUrl(item.type, item.id, [], item.store);
        }

        function setKeywordUrl(item) {
            // the Keywords section, replaces it's URL if it is in the GooglePlayKeywords module
            if (swNavigator.isGooglePlayKeywordAnalysis()) {
                setGooglePlayKeywordUrl(item);
            } else {
                setKeywordAnalysisUrl(item);
            }
        }

        function setKeywordAnalysisUrl(item) {
            const _params = swNavigator.getParams();
            const _itemName = item.Keywords ? "*" + item.Id : item.name;
            item.url =
                swNavigator.isKeywordAnalysis() && !swNavigator.isHomePage()
                    ? swNavigator.href(
                          swNavigator.current().name,
                          angular.merge(_params, {
                              keyword: _itemName,
                              mainItem: _itemName,
                          }),
                      )
                    : swNavigator.href(
                          "keywordAnalysis-overview",
                          angular.merge(swSettings.components.KeywordAnalysis.defaultParams, {
                              keyword: _itemName,
                              mainItem: _itemName,
                          }),
                      );
        }

        function setGooglePlayKeywordUrl(item) {
            const params = swNavigator.getParams();
            item.url =
                swNavigator.isGooglePlayKeywordAnalysis() && !swNavigator.isHomePage()
                    ? swNavigator.href(
                          swNavigator.current().name,
                          angular.merge(params, { keyword: item.name }),
                      )
                    : swNavigator.href(
                          "keywords-analysis",
                          angular.merge(swSettings.components.AppKeywordAnalysis.defaultParams, {
                              keyword: item.name,
                          }),
                      );
        }

        function setIndustryUrl(category) {
            // SIM-29008 - remove deep linking params from autocomplete
            const params = { ...swNavigator.getParams(), ...ignoreIndustryAnalysisParams };
            return swNavigator.isIndustryAnalysis()
                ? swNavigator.href(swNavigator.current().name, Object.assign(params, { category }))
                : swNavigator.href(
                      "industryAnalysis-overview",
                      angular.merge(swSettings.components.IndustryAnalysisOverview.defaultParams, {
                          category,
                      }),
                  );
        }

        function getAutoCompleteSuggestions(
            query: string,
            searchTypeStr: string,
            appStore: AppStoreStr,
            resultSize = 10,
            excludeList?: string[],
            excludeUserData?: boolean,
        ): any {
            const cacheKey = `${query}-${searchTypeStr}`;
            const searchType = searchTypesHelperService.standardSearchType(searchTypeStr);
            //Get keywords groups
            let _userKeywordsGroups = getKeywordsGroups(query);
            // try cache:
            let cache = autoCompleteCache.get(cacheKey);
            let cacheData;
            if (cache) {
                switch (searchType) {
                    case SearchTypes.WEBSITE:
                        cacheData = cache as IAutoCompleteSiteItem[];
                        cacheData.forEach((item) => setDomainUrl(item));
                        if (excludeList && excludeList.length) {
                            cache = excludeSearchResults(
                                cacheData,
                                excludeList,
                            ) as IAutoCompleteSiteItem[];
                        }
                        break;
                    case SearchTypes.MOBILE:
                        cacheData = cache as IAutoCompleteAppItem[];
                        cacheData.forEach((item) => setAppUrl(item));
                        if (excludeList && excludeList.length) {
                            cache = excludeSearchResults(
                                cacheData,
                                excludeList,
                            ) as IAutoCompleteSiteItem[];
                        }
                        break;
                    case SearchTypes.UNIVERSAL:
                        cacheData = cache as IAutoCompleteUniversalResponse;
                        cacheData.Domains.forEach((item) => setDomainUrl(item));
                        cacheData.Apps.forEach((item) => setAppUrl(item));
                        cacheData.Keywords.forEach((item) => setKeywordUrl(item));
                        if (excludeList && excludeList.length) {
                            cache = excludeSearchResults(
                                cacheData,
                                excludeList,
                            ) as IAutoCompleteSiteItem[];
                        }
                        break;
                    case SearchTypes.KEYWORD:
                        cacheData = cache as IAutoCompleteKeywordResponse;
                        cacheData = cache as IAutoCompleteKeywordItem;
                        cacheData.forEach((item) => {
                            setKeywordUrl(item);
                            item.icon = "icon sw-icon-keyword";
                        });
                        //Unless defined to avoid - user's keywords groups will be added on the top of the list.
                        if (!excludeUserData) {
                            if (_userKeywordsGroups) {
                                cacheData.unshift(..._userKeywordsGroups);
                            }
                            cacheData = _.slice(cacheData, 0, 10);
                        }
                        break;
                    case SearchTypes.INDUSTRY:
                        cache = getCategoriesSection(query);
                        break;
                    case SearchTypes.PLAYKEYWORD:
                    default:
                        cache = null;
                        break;
                }
                return {
                    promise: $q((resolve) => resolve(cache)),
                    abort: angular.noop,
                };
            }
            //End cahe

            //Define data fetch from server (or local for custom categories and keywords groups)
            let url = "websites";
            let virtuals = [];
            const params: { term: string; store: AppStore; size: number } = {
                term: query.toLowerCase(),
                store: null,
                size: resultSize,
            };

            //Define autocomplete getch url
            switch (searchType) {
                case SearchTypes.WEBSITE:
                    url = "websites";
                    virtuals = findVirtualSites(query);
                    break;

                case SearchTypes.KEYWORD:
                    url = "keywords";
                    break;

                case SearchTypes.MOBILE:
                    url = "apps";
                    switch (appStore) {
                        case "google":
                            params.store = AppStore.Google;
                            break;
                        case "apple":
                            params.store = AppStore.Apple;
                            break;
                    }
                    break;

                case SearchTypes.UNIVERSAL:
                    url = "universal";
                    virtuals = findVirtualSites(query);
                    break;
                case SearchTypes.PLAYKEYWORD:
                    break;
                case SearchTypes.INDUSTRY:
                    return {
                        promise: $q((resolve) => resolve(getCategoriesSection(query))),
                        abort: angular.noop,
                    };
                default:
                    return {
                        promise: $q((resolve) => resolve(null)),
                        abort: angular.noop,
                    };
            }

            const canceller = $q.defer();
            const abort = function (reason) {
                canceller.resolve(reason);
            };
            const promise = $http
                .get("/autocomplete/" + url, {
                    cache: true,
                    params,
                    timeout: canceller.promise,
                })
                .then((response: IHttpPromiseCallbackArg<IAutoCompleteResponse>) => {
                    // limit
                    const data = limitResultCount(response.data, resultSize);
                    let dataItems;

                    // process result
                    switch (searchType) {
                        case SearchTypes.WEBSITE:
                            dataItems = data as IAutoCompleteSiteItem[];
                            dataItems.forEach((item) => (item.type = "website"));
                            if (virtuals && virtuals.length) {
                                addVirtualSites(dataItems, virtuals);
                            }
                            autoCompleteCache.put(cacheKey, dataItems);
                            if (excludeList && excludeList.length) {
                                dataItems = excludeSearchResults(
                                    dataItems,
                                    excludeList,
                                ) as IAutoCompleteSiteItem[];
                            }
                            dataItems.forEach(
                                (item) =>
                                    (item.url = stateService.buildItemUrl(item.type, item.name)),
                            );
                            break;
                        case SearchTypes.MOBILE:
                            dataItems = data as IAutoCompleteAppItem[];
                            dataItems.forEach((item) => (item.type = "app"));
                            autoCompleteCache.put(cacheKey, dataItems);
                            if (excludeList && excludeList.length) {
                                dataItems = excludeSearchResults(
                                    dataItems,
                                    excludeList,
                                ) as IAutoCompleteAppItem[];
                            }
                            dataItems.forEach(
                                (item) =>
                                    (item.url = stateService.buildItemUrl(
                                        item.type,
                                        item.id,
                                        [],
                                        item.store,
                                    )),
                            );
                            break;

                        case SearchTypes.UNIVERSAL:
                            dataItems = data as IAutoCompleteUniversalResponse;
                            dataItems.Domains.forEach((item) => (item.type = "website"));
                            dataItems.Apps.forEach((item) => (item.type = "app"));
                            dataItems.Keywords.forEach((item) => (item.type = "keyword"));
                            if (virtuals && virtuals.length) {
                                addVirtualSites(dataItems.Domains, virtuals);
                            }
                            if (dataItems.Domains.length === 0) {
                                const defaultSiteItem: IAutoCompleteSiteItem = {
                                    type: "website",
                                    name: swNavigator.getValidSearchTerm(query, true),
                                    isVirtual: false,
                                    image: AssetsService.assetUrl(
                                        "/Images/autocomplete-default.png",
                                    ),
                                };
                                dataItems.Domains.push(defaultSiteItem);
                            }
                            if (dataItems.Keywords.length === 0) {
                                const defaultKeywordItem: IAutoCompleteKeywordItem = {
                                    type: "keyword",
                                    name: query,
                                    isVirtual: false,
                                    icon:
                                        "icon svg-suite-home--keyword svg-suite-home--keyword-dims",
                                };
                                dataItems.Keywords.push(defaultKeywordItem);
                            }
                            dataItems.Domains.forEach((item) => setDomainUrl(item));
                            dataItems.Apps.forEach((item) => setAppUrl(item));
                            dataItems.Keywords.forEach((item) => {
                                setKeywordUrl(item);
                                item.icon =
                                    "icon svg-suite-home--keyword svg-suite-home--keyword-dims";
                            });
                            if (_userKeywordsGroups) {
                                dataItems.Keywords.unshift(..._userKeywordsGroups);
                            }
                            autoCompleteCache.put(cacheKey, dataItems);
                            break;

                        case SearchTypes.KEYWORD:
                            _userKeywordsGroups = getKeywordsGroups(query);
                            dataItems = Array.isArray(data) ? data : [];
                            dataItems.forEach((item) => {
                                setKeywordUrl(item);
                                item.icon = "icon sw-icon-keyword";
                                item.image = undefined;
                            });
                            if (!excludeUserData) {
                                if (_userKeywordsGroups) {
                                    dataItems.unshift(..._userKeywordsGroups);
                                }
                                dataItems = _.slice(dataItems, 0, 10);
                            }
                            break;
                        case SearchTypes.PLAYKEYWORD:
                            dataItems = [];
                            break;
                    }

                    return dataItems;
                });
            return {
                promise,
                abort,
            };
        }

        function getDefaultWebsite(query) {
            const name = swNavigator.getValidSearchTerm(query, true);
            return [
                {
                    type: "website",
                    name,
                    isVirtual: false,
                    url: stateService.buildItemUrl("website", name),
                    image: AssetsService.assetUrl("/Images/autocomplete-default.png"),
                },
            ];
        }

        function getCategoriesSection(query: string) {
            query = query.toLowerCase();
            const _searchItems: IAutoCompleteCategoryItem[] = [];
            //Search in user's custom categories
            UserCustomCategoryService.getCustomCategories().forEach(function (category) {
                const categoryName = i18nFilter(category.text);
                if (categoryName.toLowerCase().indexOf(query) != -1) {
                    _searchItems.push({
                        type: "industry",
                        name: categoryName,
                        category: category.id,
                        categoryId: category.categoryId,
                        icon: category.icon,
                        url: setIndustryUrl(category.id),
                    });
                }
            });
            //Search in all high-order categories
            categoryService.getCategories().forEach(function (category) {
                const categoryName = i18nFilter(category.text);
                let showSons = false;
                if (categoryName.toLowerCase().indexOf(query) != -1) {
                    _searchItems.push({
                        type: "industry",
                        name: categoryName,
                        category: category.id,
                        icon: category.icon,
                        url: setIndustryUrl(category.name || category.id),
                    });
                    showSons = true;
                }
                //If there are children - search in all children
                if (category.sons) {
                    const categorySons = Object.keys(category.sons);
                    category.children.forEach(function (subcategory) {
                        const subCategoryName = subcategory.getText();
                        if (showSons || subCategoryName.toLowerCase().indexOf(query) != -1) {
                            _searchItems.push({
                                type: "industry",
                                name: subCategoryName,
                                category: subcategory.id,
                                icon: category.icon,
                                url: setIndustryUrl(subcategory.id),
                            });
                        }
                    });
                }
            });
            return _.slice(_searchItems, 0, 10);
        }

        function getKeywordsGroups(query: string) {
            const _userKeywordsGroups = keywordsGroupsService.userGroups.filter(
                (group) => group.Name.toLowerCase().indexOf(query) > -1,
            );
            const _searchItems: IAutoCompleteKeywordItem[] = [];
            _userKeywordsGroups.forEach((keyword) => {
                setKeywordAnalysisUrl(keyword);
                _searchItems.push({
                    type: "keyword",
                    name: keyword.Name,
                    id: "*" + keyword.Name,
                    isVirtual: false,
                    icon: "icon sw-icon-folder",
                    url: keyword.url,
                });
            });
            return _searchItems;
        }

        function getCurrentSection() {
            if (swNavigator.isWebsiteAnalysis()) {
                return "website";
            }

            if (swNavigator.isAppAnalysis()) {
                return "mobileApp";
            }

            if (swNavigator.isIndustryAnalysis()) {
                return "industry";
            }

            if (swNavigator.isKeywordAnalysis() || swNavigator.isGooglePlayKeywordAnalysis()) {
                return "keywords";
            }

            return "";
        }

        /* API */
        const service: IAutoCompleteService = {
            getAutoCompleteSuggestions,
            getDefaultWebsite,
            getCategoriesSection,
            getCurrentSection,
        };
        return service;
    });
