import type { SearchSortOrder } from 'owa-search-service/lib/data/schema/SubstrateSearchRequest';
import type ExecuteSearchSortOrder from 'owa-service/lib/contract/ExecuteSearchSortOrder';

export default function mapSortOrdering(sortOrder: ExecuteSearchSortOrder): SearchSortOrder[] {
    const scoreSort: SearchSortOrder = {
        Field: 'Score',
        SortDirection: 'Desc',
        Count: 3,
    };

    const timeSort: SearchSortOrder = {
        Field: 'Time',
        SortDirection: 'Desc',
    };

    const map: { [key: string]: SearchSortOrder[] } = {
        Relevance: [scoreSort],
        Hybrid: [scoreSort, timeSort],
        DateTime: [timeSort],
    };

    // Return matching SearchSortOrder if one is found.
    if (sortOrder && map[sortOrder]) {
        return map[sortOrder];
    }

    // Default to timeSort if no match is found.
    return [timeSort];
}
