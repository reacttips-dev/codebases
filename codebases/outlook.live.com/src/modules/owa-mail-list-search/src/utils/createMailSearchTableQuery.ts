import type SearchTableQuery from '../store/schema/SearchTableQuery';
import type { OwaDate } from 'owa-datetime';
import { TableQuery, TableQueryType } from 'owa-mail-list-store';
import type { ObservableMap } from 'mobx';
import type { PillSuggestion } from 'owa-search-service/lib/data/schema/SuggestionSet';
import type { SearchScope } from 'owa-search-service/lib/data/schema/SearchScope';
import type ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import type { SearchProvider } from 'owa-search-service';
import type ViewFilter from 'owa-service/lib/contract/ViewFilter';

/**
 * Creates the table query for search table.
 */
export default function createMailSearchTableQuery(
    searchNumber: number,
    queryString: string,
    searchScope: SearchScope,
    selectedPillSuggestions: ObservableMap<string, PillSuggestion>,
    listViewType: ReactListViewType,
    includeAttachments: boolean,
    fromDate: OwaDate,
    toDate: OwaDate,
    searchProvider: SearchProvider,
    appliedFilter?: ViewFilter
): TableQuery {
    const pillSuggestions = [...selectedPillSuggestions.values()];

    const searchTableQuery: SearchTableQuery = {
        folderId: null,
        type: TableQueryType.Search,
        listViewType: listViewType,
        searchNumber: searchNumber,
        queryString: queryString,
        searchScope: searchScope,
        pillSuggestions: pillSuggestions,
        includeAttachments: includeAttachments,
        fromDate: fromDate,
        toDate: toDate,
        scenarioType: 'mail',
        lastIndexFetched: 0,
        searchProvider: searchProvider,
        viewFilter: appliedFilter ? appliedFilter : 'All',
    };

    return searchTableQuery;
}
