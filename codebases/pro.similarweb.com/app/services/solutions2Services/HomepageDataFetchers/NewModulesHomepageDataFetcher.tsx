import {
    AutocompleteAppItem,
    AutocompleteItemText,
    AutocompleteWebsiteItem,
    IAutocompleteAppItemDetails,
    IAutocompleteWebsiteItemDetails,
    ISite,
} from "@similarweb/ui-components/dist/autocomplete";
import { ListItemWebsite, ListItemKeyword } from "@similarweb/ui-components/dist/list-item";
import { IAutoCompleteAppItem } from "autocomplete";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { i18nFilter } from "filters/ngFilters";
import toString from "lodash/toString";
import * as _ from "lodash";
import { transformRecentAnalysis } from "pages/start-pages/BaseAnalysisStartPageContainer";
import CountryService from "services/CountryService";
import { DefaultFetchService } from "services/fetchService";
import { swSettings } from "common/services/swSettings";
import { dedupRecent } from "services/solutions2Services/HomepageDataFetchers/utils";
import {
    IAppRecent,
    IWebsiteRecent,
    RecentsTypes,
    RecentTypeToPageStateName,
} from "./HomepageDataFetcherTypes";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import styled from "styled-components";
import swLog from "@similarweb/sw-log";
import { RecentService } from "services/recent/recentService";

const fetchService = DefaultFetchService.getInstance();
const translate = i18nFilter();

enum ItemType {
    Recent = "homepage.recent.item",
    SearchResult = "homepage.search.result.item",
}

enum EntityType {
    Website = "WEBSITE",
    App = "APP",
    Keyword = "KEYWORD",
}

export const AutocompleteAppItemStyled = styled.div`
    ${AutocompleteItemText} {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .ItemIcon {
        flex-shrink: 0;
    }
`;

const onClickRedirect = (
    url: string,
    itemId: string,
    type: EntityType,
    itemType: ItemType,
): void => {
    TrackWithGuidService.trackWithGuid(itemType, "click", {
        // eslint-disable-next-line @typescript-eslint/camelcase
        item_type: type,
        // eslint-disable-next-line @typescript-eslint/camelcase
        item_id: itemId,
    });
    window.location.href = url;
};

export const getAppResults = async (query: string, size = 10): Promise<IAutoCompleteAppItem[]> => {
    return await fetchService.get<IAutoCompleteAppItem[]>("/autocomplete/apps", {
        size,
        term: query,
        validate: true,
    });
};

export const getWebsiteResults = async (query: string, size = 9): Promise<ISite[]> => {
    return await fetchService.get<ISite[]>(
        `/autocomplete/websites?size=${size}&term=${query}&webSource=Desktop&validate=true`,
    );
};

export const getKeywordResults = async (query: string): Promise<ISite[]> => {
    return await fetchService.get<ISite[]>(
        `/autocomplete/keywords?size=20&term=${query}&webSource=Desktop&validate=true`,
    );
};

export const getRecentByFilter = async (filter?: RecentsTypes) => {
    const recentSearches: any = RecentService.getRecents();

    if (filter) {
        return recentSearches.filter((item) => item.data.type === filter);
    }

    return recentSearches;
};

export const getRecentsAnalysis = async (filter?: RecentsTypes, deduped = false) => {
    const recentSearchs: any = RecentService.getRecents();
    let recentFiltered = filter
        ? recentSearchs.filter((item) => item.data.type === filter)
        : recentSearchs;
    if (recentFiltered.length === 0) {
        return [];
    }

    if (deduped) {
        recentFiltered = dedupRecent(recentFiltered);
    }

    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    return transformRecentAnalysis(recentFiltered, CountryService, swNavigator, translate);
};

export const generateRecents = (
    items: Array<IAppRecent | IWebsiteRecent>,
    recentTypeToPageStateMapping: RecentTypeToPageStateName,
    separator?: JSX.Element,
    defaultWebsiteStateParams: Record<string, string> = {},
    maxCompareItemsToDisplay?: number,
): JSX.Element[] => {
    return items.reduce(
        (results, item, index) => {
            // each recent item type should have a unique page state name (since each item
            // type should lead to a different page. the recentTypeToPageStateMapping argument enables
            // the user (developer) to set which recent type leads to which page. (see usage examples to understand more)
            const itemPageStateName = recentTypeToPageStateMapping[item.data.type];

            switch (item.data.type) {
                case "website":
                    results.push(
                        transformRecentWebsite(
                            item as IWebsiteRecent,
                            itemPageStateName,
                            defaultWebsiteStateParams,
                            maxCompareItemsToDisplay,
                        ),
                    );
                    break;
                case "app":
                    results.push(
                        transformRecentApp(
                            item as IAppRecent,
                            itemPageStateName,
                            index,
                            maxCompareItemsToDisplay,
                        ),
                    );
                    break;
            }
            return results;
        },
        separator ? [separator] : [],
    );
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getTransformedItem = (
    item: IWebsiteRecent,
    websitePageStateName: string,
    additionalParams: object = {},
) => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const category =
        item.data.category &&
        item.data.category.replace(/([/\s])/g, (match, curr) => {
            switch (curr) {
                case "/":
                    return "~";
                default:
                    return "_";
            }
        });

    const params = {
        duration: item.data.duration,
        country: item.data.country,
        category,
        key: `${item.data.mainItem}${
            item.data.comparedItems && item.data.comparedItems.length > 0
                ? "," + toString(item.data.comparedItems)
                : ""
        }`,
        isWWW: "*",
        ...additionalParams,
    };

    const mainWebsite: IAutocompleteWebsiteItemDetails = {
        domain: item.data.mainItem,
        iconUrl: item.data.resources.mainItemFavIcon,
    };

    let compareItems: IAutocompleteWebsiteItemDetails[];
    if (item.data.comparedItems && item.data.comparedItems.length > 0) {
        compareItems = item.data.comparedItems.map((comp, idx) => ({
            domain: comp,
            iconUrl: item.data.resources.comparedItemsFavicon[idx],
        }));
    }
    const url = swNavigator.href(websitePageStateName, params);

    return { mainWebsite, compareItems, category, params, url };
};

const transformRecentWebsite = (
    item: IWebsiteRecent,
    websitePageStateName: string,
    websitePageParams: Record<string, string>,
    maxCompareItemsToDisplay?: number,
): JSX.Element => {
    const { mainWebsite, compareItems, category, params, url } = getTransformedItem(
        item,
        websitePageStateName,
        websitePageParams,
    );

    return (
        <AutocompleteWebsiteItem
            maxCompareItemsToDisplay={maxCompareItemsToDisplay}
            mainSite={mainWebsite}
            compareSites={compareItems}
            itemUrl={url}
            onItemClick={onClickRedirect.bind(
                null,
                url,
                params.key,
                EntityType.Website,
                ItemType.Recent,
            )}
        />
    );
};

const transformRecentApp = (
    item: IAppRecent,
    appPageStateName: string,
    index: number,
    maxCompareItemsToDisplay?: number,
): JSX.Element => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const params = {
        duration: item.data.duration,
        country: item.data.country,
        appId: `${item.data.appStore}_${item.data.mainItem}${
            item.data.comparedItems && item.data.comparedItems.length > 0
                ? "," + toString(item.data.comparedItems)
                : ""
        }`,
    };
    // sometimes the recent data that has been retrieved from the server is in a different structure: the mainItem was a string
    // and the new mainItem is object.
    // the following weird condition is for backward compatibility support.
    const mainApp: IAutocompleteAppItemDetails =
        typeof item.data.resources.mainItem === "object"
            ? {
                  app: item.data.resources.mainItem.title,
                  iconUrl: item.data.resources.mainItem.icon,
                  appStore: item.data.resources.mainItem.appStore,
              }
            : {
                  app: item.data.mainItem,
                  // a temporary undefined due to a missing data, in the future the backend should enrich the 'old' recent data with the favicon
                  iconUrl: undefined,
                  appStore: item.data.appStore === 0 ? "Google" : "Apple",
              };

    let compareItems: IAutocompleteAppItemDetails[];
    if (
        item.data.comparedItems &&
        item.data.comparedItems.filter((comparedItem) => comparedItem).length > 0
    ) {
        if (typeof item.data.resources.comparedItems[0] !== "object") {
            compareItems = item.data.comparedItems
                .filter((comparedItem) => comparedItem)
                .map((comp, idx) => ({
                    app: item.data.comparedItems[idx]?.title,
                    iconUrl: item.data.comparedItems[idx]?.icon,
                    appStore: item.data.comparedItems[idx]?.appStore,
                }));
        } else {
            compareItems = item.data.comparedItems
                .filter((comparedItem) => comparedItem)
                .map((comp, idx) => ({
                    app: item.data.resources.comparedItems[idx]?.title,
                    iconUrl: item.data.resources.comparedItems[idx]?.icon,
                    appStore: item.data.resources.comparedItems[idx]?.appStore,
                }));
        }
    }
    const url = swNavigator.href(appPageStateName, params);

    return (
        <AutocompleteAppItemStyled>
            <AutocompleteAppItem
                maxCompareItemsToDisplay={maxCompareItemsToDisplay}
                key={`${mainApp.app}_${index}_${compareItems && compareItems?.join("")}`}
                mainItem={mainApp}
                compareItems={compareItems}
                itemUrl={url}
                onItemClick={onClickRedirect.bind(
                    null,
                    url,
                    params.appId,
                    EntityType.App,
                    ItemType.Recent,
                )}
            />
        </AutocompleteAppItemStyled>
    );
};

const capitalLetter = (str: string): string => {
    return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
};

export const createMixedSearchResults = (
    items: Array<(ISite & { type: string }) | IAutoCompleteAppItem>,
    appPageStateName: string,
    websitePageStateName: string,
    keywordPageStateName?: string, // TODO
): JSX.Element[] => {
    return items.map((item) => {
        switch (item.type) {
            case "app":
                return createAppSearchResultItem(item as IAutoCompleteAppItem, appPageStateName);
            case "website":
                return createWebsiteSearchResultItem(item as ISite, websitePageStateName);
            case "keyword":
                return createKeywordSearchResultItem(item as ISite, keywordPageStateName);
        }
    });
};

export const createAppSearchResultItem = (
    item: IAutoCompleteAppItem,
    appPageStateName: string,
): JSX.Element => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const appDefaultParams = {
        ...swSettings.components["AppAnalysis"].defaultParams,
        appId: item.appKey,
    };
    const appDetails: IAutocompleteAppItemDetails = {
        iconUrl: item.image,
        app: item.name,
        appStore: capitalLetter(item.store) as IAutocompleteAppItemDetails["appStore"],
    };
    const url = swNavigator.href(appPageStateName, appDefaultParams);

    return (
        <AutocompleteAppItemStyled>
            <AutocompleteAppItem
                key={item.appKey}
                mainItem={appDetails}
                itemUrl={url}
                onItemClick={onClickRedirect.bind(
                    null,
                    url,
                    `${appDetails.app}_${appDetails.appStore}`,
                    EntityType.App,
                    ItemType.SearchResult,
                )}
            />
        </AutocompleteAppItemStyled>
    );
};

export const createWebsiteSearchResultItem = (
    item: ISite,
    websitePageStateName: string,
    stateParams?: any,
    onItemClick?: (domain: string) => void,
): JSX.Element => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const { name, image } = item;
    let websiteDefaultParams = {};
    try {
        const stateObject = swNavigator.getState(websitePageStateName);
        websiteDefaultParams =
            swSettings.components[swNavigator.getConfigId(stateObject)].defaultParams;
    } catch (e) {
        swLog.warn(`Can not get default params for state ${websitePageStateName}`);
    }
    const url = swNavigator.href(websitePageStateName, {
        ...websiteDefaultParams,
        ...stateParams,
        key: name,
        isWWW: "*",
    });

    return (
        <ListItemWebsite
            key={`website.${name}`}
            img={image}
            text={name}
            onClick={() => {
                if (typeof onItemClick === "function") {
                    onItemClick(name);
                }

                onClickRedirect(url, name, EntityType.Website, ItemType.SearchResult);
            }}
        />
    );
};

export const createKeywordSearchResultItem = (
    item: ISite,
    keywordPageStateName: string,
): JSX.Element => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const { name } = item;
    const defaultParams =
        swSettings.components[swNavigator.getState(keywordPageStateName).configId].defaultParams;
    const url = swNavigator.href(keywordPageStateName, {
        ...defaultParams,
        keyword: item.name,
    });

    return (
        <ListItemKeyword
            key={`${name}`}
            iconName={"search-keywords"}
            text={name}
            onClick={onClickRedirect.bind(
                null,
                url,
                name,
                EntityType.Keyword,
                ItemType.SearchResult,
            )}
        />
    );
};

export const createGoogleKeywordSearchResultItem = (
    item: ISite,
    keywordPageStateName: string,
): JSX.Element => {
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const { name } = item;
    const defaultParams =
        swSettings.components[swNavigator.getState(keywordPageStateName).configId].defaultParams;
    const url = swNavigator.href(keywordPageStateName, {
        ...defaultParams,
        keyword: item.name,
    });

    return (
        <ListItemKeyword
            key={`${name}`}
            iconName={"playkeyword"}
            text={name}
            onClick={onClickRedirect.bind(
                null,
                url,
                name,
                EntityType.Keyword,
                ItemType.SearchResult,
            )}
        />
    );
};
