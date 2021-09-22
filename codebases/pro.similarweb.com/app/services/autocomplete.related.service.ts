import angular from "angular";
import * as _ from "lodash";
/**
 * Created by olegg on 01-Jun-16.
 */
import { StateService } from "../user-data/StateService";
import { AppStoreStr } from "userdata";
import { StateObjectType } from "userdata";
import { IAutoCompleteRelatedAppItem } from "autocomplete";
import { IAutoCompleteRelatedSiteItem } from "autocomplete";
import { IAutoCompleteSiteItem } from "autocomplete";
import { IAutoCompleteAppItem } from "autocomplete";
import { PageId } from "userdata";
import { IAutoCompleteRelatedResponse } from "autocomplete";
import { chosenItems } from "common/services/chosenItems";
import { RELATED_SEARCH } from "components/universal/config/universal.search.config";
export interface IAutoCompleteRelatedService {
    getRelatedItems(): IAutoCompleteRelatedResponse;
}
angular
    .module("sw.common")
    .factory("autoCompleteRelatedService", function (
        swNavigator,
        stateService: StateService,
        chosenSites,
    ) {
        /**
         * gets the related items response
         * @returns {IAutoCompleteRelatedResponse}
         */
        function getRelatedItems(): IAutoCompleteRelatedResponse {
            var relatedItem: IAutoCompleteSiteItem | IAutoCompleteAppItem;
            var stores: AppStoreStr[] = ["google", "apple"];
            var oppositeStore: AppStoreStr;
            var pageIds: PageId[];
            var dataArray = [];

            // websites
            relatedItem = getPrimarySiteItem();
            if (relatedItem) {
                pageIds = RELATED_SEARCH.websitePageIds;

                dataArray = appendRelatedLinks(dataArray, getRelatedLinks(relatedItem, pageIds));
                dataArray = appendRelatedLinks(dataArray, getRelatedAppsLinks(stores, "website"));
            } else {
                // apps
                relatedItem = getPrimaryAppItem();
                if (relatedItem) {
                    let appStore = (<IAutoCompleteAppItem>relatedItem).store;
                    oppositeStore = appStore === "google" ? "apple" : "google";
                    pageIds =
                        appStore == "google"
                            ? RELATED_SEARCH.appGooglePageIds
                            : RELATED_SEARCH.appApplePageIds;
                    dataArray = appendRelatedLinks(
                        dataArray,
                        getRelatedLinks(relatedItem, pageIds),
                    );
                    dataArray = appendRelatedLinks(
                        dataArray,
                        getRelatedAppsLinks([oppositeStore], "app"),
                    );
                    dataArray = appendRelatedLinks(dataArray, getRelatedSitesLinks());
                } else {
                    // none
                    return { Related: [] };
                }
            }

            return { Related: dataArray };
        }

        /**
         * pushes or concats items to array
         */
        function appendRelatedLinks(targetArray, relatedLinks) {
            if (relatedLinks) {
                return targetArray.concat(
                    Array.isArray(relatedLinks) ? relatedLinks : [relatedLinks],
                );
            }
            return targetArray;
        }

        /**
         * gets the related apps
         * @param stores
         * @param type
         * @returns {IAutoCompleteRelatedAppItem[]}
         */
        function getRelatedAppsLinks(
            stores: AppStoreStr[],
            type?: StateObjectType,
        ): IAutoCompleteRelatedAppItem[] {
            var items: IAutoCompleteRelatedAppItem[] = [];
            stores.forEach(function (store: AppStoreStr) {
                var relatedApp: IAutoCompleteRelatedAppItem = getRelatedApp(store, type);
                if (relatedApp) {
                    var compared =
                        chosenItems.$first().Id == relatedApp.id
                            ? _.map(chosenItems.$tail(), (item: any) => item.Id)
                            : [];
                    relatedApp.url = stateService.buildItemUrl(
                        relatedApp.type,
                        relatedApp.id,
                        compared,
                        relatedApp.store,
                    );
                    items.push(relatedApp);
                }
            });
            return items;
        }

        /**
         * gets the related sites
         * @returns {IAutoCompleteRelatedSiteItem}
         */
        function getRelatedSitesLinks(): IAutoCompleteRelatedSiteItem {
            var relatedSite: IAutoCompleteRelatedSiteItem = getRelatedSite();
            if (relatedSite) {
                var compared = chosenSites.isCompare() ? _.tail<string>(chosenSites.get()) : [];
                relatedSite.url = stateService.buildItemUrl("website", relatedSite.name, compared);
            }
            return relatedSite;
        }

        function getRelatedLinks(
            relatedItem: IAutoCompleteSiteItem | IAutoCompleteAppItem,
            pageIds: PageId[],
        ): (IAutoCompleteRelatedAppItem | IAutoCompleteRelatedSiteItem)[] {
            var links: (IAutoCompleteRelatedAppItem | IAutoCompleteRelatedSiteItem)[] = [];

            for (let i = 0, len = pageIds.length; i < len; i++) {
                var currentState = swNavigator.getStateForPageId(pageIds[i]);
                var pageId = {
                    section: currentState.section,
                    subSection: currentState.subSection,
                    subSubSection: currentState.subSubSection,
                };

                var mainItem: string;
                var comparedItems: string[];
                var itemStore: AppStoreStr;
                var keepFilters: boolean = false;

                switch (relatedItem.type) {
                    case "website":
                        let relatedSiteItem = <IAutoCompleteRelatedSiteItem>relatedItem;
                        mainItem = relatedSiteItem.name;
                        comparedItems = chosenSites.isCompare()
                            ? _.tail<string>(chosenSites.get())
                            : [];
                        itemStore = null;
                        if (swNavigator.isWebsiteAnalysis() && !swNavigator.isHomePage()) {
                            keepFilters = true;
                        }
                        break;
                    case "app":
                        let relatedAppItem = <IAutoCompleteRelatedAppItem>relatedItem;
                        mainItem = relatedAppItem.id;
                        let comparedApps = _.map(chosenItems.$tail(), (item: any) => item.Id);
                        comparedItems = chosenItems.$first().Id == mainItem ? comparedApps : [];
                        itemStore = relatedAppItem.store;
                        if (swNavigator.isAppAnalysis() && !swNavigator.isHomePage()) {
                            keepFilters = true;
                        }
                        break;
                    default:
                        continue;
                }

                var itemObj = <IAutoCompleteRelatedAppItem | IAutoCompleteRelatedSiteItem>(
                    angular.copy(relatedItem)
                );
                itemObj.pageIcon = currentState.icon;
                itemObj.page = currentState.pageMenuTitle || currentState.pageTitle;
                itemObj.pageId = pageId;
                itemObj.url = keepFilters
                    ? swNavigator.href(
                          swNavigator.getStateForPageId(pageId).name,
                          swNavigator.getParams(),
                      )
                    : stateService.buildItemUrl(
                          itemObj.type,
                          mainItem,
                          comparedItems,
                          itemStore,
                          pageId,
                      );
                links.push(itemObj);
            }
            return links;
        }

        function getPrimaryAppItem() {
            var primaryAppItem: IAutoCompleteRelatedAppItem = null;
            var primaryAppObj: any = chosenItems.$first();
            if (primaryAppObj.Id) {
                primaryAppItem = {
                    id: primaryAppObj.Id,
                    publisher: primaryAppObj.Author,
                    appKey: (primaryAppObj.AppStore === "Google" ? 0 : 1) + "_" + primaryAppObj.Id,
                    store: primaryAppObj.AppStore.toLowerCase(),
                    ratings: primaryAppObj.Rating,
                    image: primaryAppObj.Icon128,
                    name: primaryAppObj.Title,
                    type: "app",
                    page: "",
                    pageId: {
                        section: "apps",
                        subSection: "overview",
                        subSubSection: "ranking",
                    },
                    pageIcon: "",
                    url: "",
                };
            }
            return primaryAppItem;
        }

        function getRelatedSite() {
            var relatedSite: IAutoCompleteRelatedSiteItem = null;
            var relatedSites: any = chosenItems.$first().RelatedSites;
            if (relatedSites && !_.isEmpty(relatedSites[0])) {
                var firstSite: any = relatedSites[0];
                relatedSite = {
                    image: firstSite.Favicon,
                    name: firstSite.Url,
                    type: "website",
                    page: "worldwide summary",
                    pageId: {
                        section: "website",
                        subSection: "worldwideOverview",
                        subSubSection: null,
                    },
                    pageIcon: "sw-icon-overview",
                    isVirtual: false,
                };
            }
            return relatedSite;
        }

        function getRelatedApp(store: AppStoreStr, type?: StateObjectType) {
            let relatedApp: any = null;
            let relatedApps: any = null;
            switch (type) {
                case "app":
                    relatedApps = chosenItems.$first().RelatedApps;
                    break;
                case "website":
                default:
                    relatedApps = chosenSites.getPrimarySite().relatedApps;
                    break;
            }
            var appStore: string = store === "google" ? "apps_0" : "apps_1";
            if (
                relatedApps &&
                !_.isEmpty(relatedApps[appStore]) &&
                !_.isEmpty(relatedApps[appStore][0])
            ) {
                var firstApp: any = relatedApps[appStore][0];
                relatedApp = {
                    id: firstApp.id,
                    publisher: firstApp.author,
                    image: firstApp.icon,
                    store,
                    name: firstApp.title,
                    appKey: firstApp.title,
                    ratings: firstApp.rating,
                    type: "app",
                    page: "app ranks",
                    pageId: {
                        section: "apps",
                        subSection: "overview",
                        subSubSection: "ranking",
                    },
                };
            }
            return relatedApp;
        }

        function getPrimarySiteItem() {
            var primarySiteItem: IAutoCompleteRelatedSiteItem = null;
            let primarySiteObj = chosenSites.getPrimarySite();
            if (primarySiteObj.name) {
                primarySiteItem = {
                    name: primarySiteObj.name,
                    page: "",
                    pageId: {
                        section: "website",
                        subSection: "audience",
                        subSubSection: "overview",
                    },
                    pageIcon: "",
                    isVirtual: primarySiteObj.isVirtual,
                    type: "website",
                    image: primarySiteObj.icon,
                    url: "",
                };
            }
            return primarySiteItem;
        }

        /* API */
        var service: IAutoCompleteRelatedService = {
            getRelatedItems: getRelatedItems,
        };
        return service;
    });
