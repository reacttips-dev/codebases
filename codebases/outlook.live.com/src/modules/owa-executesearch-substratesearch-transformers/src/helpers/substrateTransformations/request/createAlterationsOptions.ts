import type { QueryAlterationOptions } from 'owa-search-service/lib/data/schema/SubstrateSearchRequest';
import getSupportedQueryAlterationTypes from 'owa-search-service/lib/helpers/getSupportedQueryAlterationTypes';

export default function createAlterationsOptions(
    pageNumber: number,
    isAlterationsRecourse: boolean,
    apiVersion: number
): QueryAlterationOptions {
    /**
     * v1 query api only requires query processing to be enabled for first pages of query requests.
     * v2 query api requires query processing to be enabled on all pages of query requests.
     * Query processing should not be enabled if the search was not initiated from a query alteration recourse link.
     */
    const shouldServiceProcessQuery =
        (pageNumber === 0 || apiVersion !== 1) && !isAlterationsRecourse;

    return {
        // Flag to enable low confidence alterations in 3S
        EnableSuggestion: shouldServiceProcessQuery,
        // Flag to enable medium/high confidence alterations in 3S
        EnableAlteration: shouldServiceProcessQuery,
        SupportedRecourseDisplayTypes: getSupportedQueryAlterationTypes(),
    };
}
