import type ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { TableQuery, TableQueryType } from 'owa-mail-list-store';
import type { SearchTableQuery } from 'owa-mail-list-search';
import {
    primaryMailboxSearchScope,
    PeopleSuggestion,
    SuggestionKind,
    SearchScopeKind,
} from 'owa-search-service';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import createPersonaSearchQueryString from './createPersonaSearchQueryString';
import { defaultMailSearchStore } from '../store/store';
import { PeopleSearchPrefix } from '../store/schema/PeopleSearchPrefix';

// We use this tableQuery for fallback favorite persona search which is triggered while
// the search folder persona is being populated.
export default function createFallbackPersonaSearchTableQuery(
    displayName: string,
    emailAddresses: string[],
    listViewType: ReactListViewType,
    doNotShowPillSuggestions: boolean = false
): TableQuery {
    const persona: PeopleSuggestion = {
        kind: SuggestionKind.People,
        DisplayName: displayName,
        HighlightedDisplayName: displayName,
        EmailAddresses: emailAddresses,
        ReferenceId: undefined,
        Attributes: undefined,
        Source: 'none',
    };

    const rootFolderId = primaryMailboxSearchScope({
        folderId: folderNameToId('msgfolderroot'),
        kind: SearchScopeKind.PrimaryMailbox,
    });

    const searchTableQuery: SearchTableQuery = {
        folderId: null,
        searchNumber: null,
        type: TableQueryType.Search,
        listViewType: listViewType,
        searchScope: rootFolderId,
        queryString: createPersonaSearchQueryString(persona, PeopleSearchPrefix.From),
        pillSuggestions: doNotShowPillSuggestions ? [] : [persona],
        includeAttachments: defaultMailSearchStore.includeAttachments,
        fromDate: defaultMailSearchStore.fromDate,
        toDate: defaultMailSearchStore.toDate,
        scenarioType: 'persona',
    };

    return searchTableQuery;
}
