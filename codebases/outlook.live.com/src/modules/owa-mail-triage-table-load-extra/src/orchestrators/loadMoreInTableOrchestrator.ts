import { orchestrator } from 'satcheljs';
import { onInitialTableLoadComplete } from 'owa-mail-triage-table-utils';
import { getCanTableLoadMore } from '../utils/getCanTableLoadMore';
import { lazyLoadMoreInTable } from '../index';

orchestrator(onInitialTableLoadComplete, actionMessage => {
    const tableView = actionMessage.tableView;

    // Loading of more rows should be done asynchronously
    // We must check getCanTableLoadMore again after import
    if (tableView && getCanTableLoadMore(tableView)) {
        lazyLoadMoreInTable.import().then(loadMoreInTable => {
            if (getCanTableLoadMore(tableView)) {
                loadMoreInTable(tableView);
            }
        });
    }
});
