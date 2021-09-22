import type ExecuteSearchJsonRequest from 'owa-service/lib/contract/ExecuteSearchJsonRequest';
import type { SearchQuery } from 'owa-search-service/lib/data/schema/SubstrateSearchRequest';

/**
 * Creates the Query property of the EntityRequest object.
 */
export default function createQuery(
    request: ExecuteSearchJsonRequest,
    skipAddToHistory: boolean,
    clientQueryAlterationReason: string
): SearchQuery {
    /**
     * If the query includes a people suggestion (thus includes KQL) or generated kql via interactiv filters, we add
     * extra properties to the Query object so that the KQL isn't added to the
     * user's search history.
     */
    if (skipAddToHistory) {
        return {
            QueryString: request.Body.Query,
            DisplayQueryString: '' /* Intentionally empty so nothing is added to search history. */,
            ClientQueryAlterationReasons: clientQueryAlterationReason,
        };
    } else {
        return {
            QueryString: request.Body.Query,
        };
    }
}
