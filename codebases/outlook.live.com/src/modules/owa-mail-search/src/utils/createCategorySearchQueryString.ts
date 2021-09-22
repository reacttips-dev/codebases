import { CATEGORY_SEARCH_QUERY_PREFIX } from '../searchConstants';
import type { CategorySearchSuggestion } from 'owa-search-service';

export default function createCategorySearchQueryString(
    categorySuggestion: CategorySearchSuggestion
): string {
    return `${CATEGORY_SEARCH_QUERY_PREFIX}"${categorySuggestion.Name}"`;
}
