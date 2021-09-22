import { action } from 'satcheljs';
import type { TableView } from 'owa-mail-list-store';
import type { OnLoadMoreRowsFailed, OnLoadMoreRowsSucceeded } from 'owa-mail-loading-action-types';

/**
 * Action which triggers the find item search and loads more rows
 */
export const loadMoreFindItemSearch = action(
    'LOAD_MORE_FIND_ITEM_SEARCH',
    (
        offset: number,
        tableView: TableView,
        actionSource: string,
        onLoadMoreRowsSucceeded: OnLoadMoreRowsSucceeded,
        onLoadMoreRowsFailed: OnLoadMoreRowsFailed
    ) => ({
        offset,
        tableView,
        actionSource,
        onLoadMoreRowsSucceeded,
        onLoadMoreRowsFailed,
    })
);

export const loadMoreSubstrateSearch = action(
    'loadMoreSubstrateSearch',
    (
        offset: number,
        tableView: TableView,
        actionSource: string,
        onLoadMoreRowsSucceeded: OnLoadMoreRowsSucceeded,
        onLoadMoreRowsFailed: OnLoadMoreRowsFailed
    ) => ({ offset, tableView, actionSource, onLoadMoreRowsSucceeded, onLoadMoreRowsFailed })
);
