import type ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { TableQuery, TableQueryType } from 'owa-mail-list-store';
import type { SearchTableQuery } from 'owa-mail-list-search';
import {
    CategorySearchSuggestion,
    SearchScopeKind,
    primaryMailboxSearchScope,
    SuggestionKind,
} from 'owa-search-service';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import { getCategoryIdFromName, getMasterCategoryList } from 'owa-categories';
import { getGuid } from 'owa-guid';
import { defaultMailSearchStore } from '../store/store';

// We use this tableQuery for fallback favorite category search which is triggered while
// the search folder category is being populated
export default function createFallbackCategorySearchTableQuery(
    categoryName: string,
    listViewType: ReactListViewType
): TableQuery {
    // Add category pill
    const categoryPill: CategorySearchSuggestion = {
        kind: SuggestionKind.Category,
        Name: categoryName,
        ReferenceId: getCategoryIdFromName(categoryName, getMasterCategoryList()) || getGuid(),
    };

    // Whenever a favorite category node is selected right after being favorited, we always do a search within the primary mailbox scope
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
        queryString: 'category: ' + categoryName,
        pillSuggestions: [categoryPill],
        includeAttachments: defaultMailSearchStore.includeAttachments,
        fromDate: defaultMailSearchStore.fromDate,
        toDate: defaultMailSearchStore.toDate,
        scenarioType: 'category',
    };

    return searchTableQuery;
}
