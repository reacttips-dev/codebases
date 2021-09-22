import type SearchResultsType from 'owa-service/lib/contract/SearchResultsType';
import { SearchScopeKind } from '../data/schema/SearchScope';

export const PAGE_CONTEXTS: PageContext[] = [
    { resultRowOffset: 0, resultRowCount: 25, pageNumber: 0 },
    { resultRowOffset: 25, resultRowCount: 50, pageNumber: 1 },
    { resultRowOffset: 75, resultRowCount: 75, pageNumber: 2 },
    { resultRowOffset: 150, resultRowCount: 100, pageNumber: 3 },
    { resultRowOffset: 250, resultRowCount: 200, pageNumber: 4 },
    { resultRowOffset: 450, resultRowCount: 200, pageNumber: 5 },
    { resultRowOffset: 650, resultRowCount: 200, pageNumber: 6 },
    { resultRowOffset: 850, resultRowCount: 200, pageNumber: 7 },
];

export interface PageContext {
    readonly resultRowOffset: number;
    readonly resultRowCount: number;
    readonly pageNumber: number;
}

export interface PageContextState {
    pageContexts: PageContext[];
}

/**
 * Gets the pageContext based on the page number
 * @param pageNumber Page for which to get the rowOffset and rowCount
 */
export let getPageContext = function getPageContext(
    pageNumber: number,
    state: PageContextState = { pageContexts: PAGE_CONTEXTS }
): PageContext {
    if (pageNumber < 0 || pageNumber >= state.pageContexts.length) {
        throw new Error('The pageNumber for execute search is invalid:' + pageNumber);
    }
    return state.pageContexts[pageNumber];
};

/**
 * Gets the next page context if available
 * @param currentPageContext the current page context
 * @param searchResults the search results for the current page number
 */
export let getNextPageContext = function getNextPageContext(
    currentPageContext: PageContext,
    searchResults: SearchResultsType,
    searchScopeKind: SearchScopeKind,
    state: PageContextState = { pageContexts: PAGE_CONTEXTS }
): PageContext {
    const nextPageNumber = currentPageContext.pageNumber + 1;
    const maxPages = searchScopeKind === SearchScopeKind.PrimaryMailbox ? 2 : 4;
    if (searchResults.MoreResultsAvailable && nextPageNumber < maxPages) {
        return getPageContext(nextPageNumber, state);
    } else {
        return null;
    }
};

/**
 * Gets the page context for the search request based on the offset loaded by
 * the search results table.
 *
 * @param offset Index to begin fetch from
 */
export const getPageContextByOffset = (offset: number): PageContext => {
    switch (offset) {
        case 74:
            return PAGE_CONTEXTS[2];
        case 149:
            return PAGE_CONTEXTS[3];
        case 249:
            return PAGE_CONTEXTS[4];
        case 449:
            return PAGE_CONTEXTS[5];
        case 649:
            return PAGE_CONTEXTS[6];
        case 849:
            return PAGE_CONTEXTS[7];
        /**
         * We can only fetch a total of 1,024 results. So we return null for
         * any index beyond the greatest we support (meaning that there's no
         * next page to fetch).
         */
        default:
            return null;
    }
};
