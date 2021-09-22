import { IAutoCompleteAppItem } from "autocomplete";
import { ISite } from "@similarweb/ui-components/dist/autocomplete";
import {
    generateRecents,
    getWebsiteResults,
    getAppResults,
    createMixedSearchResults,
} from "services/solutions2Services/HomepageDataFetchers/NewModulesHomepageDataFetcher";
import { ListItemSeparator } from "@similarweb/ui-components/dist/list-item";
import {
    IAppRecent,
    IWebsiteRecent,
} from "services/solutions2Services/HomepageDataFetchers/HomepageDataFetcherTypes";

const defaultWebsitePageState = "companyresearch_website_websiteperformance";
const defaultAppPageState = "companyresearch_app_appperformance";

export const mergeAndSortMarketSearchResults = (
    appResults: IAutoCompleteAppItem[],
    websiteResults: ISite[],
): Array<(ISite & { type: string }) | IAutoCompleteAppItem> => {
    const websiteWithType = websiteResults.map((item) => ({ ...item, type: "website" }));
    const appWithType = appResults.map((item) => ({ ...item, type: "app" }));
    const topWebsites = websiteWithType.splice(0, 5);
    const otherResults = [...websiteWithType, ...appWithType].sort((a, b) => {
        const aVal = a.name.toUpperCase();
        const bVal = b.name.toUpperCase();
        if (aVal < bVal) {
            return -1;
        }

        if (aVal > bVal) {
            return 1;
        }

        return 0;
    });
    return [...topWebsites, ...otherResults];
};

export const getAutocompleteRecentItems = (recents: Array<IAppRecent | IWebsiteRecent>) => {
    return generateRecents(
        recents,
        { website: defaultWebsitePageState, app: defaultAppPageState },
        <ListItemSeparator key="top-separator">Recent Analysis</ListItemSeparator>,
    );
};

export const getAutocompleteSearchResultItems = async (query: string) => {
    const [websiteResults, appResults] = await Promise.all([
        getWebsiteResults(query),
        getAppResults(query),
    ]);

    return createMixedSearchResults(
        mergeAndSortMarketSearchResults(appResults, websiteResults),
        defaultAppPageState,
        defaultWebsitePageState,
        null,
    );
};

export const getAutocompleteSearchResultData = async (query: string) => {
    const [websites, apps] = await Promise.all([getWebsiteResults(query), getAppResults(query)]);

    return {
        websites: createMixedSearchResults(
            websites.map((item) => ({ ...item, type: "website" })),
            null,
            defaultWebsitePageState,
            null,
        ),
        apps: createMixedSearchResults(
            apps.map((item) => ({ ...item, type: "app" })),
            defaultAppPageState,
            null,
            null,
        ),
    };
};
