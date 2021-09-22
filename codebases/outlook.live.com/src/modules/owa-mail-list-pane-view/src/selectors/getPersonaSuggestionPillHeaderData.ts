import { listViewStore, TableQueryType } from 'owa-mail-list-store';
import type { SearchTableQuery } from 'owa-mail-list-search';
import { PeopleSuggestion, SuggestionKind } from 'owa-search-service/lib/data/schema/SuggestionSet';

export function getPersonaSuggestionPillHeaderData(
    tableViewId: string | undefined
): PeopleSuggestion[] {
    if (tableViewId) {
        const tableView = listViewStore.tableViews.get(tableViewId);
        if (tableView.tableQuery.type != TableQueryType.Search) {
            throw new Error(
                'getPersonaSuggestionPillHeaderData should not be called for non-search scenario'
            );
        }

        const searchTableQuery = tableView.tableQuery as SearchTableQuery;
        const personaSuggestions = searchTableQuery.pillSuggestions.filter(suggestion => {
            return suggestion.kind == SuggestionKind.People;
        });

        // Fow now, we only handle the case where all search suggestion pills are of type persona.
        if (searchTableQuery.pillSuggestions.length === personaSuggestions.length) {
            return personaSuggestions as PeopleSuggestion[];
        }
    }

    return null;
}
