import { listViewStore, TableQueryType } from 'owa-mail-list-store';
import type { SearchTableQuery } from 'owa-mail-list-search';
import {
    PrivateDistributionListSuggestion,
    SuggestionKind,
} from 'owa-search-service/lib/data/schema/SuggestionSet';

export function getPrivateDistributionListSuggestionPillHeaderData(
    tableViewId: string | undefined
): PrivateDistributionListSuggestion {
    if (tableViewId) {
        const tableView = listViewStore.tableViews.get(tableViewId);

        if (tableView.tableQuery.type != TableQueryType.Search) {
            throw new Error(
                'getPrivateDistributionListSuggestionPillHeaderData should not be called for non-search scenario'
            );
        }

        const searchTableQuery = tableView.tableQuery as SearchTableQuery;
        const pdlSuggestions = searchTableQuery.pillSuggestions.filter(suggestion => {
            return suggestion.kind == SuggestionKind.PrivateDistributionList;
        });

        // Fow now, we only handle the case where there is only one search suggestion pill and that is of type Private Distribution List.
        if (
            searchTableQuery.pillSuggestions.length === 1 &&
            pdlSuggestions &&
            pdlSuggestions.length == 1
        ) {
            return pdlSuggestions[0] as PrivateDistributionListSuggestion;
        }
    }

    return null;
}
