import prefetchRow, { prefetchRowBasedOnRowId } from './helper/prefetchRow';
import type { TableView } from 'owa-mail-list-store';
import type { ClientItemId } from 'owa-client-ids';

/**
 * Prefetch utility that is responsible for doing 3 kinds of row Prefetches
 * 1. Prefetch a new row.
 * 2. Prefetch first N rows in a tableView.
 * 3. Prefetch adjacent rows to a given row.
 */

const PREFETCH_ADJACENT_DELAY_MS: number = 1000;

export function prefetchRowInCache(rowId: ClientItemId, tableView: TableView) {
    const listViewType = tableView.tableQuery.listViewType;
    prefetchRowBasedOnRowId(
        rowId,
        true /* updateOnlyIfModelExistsInCache */,
        'PrefetchRowInCache',
        listViewType
    );
}

/**
 * Prefetches the given row
 * @param - rowKey - of the row that needs to be prefetched
 * @param - tableView - table view where in the row needs to prefetch
 * @param - updateOnlyIfModelExistsInCache - Flag indicating to update the row only if it is cached to get latest data for it
 */
export function prefetchSingleRow(
    rowKey: string,
    tableView: TableView,
    updateOnlyIfModelExistsInCache: boolean
) {
    prefetchRow(rowKey, tableView, updateOnlyIfModelExistsInCache, 'PrefetchSingleRow');
}

/**
 * Prefetch first N rows. We would prefetch rows after the initial load of the table.
 * @param - tableView - where we are trying to prefetch
 * @param - countToPrefetch - number of rows we are trying to prefetch
 */
export function prefetchFirstN(tableView: TableView, countToPrefetch: number): void {
    const maxRowsToPrefetch = Math.min(tableView.rowKeys.length, countToPrefetch);
    for (let i = 0; i < maxRowsToPrefetch; i++) {
        // We want to ignore the getItem error for prefetch top N, because each prefetch was queued in the prefetch framework.
        // And it is possible that the prefetchFirstN started before the row was deleted by user, which results in
        // GetItem returning an error message with object not found on the server.
        prefetchRow(
            tableView.rowKeys[i],
            tableView,
            false /* updateOnlyIfModelExistsInCache */,
            'PrefetchFirstN'
        );
    }
}

let propagateAdjacentRowsOnDelayTask: NodeJS.Timer;

/**
 * Prefetches the next and previous rows for a given rowKey
 * @param - rowKey - rowKey of the row of which the adjacent rows are to be prefetched
 * @param - tableView - tableView in which the row needs to be prefetched
 */
export function prefetchAdjacentRowsOnDelay(rowKey: string, tableView: TableView): void {
    // If user has already moved onto another row before we prefetched adjacent rows, ignore the
    // last prefetch request and start new one for current row. Otherwise if user is scrolling down
    // quickly through list view, we will be doing a bunch of extra server calls.
    if (propagateAdjacentRowsOnDelayTask) {
        clearTimeout(propagateAdjacentRowsOnDelayTask);
        propagateAdjacentRowsOnDelayTask = null;
    }
    // Prefetch adjacent rows on delay to not block fetching of current row
    propagateAdjacentRowsOnDelayTask = setTimeout(() => {
        propagateAdjacentRowsOnDelayTask = null;
        const rowIndex = tableView.rowKeys.indexOf(rowKey);
        // Prefetch previous
        let rowIndexToPrefetch = rowIndex - 1;
        if (rowIndexToPrefetch >= 0) {
            prefetchRow(
                tableView.rowKeys[rowIndexToPrefetch],
                tableView,
                false /* updateOnlyIfModelExistsInCache */,
                'PrefetchAdjacentRowsOnDelay'
            );
        }

        // Prefetch next
        rowIndexToPrefetch = rowIndex + 1;
        if (rowIndexToPrefetch < tableView.rowKeys.length) {
            prefetchRow(
                tableView.rowKeys[rowIndexToPrefetch],
                tableView,
                false /* updateOnlyIfModelExistsInCache */,
                'PrefetchAdjacentRowsOnDelay'
            );
        }
    }, PREFETCH_ADJACENT_DELAY_MS);
}
