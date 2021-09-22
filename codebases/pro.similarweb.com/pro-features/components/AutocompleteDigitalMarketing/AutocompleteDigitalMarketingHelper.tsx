import {
    generateRecents,
    getWebsiteResults,
    getKeywordResults,
    createMixedSearchResults,
} from "services/solutions2Services/HomepageDataFetchers/NewModulesHomepageDataFetcher";
import { ListItemSeparator } from "@similarweb/ui-components/dist/list-item";
import React from "react";
import { Autocomplete, ISite } from "@similarweb/ui-components/dist/autocomplete";

const defaultWebsiteState = "competitiveanalysis_website_overview_websiteperformance";
const defaultKeywordState = "keywordAnalysis_overview";

export const generateAutocompleteRecentItems = (
    recentWebsites,
    recentKeywords,
    maxCompareItemsToDisplay?: number,
) => {
    return generateRecents(
        [...recentWebsites, ...recentKeywords],
        { website: defaultWebsiteState, keyword: defaultKeywordState },
        <ListItemSeparator key="top-separator">Recent Analysis</ListItemSeparator>,
        undefined,
        maxCompareItemsToDisplay,
    );
};

const mergeAndSortSearchResults = (
    websiteResults: ISite[],
    keywordResults?: ISite[],
): Array<ISite & { type: string }> => {
    const websiteWithType = websiteResults.map((item) => ({ ...item, type: "website" }));
    const keywordWithType = keywordResults?.map((item) => ({ ...item, type: "keyword" })) ?? [];
    const topWebsites = websiteWithType.splice(0, 5);
    const otherResults = [...websiteWithType, ...keywordWithType].sort((a, b) => {
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

export const generateAutocompleteSearchResultItems = async (
    query: string,
    includeKeywordResults: boolean,
) => {
    const websiteResults = await getWebsiteResults(query, includeKeywordResults ? 9 : 30);
    const keywordResults = includeKeywordResults ? await getKeywordResults(query) : [];

    return createMixedSearchResults(
        mergeAndSortSearchResults(websiteResults, keywordResults),
        null, // TODO
        defaultWebsiteState,
        defaultKeywordState,
    );
};
