import * as mruTableIdList from './mruTableIdList';
import { tryUpdateAlwaysInCacheTableViews } from './alwaysInCacheTableViews';
import { TableQueryType, TableView } from 'owa-mail-list-store';

export function updateTablesInCache(
    tableView: TableView,
    shouldAddToFront: boolean = true
): number | undefined {
    if (tableView.tableQuery.type == TableQueryType.Search) {
        throw new Error('updateTablesInCache should never be called for Search table');
    }

    if (tryUpdateAlwaysInCacheTableViews(tableView)) {
        return 0;
    } else {
        return mruTableIdList.update(tableView, shouldAddToFront);
    }
}
