import type { TableView } from 'owa-mail-list-store';
import { lazyLoadMoreInTable, getCanTableLoadMore } from '../index';
import { INITIAL_LOAD_ROW_COUNT } from 'owa-mail-triage-table-utils';

/**
 * Returns flag indicating whether we should try to load more in the given table on row remove
 * @param tableView where row is removed
 */
function shouldLoadMoreOnRowRemove(tableView: TableView): boolean {
    return (
        tableView.rowKeys.length < INITIAL_LOAD_ROW_COUNT &&
        !tableView.isLoading &&
        getCanTableLoadMore(tableView)
    );
}

/** Try loading more in table when after row removal
 * @param tableView where row is removed
 */
export function tryLoadMoreUponRowRemove(tableView: TableView) {
    // Loading of more rows should be done asynchronously
    // We must check shouldLoadMoreOnRowRemove again after setTimeout
    if (shouldLoadMoreOnRowRemove(tableView)) {
        lazyLoadMoreInTable.importAndExecute(tableView);
    }
}
