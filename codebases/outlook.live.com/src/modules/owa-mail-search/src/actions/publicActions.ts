import type { SearchTableQuery } from 'owa-mail-list-search';
import type { PerformanceDatapoint } from 'owa-analytics';
import type { MailListRowDataType, TableQuery } from 'owa-mail-list-store';
import type { ActionSource } from 'owa-mail-store';
import type { SearchScope, SearchScopeKind } from 'owa-search-service';
import { action } from 'satcheljs';

export interface LoadTableViewFromSearchTableQueryActionMessage {
    searchTableQuery: TableQuery;
    searchEndToEndPerformanceDatapoint: PerformanceDatapoint;
    actionSource: ActionSource;
}

/**
 * Dispatched to clear current search scope (i.e. change it to broadest scope).
 * Action message provides option to kick off search after scope is changed.
 *
 * Currently, this action is only used in MailListEmptyViewState component.
 */
export const clearSearchScope = action(
    'CLEAR_SEARCH_SCOPE',
    (actionSource: string, shouldStartSearch: boolean, searchScopeKind: SearchScopeKind) => ({
        actionSource,
        shouldStartSearch,
        searchScopeKind,
    })
);

export const loadMessageSuggestionIntoTable = action(
    'LOAD_MESSAGE_SUGGESTION_INTO_TABLE',
    (
        actionSource: string,
        row: MailListRowDataType,
        searchTableQuery: SearchTableQuery,
        referenceId: string,
        traceId: string,
        itemPartId?: string
    ) => ({
        actionSource,
        row,
        searchTableQuery,
        referenceId,
        traceId,
        itemPartId,
    })
);

export const loadTableViewFromSearchTableQuery = action(
    'LOAD_TABLE_VIEW_FROM_SEARCH_TABLE_QUERY',
    (
        searchTableQuery: TableQuery,
        searchEndToEndPerformanceDatapoint: PerformanceDatapoint,
        actionSource: ActionSource
    ) => ({
        searchTableQuery: searchTableQuery,
        searchEndToEndPerformanceDatapoint: searchEndToEndPerformanceDatapoint,
        actionSource: actionSource,
    })
);

export const setStaticSearchScope = action(
    'SET_STATIC_SEARCH_SCOPE',
    (searchScope: SearchScope) => ({
        searchScope,
    })
);

export const startSearchWithCategory = action(
    'START_SEARCH_WITH_CATEGORY',
    (actionSource: string, categoryName: string) => ({
        actionSource: actionSource,
        categoryName: categoryName,
    })
);

export const findEmailFromSender = action(
    'FIND_EMAIL_FROM_SENDER_CLICKED',
    (senderName: string, senderEmail: string) => ({
        senderName,
        senderEmail,
    })
);

export const setShouldShowAdvancedSearch = action(
    'SET_SHOULD_SHOW_ADVANCED_SEARCH',
    (isVisible: boolean) => ({
        isVisible,
    })
);

/**
 * Action to when Answer rendered is rendered
 */
export const onAnswerRendered = action('ON_ANSWER_RENDERED');
