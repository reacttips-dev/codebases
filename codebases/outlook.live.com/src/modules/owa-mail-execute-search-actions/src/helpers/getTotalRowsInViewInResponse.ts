import { getPageContext } from 'owa-search-service';

/**
 * This function gets the appropriate value for totalRowsInViewInResponse to send
 * as part of the appendRowResponse function. Ultimately, this value is used to
 * determine if we should request additional pages of search results or not. If
 * the value is greater than the total number of rows in the table, this signals
 * that we should request more results.
 *
 * For regular tables, this number represents how many rows exist in the table (which
 * is known server-side). In the case of search, we don't know how many total
 * results there are, so we have to set the value conditionally based on which
 * page is being processed and how many results were returned.
 *
 * @param pageNumber The page number of the search request that's being processed
 * @param resultsCount The number of results in response
 * @param rowsInTableCount The number of results already in the table
 */
export default function getTotalRowsInViewInResponse(params: {
    pageNumber: number;
    resultsCount: number;
    rowsInTableCount: number;
}): number {
    const { pageNumber, resultsCount, rowsInTableCount } = params;

    // Determine total number of rows (existing rows + new results).
    const totalRowsInView = rowsInTableCount + resultsCount;

    // Determine max number of pages that are fetched.
    const maxPagesToFetch = 7;

    /**
     * If the current page is the last page to be requested, then we can just
     * return the number of rows in the view because the service doesn't have
     * any additional results to return.
     */
    if (pageNumber === maxPagesToFetch) {
        return totalRowsInView;
    }

    /**
     * If the number of results returned matches the number of results we asked
     * for in the given page, then we assume there are additional results to be
     * returned so we set the value as the number of rows we have + 1.
     */
    if (resultsCount === getPageContext(pageNumber).resultRowCount) {
        return totalRowsInView + 1;
    }

    /**
     * If execution reaches this point, it means we've exhausted the results
     * from the service so we can return the number of rows already in the table
     * because there are no additional results to be requested.
     */
    return totalRowsInView;
}
