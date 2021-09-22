import type { ObservableMap } from 'mobx';
import type { TableView } from 'owa-mail-list-store';
import listViewStore from 'owa-mail-list-store/lib/store/Store';
import TableOperations from 'owa-mail-list-table-operations';
import { action } from 'satcheljs/lib/legacy';
import type { PerformanceDatapoint } from 'owa-analytics';

export interface CleanSearchTableState {
    tableViews: ObservableMap<string, TableView>;
}

/**
 * Cleans the search table from list view store.
 * @param searchTableView - search table
 */
export default action('cleanSearchTableState')(function cleanSearchTableState(
    searchTableView: TableView,
    actionDatapoint: PerformanceDatapoint,
    state: CleanSearchTableState = { tableViews: listViewStore.tableViews }
) {
    // Remove all rows from listview store for search table and
    // Also delete the search table
    const searchTableViewId = searchTableView.id;
    if (actionDatapoint) {
        actionDatapoint.addCheckmark('cleanSearchTable_s');
    }
    // VSO - 15466 - [Perf] cleaning of a table should be done async, and optimize the amount of work it does.
    // TODO - call remove table from store instead.
    TableOperations.clear(searchTableView, null /* skipRowsNewerThanTime*/);
    state.tableViews.delete(searchTableViewId);
    if (actionDatapoint) {
        actionDatapoint.addCheckmark('cleanSearchTable_e');
    }
});
