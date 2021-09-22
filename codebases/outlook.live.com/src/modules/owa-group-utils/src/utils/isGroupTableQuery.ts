import type { SearchTableQuery } from 'owa-mail-list-search';
import { TableQuery, TableQueryType } from 'owa-mail-list-store';
import { SingleGroupSearchScope, SearchScopeKind } from 'owa-search-service';

export default function isGroupTableQuery(tableQuery: TableQuery): boolean {
    if (!tableQuery) {
        return false;
    }

    return tableQuery.type == TableQueryType.Group || isGroupSearch(tableQuery);
}

export function isGroupSearch(tableQuery: TableQuery): boolean {
    if (!tableQuery || tableQuery.type != TableQueryType.Search) {
        return false;
    }

    const searchTableQuery = tableQuery as SearchTableQuery;
    return searchTableQuery.searchScope.kind == SearchScopeKind.Group;
}

export function getGroupIdFromTableQuery(tableQuery: TableQuery) {
    if (tableQuery.type == TableQueryType.Group) {
        return tableQuery.folderId;
    }

    if (isGroupSearch(tableQuery)) {
        const singleGroupSearchScope = (tableQuery as SearchTableQuery)
            .searchScope as SingleGroupSearchScope;
        return singleGroupSearchScope.groupId;
    }

    return null;
}
