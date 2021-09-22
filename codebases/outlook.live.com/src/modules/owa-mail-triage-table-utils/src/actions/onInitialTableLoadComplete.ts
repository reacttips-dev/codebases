import { action } from 'satcheljs';
import type { TableView } from 'owa-mail-list-store';

export const onInitialTableLoadComplete = action(
    'ON_INITIAL_TABLE_LOAD_COMPLETE',
    (tableView: TableView) => ({
        tableView: tableView,
    })
);
