import { createDateTimeRangeFilterFromExecuteSearchRequest } from './createDateTimeRangeFilter';
import { createFoldersFilterFromExecuteSearchRequest } from './createFoldersFilter';
import type {
    AndFilter,
    FilterBase,
} from 'owa-search-service/lib/data/schema/SubstrateSearchRequest';
import type ExecuteSearchJsonRequest from 'owa-service/lib/contract/ExecuteSearchJsonRequest';

export default function buildFilter(request: ExecuteSearchJsonRequest) {
    // Parse filters from request.
    const dateTimeRangeFilter = createDateTimeRangeFilterFromExecuteSearchRequest(request);
    const folderFilters = createFoldersFilterFromExecuteSearchRequest(request);

    // Remove null filters.
    const allFilters = dateTimeRangeFilter.concat(folderFilters);
    const filteredFilters = allFilters.filter((filter: FilterBase) => !!filter);

    const andedFilters: AndFilter = {
        And: filteredFilters,
    };

    /**
     * - If there are no filters, return null.
     * - If there is a single filter, return it.
     * - If there are multiple filters, return them as an AndFilter.
     */
    return filteredFilters.length === 0
        ? null
        : filteredFilters.length === 1
        ? filteredFilters[0]
        : andedFilters;
}
